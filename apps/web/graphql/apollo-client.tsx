import {
  ApolloClient,
  from,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  split,
} from "@apollo/client";
import {onError} from "@apollo/client/link/error";
import {setContext} from "@apollo/client/link/context";
import {GetServerSidePropsContext} from "next";
import {useMemo} from "react";
import {
  AuthModel,
  RenewTokenDocument,
  RenewTokenMutation,
} from "../generated/graphql";
import {getMainDefinition} from "@apollo/client/utilities";
import {createClient} from "graphql-ws";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {w3cwebsocket} from "websocket";
import Router from "next/router";

let _graphQLApolloClientGlobal: ApolloClient<NormalizedCacheObject> | undefined;

export const getRenewAuthToken = async (
  headers?: Record<string, string>
): Promise<AuthModel> => {
  const newApolloClient = createGraphQLApolloClient(headers);
  const {data} = await newApolloClient.mutate<RenewTokenMutation>({
    mutation: RenewTokenDocument,
  });
  return data.renewToken;
};

//! Working only client side fetching
const _errorLink = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    console.log("OnError: ", operation.operationName);
    try {
      if (graphQLErrors) {
        graphQLErrors.map(({message, locations, path}) =>
          console.error(
            `Graphql Error: ${message}, Location: ${locations}, path: ${path}`
          )
        );

        if (operation.operationName === "RenewToken") {
          console.log("RenewToken error");

          // redirect to login
          Router.push("/auth/login");
          return;
        }

        for (let err of graphQLErrors) {
          switch (err.extensions.code) {
            // Apollo Server sets code to UNAUTHENTICATED
            // when an AuthenticationError is thrown in a resolver
            case "UNAUTHENTICATED":
              // Modify the operation context with a new token
              const oldHeaders = operation.getContext().headers;
              return new Observable((observer) => {
                getRenewAuthToken(oldHeaders)
                  .then(async (authModel: AuthModel) => {
                    const {accessToken, refreshToken} = authModel;
                    const headers = {
                      ...oldHeaders,
                      authorization: `Bearer ${accessToken}`,
                      refresh_token: refreshToken,
                    };
                    operation.setContext({headers});
                  })
                  .then(() => {
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    };
                    //! Retry last failed request
                    forward(operation).subscribe(subscriber);
                  })
                  .catch((error) => {
                    //! No refresh or client token available, we force user to login
                    observer.error(error);
                  });
              });
          }
        }
      }
      if (networkError) {
        console.log(networkError.message);
      }
    } catch (e) {
      console.log(e);
    }
  }
);

const createHttpLink = (headers?: Record<string, unknown>) => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_ENDPOINT,
    credentials: "include",
    headers,
    fetch,
  });
  return httpLink;
};

const createWSLink = () => {
  return new GraphQLWsLink(
    createClient({
      url: process.env.NEXT_PUBLIC_GRAPHQL_WSS_ENDPOINT,
      webSocketImpl: w3cwebsocket,
      lazy: true,
      connectionParams: async () => {
        console.log("Connection params WSS called");
        const authModel = await getRenewAuthToken(); // happens on the client
        return {
          Authorization: `Bearer ${authModel.accessToken}`,
        };

        //   //   return {
        //   //     headers: {
        //   //       authorization: _accessToken
        //   //         ? `Bearer ${authModel.accessToken}`
        //   //         : "Public",
        //   //     },
        //   //   };
      },
    })
  );
};

const splitLink = (headers?: Record<string, unknown>) => {
  return split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    createWSLink(),
    createHttpLink(headers)
  );
};

export function createGraphQLApolloClient(
  initHeaders?: Record<string, string>
): ApolloClient<NormalizedCacheObject> {
  const ssrMode = typeof window === "undefined";

  const auth = setContext((_, {headers}) => {
    return {headers: {...headers, ...initHeaders}};
  });

  const authLink = auth.concat(splitLink(initHeaders));

  return new ApolloClient({
    connectToDevTools: !ssrMode,
    ssrMode,
    link: from([_errorLink, authLink]),
    cache: new InMemoryCache(),
    credentials: "include",
  });
}

const _initialGraphQLApolloClient = (
  initialState?: NormalizedCacheObject,
  ctx?: GetServerSidePropsContext
) => {
  const headers = {} as Record<string, string>;

  //! Cookies
  if (ctx?.req.cookies["x-access-token"]) {
    headers["authorization"] = ctx.req.cookies["x-access-token"];
  }
  if (ctx?.req.cookies["x-refresh-token"]) {
    headers["x-refresh-token"] = ctx.req.cookies["x-refresh-token"];
  }

  //! Header (if cookies not existed)
  if (ctx?.req.headers["authorization"] && !headers["authorization"]) {
    headers["authorization"] = ctx.req.headers["authorization"];
  }
  if (ctx?.req.headers["x-refresh-token"] && !headers["x-refresh-token"]) {
    headers["x-refresh-token"] = ctx.req.cookies["x-refresh-token"];
  }

  const _apolloClient =
    _graphQLApolloClientGlobal ?? createGraphQLApolloClient(headers);

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({...existingCache, ...initialState});
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!_graphQLApolloClientGlobal) _graphQLApolloClientGlobal = _apolloClient;
  return _apolloClient;
};

const useApolloGraphQLClient = (initialState?: NormalizedCacheObject) =>
  useMemo(() => _initialGraphQLApolloClient(initialState), [initialState]);

const getApolloGraphQLClient = (ctx: GetServerSidePropsContext) =>
  _initialGraphQLApolloClient(undefined, ctx);

export function setApolloGraphQLClient(
  initHeaders?: Record<string, string>
): ApolloClient<NormalizedCacheObject> {
  _graphQLApolloClientGlobal = createGraphQLApolloClient(initHeaders);
  return _graphQLApolloClientGlobal;
}

export {gql, useApolloGraphQLClient};
export default getApolloGraphQLClient;

import {
  ApolloClient,
  FetchResult,
  from,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from "@apollo/client";
import {onError} from "@apollo/client/link/error";
import {setContext} from "@apollo/client/link/context";
import {GetServerSidePropsContext, NextPageContext} from "next";
import {useMemo} from "react";
import {
  AuthModel,
  RenewTokenDocument,
  RenewTokenMutation,
} from "../generated/graphql";

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
    console.log("OnError is activated", operation.operationName);
    try {
      if (graphQLErrors) {
        graphQLErrors.map(({message, locations, path}) =>
          console.error(
            `Graphql Error: ${message}, Location: ${locations}, path: ${path}`
          )
        );

        if (operation.operationName === "RenewToken") return;

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

export function createGraphQLApolloClient(
  initHeaders?: Record<string, string>
): ApolloClient<NormalizedCacheObject> {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    credentials: "include",
  });

  const authLink = setContext((_, {headers}) => {
    return {
      headers: {
        ...headers,
        ...initHeaders,
      },
    };
  });

  const link = authLink.concat(httpLink);

  return new ApolloClient({
    connectToDevTools: typeof window !== "undefined",
    ssrMode: typeof window === "undefined",
    link: from([_errorLink, link]),
    cache: new InMemoryCache(),
    credentials: "include",
  });
}

const _initialGraphQLApolloClient = (
  initialState?: NormalizedCacheObject,
  ctx?: GetServerSidePropsContext
) => {
  const headers = {} as Record<string, string>;

  if (ctx?.req.cookies.access_token) {
    headers["authorization"] = ctx.req.cookies.access_token;
  } else if (ctx?.req.cookies.refresh_token) {
    headers["refresh_token"] = ctx.req.cookies.refresh_token;
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

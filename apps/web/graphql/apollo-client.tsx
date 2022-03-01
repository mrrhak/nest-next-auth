import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {PropsWithChildren} from "react";
import {onError} from "@apollo/client/link/error";

const errorLink = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    try {
      if (graphQLErrors) {
        graphQLErrors.map(({message, locations, path}) =>
          console.error(
            `Graphql Error: ${message}, Location: ${locations}, path: ${path}`
          )
        );

        // for (let err of graphQLErrors) {
        //   switch (err.extensions.code) {
        //     // Apollo Server sets code to UNAUTHENTICATED
        //     // when an AuthenticationError is thrown in a resolver
        //     case "UNAUTHENTICATED":
        //       // Modify the operation context with a new token
        //       const oldHeaders = operation.getContext().headers;
        //       operation.setContext({
        //         headers: {
        //           ...oldHeaders,
        //           authorization: getNewToken(),
        //         },
        //       });
        //       // Retry the request, returning the new observable
        //       return forward(operation);
        //   }
        // }
      }
      if (networkError) {
        console.log(networkError.message);
      }
    } catch (e) {
      console.log(e);
    }
  }
);

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: "include",
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

const GraphQLApolloProvider: React.FC<PropsWithChildren<{}>> = ({children}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLApolloProvider;

// import {setContext} from "@apollo/client/link/context";
// import {createHttpLink, ApolloClient, InMemoryCache} from "@apollo/client";

// export const createApolloClient = (accessToken: string) => {
//   const ENDPOINT = `${API_URL}/graphql`;

//   const httpLink = createHttpLink({
//     uri: ENDPOINT,
//   });

//   const authLink = setContext((_, {headers}) => {
//     return {
//       headers: {
//         ...headers,
//         authorization: accessToken ? `Bearer ${accessToken}` : "",
//       },
//     };
//   });

//   return new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache(),
//   });
// };

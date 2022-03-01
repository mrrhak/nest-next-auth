import GraphQLApolloProvider from "../graphql/apollo-client";
import "../styles/globals.css";

function MyApp({Component, pageProps}) {
  return (
    <GraphQLApolloProvider>
      <Component {...pageProps} />
    </GraphQLApolloProvider>
  );
}

export default MyApp;

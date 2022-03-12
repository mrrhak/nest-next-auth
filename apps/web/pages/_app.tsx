import {ApolloProvider} from "@apollo/client";
import Navigation from "../components/navigation";
import {AuthUserProvider} from "../contexts/auth-user-context";
import {useApolloGraphQLClient} from "../graphql/apollo-client";
import "../styles/globals.css";

function MyApp({Component, pageProps}) {
  const graphQLApolloClient = useApolloGraphQLClient(
    pageProps.initialApolloState
  );
  return (
    <ApolloProvider client={graphQLApolloClient}>
      <AuthUserProvider initialAuthUser={pageProps?.authUser}>
        <Navigation />
        <Component {...pageProps} />
      </AuthUserProvider>
    </ApolloProvider>
  );
}

export default MyApp;

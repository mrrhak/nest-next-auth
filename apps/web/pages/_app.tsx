import {ApolloProvider} from "@apollo/client";
import {ToastContainer} from "react-toastify";
import Navigation from "../components/navigation";
import {AuthUserProvider} from "../contexts/auth-user-context";
import {useApolloGraphQLClient} from "../graphql/apollo-client";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

function MyApp({Component, pageProps}) {
  const graphQLApolloClient = useApolloGraphQLClient(
    pageProps.initialApolloState
  );
  return (
    <ApolloProvider client={graphQLApolloClient}>
      <AuthUserProvider initialAuthUser={pageProps?.authUser}>
        <Navigation />
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthUserProvider>
    </ApolloProvider>
  );
}

export default MyApp;

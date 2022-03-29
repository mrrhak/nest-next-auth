import {ApolloProvider} from "@apollo/client";
import {ToastContainer} from "react-toastify";
import Navigation from "../components/navigation";
import {useApolloGraphQLClient} from "../graphql/apollo-client";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import {AuthProvider} from "../contexts/auth-context";
import {useEffect, useState} from "react";
import {GetAuthUserQuery} from "../generated/graphql";
import fetchAuthUser from "../lib/fetch-auth-user";

function MyApp({Component, pageProps}) {
  const [authUser, setAuthUser] = useState<GetAuthUserQuery>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const graphQLApolloClient = useApolloGraphQLClient(
    pageProps.initialApolloState
  );

  useEffect(() => {
    const getMe = async () => {
      console.log("getMe");
      setLoading(true);
      const user = await fetchAuthUser();
      setLoading(false);
      if (user) setAuthUser(user);
    };

    getMe();
  }, []);

  return (
    <ApolloProvider client={graphQLApolloClient}>
      <AuthProvider initialAuthUser={authUser} loading={loading}>
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
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;

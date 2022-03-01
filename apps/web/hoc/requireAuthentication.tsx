import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {getCookies} from "cookies-next";

export function requireAuthentication(getServerSideProps: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    const {req, res} = ctx;

    if (req.headers.cookie) {
      const {access_token, refresh_token} = getCookies({req, res});
      // console.log(access_token, refresh_token);
      if (access_token) {
        //! Get user info from server
      } else if (refresh_token) {
        //! Refresh token
        //! Get user info from server
      } else {
        //! Redirect to signin
        return {
          redirect: {
            destination: "/auth/login",
            permanent: false,
          },
        };
      }
      //   const client = createApolloClient(accessToken);
      //   const GET_USER = getUserQuery;

      //   try {
      //     // Send a request to the API and verify that the user exists
      //     // Reject and redirect if the user is undefined or there is no accessToken
      //     const response = await client.query({query: GET_USER});
      //     const {getUser: user} = response.data;

      //     if (!accessToken || !user || !user.email) {
      //       return {
      //         redirect: {
      //           permanent: false,
      //           destination: "/auth",
      //         },
      //       };
      //     }
      //   } catch (error) {
      //     // Failure in the query or any error should fallback here
      //     // this route is possibly forbidden means the cookie is invalid
      //     // or the cookie is expired
      //     return {
      //       redirect: {
      //         permanent: false,
      //         destination: "/auth",
      //       },
      //     };
      // }
    }

    return await getServerSideProps(ctx);
  };
}

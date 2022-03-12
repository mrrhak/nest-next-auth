import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {getCookies} from "cookies-next";
import getApolloGraphQLClient, {
  createGraphQLApolloClient,
  getRenewAuthToken,
} from "../graphql/apollo-client";
import {
  GetAuthUserDocument,
  GetAuthUserQuery,
  GetAuthUserQueryResult,
  LogoutDocument,
  LogoutMutationResult,
} from "../generated/graphql";
import {GraphQLError} from "../graphql/interface/graphql-error.interface";

export function requireAuthentication(getServerSideProps: GetServerSideProps) {
  console.log("requireAuthentication executed");
  return async (ctx: GetServerSidePropsContext) => {
    const {req, res} = ctx;

    if (req.headers.cookie) {
      //! Get token from cookie
      const {access_token, refresh_token} = getCookies({req, res});

      if (access_token) {
        //! Get user info from server
        try {
          const client = getApolloGraphQLClient(ctx);
          const {data} = await client.query<GetAuthUserQuery>({
            query: GetAuthUserDocument,
          });
          if (data) {
            ctx["authUser"] = data;
          }
        } catch (error) {
          const graphQLErrors = error["graphQLErrors"][0] as GraphQLError;
          console.log(graphQLErrors);
          if (graphQLErrors.extensions.response.statusCode === 404) {
            //! Logout
            console.log("Request Logout");
            const client = getApolloGraphQLClient(ctx);
            const {data} = await client.mutate<LogoutMutationResult>({
              mutation: LogoutDocument,
            });
            console.log("Logout: ", data);
          } else if (graphQLErrors.extensions.response.statusCode === 404) {
          }
          if (error.message === "Unauthorized") {
            if (refresh_token) {
              console.log("Request Renew Token on access_token");
              const authModel = await getRenewAuthToken({refresh_token});
              console.log(authModel);
              //! Refresh token
              //! Get user info from server
            }
          }
        }
      } else if (refresh_token) {
        //! Refresh token
        console.log("Request Renew Token on expire");
        try {
          const authModel = await getRenewAuthToken({refresh_token});
          console.log(authModel);
          if (authModel) {
            const headers = {
              authorization: `Bearer ${authModel.accessToken}`,
              refresh_token: authModel.refreshToken,
            };
            //! Set cookie
            res.setHeader("set-cookie", [
              `access_token=${headers.authorization}; Path=/; httpOnly=true; SameSite=Lax;`,
              `refresh_token=${headers.refresh_token}; Path=/; httpOnly=true; SameSite=Lax;`,
            ]);
            //! Get user info from server
            const newClient = createGraphQLApolloClient(headers);
            const {data} = await newClient.query<GetAuthUserQuery>({
              query: GetAuthUserDocument,
            });
            if (data) {
              ctx["authUser"] = data;
            }
          }
        } catch (error) {
          console.log(error);
        }

        //! Get user info from server
      } else {
        //! Redirect to login
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

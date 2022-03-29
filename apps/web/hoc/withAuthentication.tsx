import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {getCookies} from "cookies-next";
import getApolloGraphQLClient, {
  getRenewAuthToken,
} from "../graphql/apollo-client";
import {
  GetAuthUserDocument,
  GetAuthUserQuery,
  LogoutDocument,
  LogoutMutationResult,
} from "../generated/graphql";
import {GraphQLError} from "../graphql/interface/graphql-error.interface";
import {ApolloClient, NormalizedCacheObject} from "@apollo/client";

export function withAuthentication(getServerSideProps: GetServerSideProps) {
  let authUser: GetAuthUserQuery | undefined;
  let headers: Record<string, string> | undefined;

  console.log("withAuthentication executed");
  return async (ctx: GetServerSidePropsContext) => {
    const {req, res} = ctx;

    if (req.headers.cookie) {
      //! Get token from cookie (browser request next server)
      const cookies = getCookies({req, res});
      const xAccessToken = cookies["x-access-token"];
      const xRefreshToken = cookies["x-refresh-token"];

      if (xAccessToken) {
        //! Get user info from server
        try {
          const client = getApolloGraphQLClient(ctx);
          const data = await queryAuthUser(client);
          //? Assign user to authUser (authenticated user)
          if (data) authUser = data;
        } catch (error) {
          const graphQLErrors = error["graphQLErrors"][0] as GraphQLError;
          const statusCode = graphQLErrors.extensions.response.statusCode;

          if (
            xRefreshToken &&
            (statusCode === 401 || error.message === "Unauthorized")
          ) {
            //!Unauthorized (expired x access token)
            console.log("Request Renew x-access-token");
            const authModel = await getRenewAuthToken({
              "x-refresh-token": xRefreshToken,
            });
            if (authModel) {
              //? Assign global headers
              headers = {
                authorization: `Bearer ${authModel.accessToken}`,
                "x-refresh-token": authModel.refreshToken,
              } as Record<string, string>;

              //? override request headers
              ctx.req.headers = {...ctx.req.headers, ...headers};

              //? get new client with new access token
              const newClient = getApolloGraphQLClient(ctx);

              //? query auth user
              const data = await queryAuthUser(newClient);
              if (data) authUser = data;
            }
          } else {
            //! Logout (not found user or something else)
            console.log("Request Logout");
            const client = getApolloGraphQLClient(ctx);
            const {data} = await client.mutate<LogoutMutationResult>({
              mutation: LogoutDocument,
            });
            console.log("Logout: ", data);
          }
        }
      } else if (xRefreshToken) {
        //! Refresh token
        console.log("Request Renew Token on expire");
        try {
          const authModel = await getRenewAuthToken({
            "x-refresh-token": xRefreshToken,
          });
          if (authModel) {
            headers = {
              authorization: `Bearer ${authModel.accessToken}`,
              "x-refresh-token": authModel.refreshToken,
            };
            //? override request headers
            ctx.req.headers = {...ctx.req.headers, ...headers};

            //? get new client with new access token
            const newClient = getApolloGraphQLClient(ctx);

            //? query auth user
            const data = await queryAuthUser(newClient);
            if (data) authUser = data;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    //! Set new cookies to browser if available
    if (headers) {
      console.log("Set new cookies to browser");
      ctx.res.setHeader("set-cookie", [
        `x-access-token=${headers["authorization"]}; Path=/; httpOnly=true; SameSite=Lax;`,
        `x-refresh-token=${headers["x-refresh-token"]}; Path=/; httpOnly=true; SameSite=Lax;`,
      ]);
    }

    //! Validate auth user
    if (!authUser) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    ctx["authUser"] = authUser;

    return await getServerSideProps(ctx);
  };
}

const queryAuthUser = async (
  client: ApolloClient<NormalizedCacheObject>
): Promise<GetAuthUserQuery | null> => {
  const {data} = await client.query<GetAuthUserQuery>({
    query: GetAuthUserDocument,
    fetchPolicy: "no-cache",
  });
  if (!data) return null;
  return data;
};

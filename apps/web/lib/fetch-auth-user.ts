import {ApolloClient, InMemoryCache} from "@apollo/client";
import {
  GetAuthUserDocument,
  GetAuthUserQuery,
  GetAuthUserQueryVariables,
  RenewTokenDocument,
  RenewTokenMutation,
  RenewTokenMutationVariables,
} from "../generated/graphql";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_ENDPOINT,
  credentials: "include",
  cache: new InMemoryCache(),
});

/**
 * fetchAuthUser
 * retry renew token if expired only one time
 * @returns {Promise<GetAuthUserQuery>}
 */
const fetchAuthUser = async (): Promise<GetAuthUserQuery | null> => {
  try {
    const {data, loading} = await client.query<
      GetAuthUserQuery,
      GetAuthUserQueryVariables
    >({query: GetAuthUserDocument});

    if (!loading && data) return data;
  } catch (e) {
    if (e.message === "Unauthorized") {
      // console.log("get authUser error: ", e.message);
      //! Refresh token
      try {
        const {data} = await client.mutate<
          RenewTokenMutation,
          RenewTokenMutationVariables
        >({mutation: RenewTokenDocument});
        if (data) {
          //! Get auth user again
          const {data, loading} = await client.query<
            GetAuthUserQuery,
            GetAuthUserQueryVariables
          >({query: GetAuthUserDocument});

          if (!loading && data) return data;
        }
      } catch (e) {
        // console.log("refresh error: ", e.message);
      }
    }
    return null;
  }
};

export default fetchAuthUser;

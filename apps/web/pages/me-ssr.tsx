import {GetServerSideProps} from "next";
import {Logout} from "../components/logout";
import {useAuthUser} from "../contexts/auth-user-context";
import {
  GetAuthUserDocument,
  GetAuthUserQuery,
  GetAuthUserQueryResult,
  GetAuthUserQueryVariables,
} from "../generated/graphql";
import getApolloGraphQLClient from "../graphql/apollo-client";
import {requireAuthentication} from "../hoc/requireAuthentication";

const Me = () => {
  const {authUser} = useAuthUser();

  return (
    <main className="flex items-center justify-center h-full pt-20">
      <div className="space-y-4 text-center">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">
          Client side authentication
        </h1>
        {authUser && <p>Hi, {authUser.getAuthUser.email} 👋</p>}
        <Logout />
      </div>
    </main>
  );
};

export default Me;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const client = getApolloGraphQLClient(context);
//     const {data, error} = await client.query<GetAuthUserQuery>({
//       query: GetAuthUserDocument,
//     });
//     console.log("getServerSideProps", data.getAuthUser);
//     context.res.setHeader("set-cookie", "foo=bar; Path=/");
//     if (data) {
//       return {
//         props: {
//           authUser: data,
//         },
//       };
//     }
//   } catch (error) {
//     console.log("getServerSideProps error", error);
//   }
//   context.res.setHeader("set-cookie", "foo=bar; Path=/; httpOnly=true");

//   return {
//     props: {},
//   };
// };

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context) => {
    const authUser = context["authUser"] ?? null;
    console.log(authUser);

    return {
      props: {
        authUser,
      },
    };
  }
);

import {getCookies} from "cookies-next";
import {GetServerSideProps, NextPageContext} from "next";
import {useRouter} from "next/router";
import {
  useGetAuthUserLazyQuery,
  useLogoutMutation,
} from "../../generated/graphql";

const Profile = ({authUser}) => {
  const router = useRouter();
  console.log("Profile get");
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation()
      .then(() => {
        router.push("/auth/login");
      })
      .catch((err) => {
        console.log(err.message);
        if (err.message === "Unauthorized") {
        }
      });
  };

  const [getAuthUser, {data, loading, error}] = useGetAuthUserLazyQuery({
    fetchPolicy: "network-only",
  });

  const handleGetUser = () => {
    getAuthUser();
  };

  console.log("Profile render:", data);

  return (
    <div>
      <h1>Profile</h1>
      <p>{authUser?.firstName}</p>
      <p>{authUser?.lastName}</p>
      <p>{authUser?.username}</p>
      <p>{authUser?.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleGetUser}>Get User</button>
    </div>
  );
};

export default Profile;

// Profile.getInitialProps = async (ctx: NextPageContext) => {
//   const {req, res} = ctx;
//   const {access_token} = getCookies({req, res});

//   // if (!access_token) {
//   //   res.writeHead(302, {
//   //     Location: "/auth/login",
//   //   });
//   //   res.end();
//   //   return {};
//   // }
//   return {};
// };

// export const getServerSideProps: GetServerSideProps = requireAuthentication(
//   async (_ctx) => {
//     console.log("Profile getServerSideProps");
//     const authUser = _ctx["authUser"] ?? null;
//     return {
//       props: {
//         authUser,
//       },
//     };
//   }
// );

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();

//   await apolloClient.query({
//     query: ALL_COUNTRIES_QUERY,
//   });

//   await apolloClient.query({
//     query: ALL_CLUBS_QUERY,
//   });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//     revalidate: 1,
//   };
// }

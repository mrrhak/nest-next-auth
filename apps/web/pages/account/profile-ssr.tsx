import {getCookies} from "cookies-next";
import {GetServerSideProps, NextPageContext} from "next";
import {useRouter} from "next/router";
import {type} from "os";
import {useCallback} from "react";
import {
  GetAuthUserQuery,
  useGetAuthUserLazyQuery,
  useLogoutMutation,
} from "../../generated/graphql";
import {withAuthentication} from "../../hoc/withAuthentication";

type ProfileProps = {
  authUser: GetAuthUserQuery;
};

const ProfileSSR = ({authUser}: ProfileProps) => {
  const router = useRouter();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    await logoutMutation();
    router.push("/auth/login");
  }, [logoutMutation, router]);

  return (
    <div>
      <h1>Profile</h1>
      <p>{authUser.getAuthUser.firstName}</p>
      <p>{authUser.getAuthUser.lastName}</p>
      <p>{authUser.getAuthUser.username}</p>
      <p>{authUser.getAuthUser.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfileSSR;

export const getServerSideProps: GetServerSideProps = withAuthentication(
  async (context) => {
    //! if no auth user, redirect to login inside withAuthentication
    const authUser = context["authUser"] as GetAuthUserQuery;
    console.log(authUser);
    return {
      props: {
        authUser,
      },
    };
  }
);

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

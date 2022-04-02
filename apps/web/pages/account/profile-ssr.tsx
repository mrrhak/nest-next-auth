import {GetServerSideProps} from "next";
import {GetAuthUserQuery} from "../../generated/graphql";
import {withAuthentication} from "../../hoc/withAuthentication";

type ProfileProps = {
  authUser: GetAuthUserQuery;
};

const ProfileSSR = ({authUser}: ProfileProps) => {
  return (
    <div>
      <h1>Profile</h1>
      <p>{authUser.getAuthUser.firstName}</p>
      <p>{authUser.getAuthUser.lastName}</p>
      <p>{authUser.getAuthUser.username}</p>
      <p>{authUser.getAuthUser.email}</p>
    </div>
  );
};

export default ProfileSSR;

export const getServerSideProps: GetServerSideProps = withAuthentication(
  async (context) => {
    //! if no auth user, redirect to login inside withAuthentication
    const authUser = context["authUser"] as GetAuthUserQuery;
    // console.log(authUser);
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

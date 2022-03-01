import {useRouter} from "next/router";
import {useLoginMutation} from "../../generated/graphql";

const Login = () => {
  const router = useRouter();
  const [loginMutation, {data, loading, error}] = useLoginMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    let usernameOrEmail = e.target.elements.usernameOrEmail?.value;
    let password = e.target.elements.password?.value;

    try {
      await loginMutation({
        variables: {
          input: {
            usernameOrEmail,
            password,
          },
        },
      });
    } catch (_) {}
  };

  if (data) {
    router.push("/profile");
  } else if (error) {
    console.log(error.message);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-8">
        <h1 className="text-center font-bold text-xl uppercase">
          Login to your account
        </h1>

        <form onSubmit={handleFormSubmit} className="mt-4">
          <div className="flex flex-col">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              type="text"
              id="usernameOrEmail"
              placeholder="Username or Email"
              className="rounded"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="rounded"
            />
          </div>
          <div className=" text-center mt-4">
            <button className="bg-blue-500 text-white w-36 py-2 rounded">
              {loading ? "Processing..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

//! Running at server side (can not redirect)
// Login.getInitialProps = async ({req}) => {
//   console.log("getInitialProps");
//   const cookie = req.cookies["some-cookie"] ?? {};
//   console.log(cookie);
//   return cookie;
// };

//! Running at server side (can redirect)
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   console.log("getServerSideProps");
//   const cookie = context.req.cookies["some-cookie"] ?? {};
//   console.log(cookie);

//   // if (cookie) {
//   //   return {
//   //     redirect: {
//   //       destination: "/home",
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   return {
//     props: {}, // will be passed to the page component as props
//   };
// };

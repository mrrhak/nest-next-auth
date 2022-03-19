import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {useLoginMutation} from "../../generated/graphql";
import {UserIcon, LockClosedIcon} from "@heroicons/react/outline";
import Image from "next/image";
import {useCallback} from "react";
import {toast, TypeOptions} from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [loginMutation, {data, loading}] = useLoginMutation();

  //! Toast
  const notify = useCallback((type: TypeOptions, message: string) => {
    toast(message, {
      position: "top-center",
      autoClose: 5000,
      type,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSubmit = async (data: any) => {
    const {usernameOrEmail, password} = data;
    try {
      await loginMutation({
        variables: {
          input: {
            usernameOrEmail,
            password,
          },
        },
      });
    } catch (error) {
      notify("error", error.message);
    }
  };

  if (data) {
    router.push("/");
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100 items-center justify-center px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-96 bg-white rounded-lg shadow-2xl"
      >
        <div className="flex font-bold justify-center mt-6">
          <Image
            className="h-20 w-20"
            src="/images/avatar.svg"
            alt="avatar"
            width={80}
            height={80}
          />
        </div>
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-4 uppercase">
          Login
        </h2>
        <div className="px-6 pb-8">
          <div className="w-full mb-2">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 ml-4 text-gray-400 z-10 " />
              <input
                {...register("usernameOrEmail", {required: true})}
                name="usernameOrEmail"
                id="usernameOrEmail"
                type="text"
                placeholder="Username or email"
                className="-ml-8 px-10 w-full border rounded text-gray-700 focus:outline-none"
              />
            </div>
            {errors.usernameOrEmail && (
              <p className="text-sm text-red-500 ml-1">
                Username or email is required
              </p>
            )}
          </div>
          <div className="w-full mb-2">
            <div className="flex items-center">
              <LockClosedIcon className="h-5 w-5 ml-4 text-gray-400 z-10 " />
              <input
                {...register("password", {required: true, minLength: 3})}
                name="password"
                id="password"
                type="password"
                placeholder="Password"
                className="-ml-8 px-10  w-full border rounded text-gray-700 focus:outline-none"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500  ml-1">Password is required</p>
            )}
          </div>
          <button className="text-xs text-gray-500 float-right mb-4">
            Forgot Password?
          </button>
          <button className="w-full py-2 rounded-full bg-green-600 text-gray-100 focus:outline-none">
            {loading ? "Processing..." : "Login"}
          </button>
        </div>
      </form>

      <button
        onClick={() => router.push("/auth/register")}
        className="text-sm font-semibold text-blue-500 float-right mt-4"
      >
        Don&apos;t have an account?
      </button>
    </div>
  );
};

export default Login;

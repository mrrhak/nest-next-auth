import {LockClosedIcon, UserIcon} from "@heroicons/react/outline";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {useRegisterMutation} from "../../generated/graphql";

const Register = () => {
  const router = useRouter();
  const [registerMutation, {data, loading, error}] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSubmit = async (data: any) => {
    const {firstName, lastName, username, email, password} = data;
    try {
      await registerMutation({
        variables: {
          input: {
            firstName,
            lastName,
            username,
            email,
            password,
          },
        },
      });
    } catch (_) {}
  };

  if (data) {
    router.push("/account/profile");
  } else if (error) {
    console.log(error.message);
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100 items-center justify-center px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-96 bg-white rounded-lg shadow-2xl"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-700 my-4 uppercase">
          Register
        </h2>
        <div className="px-6 pb-8">
          <div className="w-full mb-2">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 ml-4 text-gray-400 z-10 " />
              <input
                {...register("firstName", {required: true})}
                name="firstName"
                id="firstName"
                type="text"
                placeholder="First name"
                className="-ml-8 px-10 w-full border rounded text-gray-700 focus:outline-none"
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500 ml-1">
                First name is required
              </p>
            )}
          </div>
          <div className="w-full mb-2">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 ml-4 text-gray-400 z-10 " />
              <input
                {...register("lastName", {required: true})}
                name="lastName"
                id="lastName"
                type="text"
                placeholder="Last name"
                className="-ml-8 px-10 w-full border rounded text-gray-700 focus:outline-none"
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500 ml-1">Last name is required</p>
            )}
          </div>
          <div className="w-full mb-2">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 ml-4 text-gray-400 z-10 " />
              <input
                {...register("email", {required: true})}
                name="email"
                id="email"
                type="text"
                placeholder="Email"
                className="-ml-8 px-10 w-full border rounded text-gray-700 focus:outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 ml-1">Email is required</p>
            )}
          </div>
          <div className="w-full mb-2">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 ml-4 text-gray-400 z-10 " />
              <input
                {...register("username", {required: true})}
                name="username"
                id="username"
                type="text"
                placeholder="Username"
                className="-ml-8 px-10 w-full border rounded text-gray-700 focus:outline-none"
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-500 ml-1">Username is required</p>
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
            {errors.password && errors.password.type === "required" && (
              <p className="text-sm text-red-500  ml-1">Password is required</p>
            )}
            {errors.password && errors.password.type === "minLength" && (
              <p className="text-sm text-yellow-500  ml-1">
                Password is required at least 3 characters{" "}
              </p>
            )}
          </div>
          <button className="mt-4 w-full py-2 rounded-full bg-green-600 text-gray-100 focus:outline-none">
            {loading ? "Processing..." : "Register"}
          </button>
        </div>
      </form>

      <button
        onClick={() => router.push("/auth/login")}
        className="text-sm font-semibold text-blue-500 float-right mt-4"
      >
        Already have an account?
      </button>
    </div>
  );
};

export default Register;

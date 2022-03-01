import {useRouter} from "next/router";
import {useRegisterMutation} from "../../generated/graphql";

const Register = () => {
  const router = useRouter();
  const [registerMutation, {data, loading, error}] = useRegisterMutation();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    const firstName = e.target.elements.firstName?.value;
    const lastName = e.target.elements.lastName?.value;
    const username = e.target.elements.username?.value;
    const email = e.target.elements.email?.value;
    const password = e.target.elements.password?.value;

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
    router.push("/profile");
  } else if (error) {
    console.log(error.message);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-8">
        <h1 className="text-center font-bold text-xl uppercase">
          Register an account
        </h1>

        <form onSubmit={handleFormSubmit} className="mt-4">
          <div className="flex flex-col">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              className="rounded"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              className="rounded"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="rounded"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
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
            <button className="bg-green-500 text-white w-36 py-2 rounded">
              {loading ? "Processing..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

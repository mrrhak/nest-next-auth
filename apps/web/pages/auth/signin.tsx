const SignIn = () => {
  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    let email = e.target.elements.email?.value;
    let password = e.target.elements.password?.value;

    console.log(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-8">
        <h1 className="text-center font-bold text-xl">
          Sign in to your account
        </h1>

        <form onSubmit={handleFormSubmit} className="mt-4">
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              className="rounded"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Your Password"
              className="rounded"
            />
          </div>
          <div className=" text-center mt-4">
            <button className="bg-blue-500 text-white w-36 py-2 rounded">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

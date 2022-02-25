const SignUp = () => {
  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    let email = e.target.elements.email?.value;
    let password = e.target.elements.password?.value;

    console.log(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-8">
        <h1 className="text-center font-bold text-xl">Sign Up an account</h1>

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
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

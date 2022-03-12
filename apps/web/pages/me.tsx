import Router from "next/router";
import {useEffect} from "react";
import {Logout} from "../components/logout";
import {useAuthUser} from "../contexts/auth-user-context";
import {useGetAuthUserLazyQuery} from "../generated/graphql";

const Me = () => {
  const {authUser, setAuthUser} = useAuthUser();
  const [getAuthUser] = useGetAuthUserLazyQuery();

  useEffect(() => {
    const getMe = async () => {
      const {data, error} = await getAuthUser();
      if (!error && data) setAuthUser(data);
      else Router.push("/");
    };
    console.log("Me page useEffect");

    if (!authUser) getMe();
  }, [authUser, getAuthUser, setAuthUser]);

  return (
    <main className="flex items-center justify-center h-full pt-20">
      <div className="space-y-4 text-center">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">
          Client side authentication
        </h1>
        {authUser ? (
          <p>Hi, {authUser.getAuthUser.email} 👋</p>
        ) : (
          <p>Loading...</p>
        )}
        <Logout />
      </div>
    </main>
  );
};

export default Me;

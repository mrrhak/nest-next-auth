import {useRouter} from "next/router";
import {useCallback, useEffect} from "react";
import {useAuthUser} from "../../contexts/auth-user-context";
import {
  useGetAuthUserLazyQuery,
  useGetAuthUserQuery,
  useLogoutMutation,
} from "../../generated/graphql";

const ProfileSSG = () => {
  const router = useRouter();
  const {data, loading, error} = useGetAuthUserQuery();
  const {authUser, setAuthUser} = useAuthUser();
  const [logoutMutation] = useLogoutMutation();

  // useEffect(() => {
  //   const getMe = async () => {
  //     const {data, error} = await getAuthUser();
  //     if (!error && data) setAuthUser(data);
  //     else handleLogout();
  //   };
  //   console.log("Me page useEffect");

  //   if (!authUser) getMe();
  // }, []);

  useEffect(() => {
    console.log("Profile useEffect");
    if (data) setAuthUser(data);
  }, [data, setAuthUser]);

  const handleLogout = useCallback(async () => {
    await logoutMutation();
    router.push("/auth/login");
  }, [logoutMutation, router]);

  if (!data && loading) {
    console.log("Loading");
    return <p>Loading...</p>;
  } else if (error) {
    console.log("Error");
    handleLogout();
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>{data.getAuthUser.firstName}</p>
      <p>{data.getAuthUser.lastName}</p>
      <p>{data.getAuthUser.username}</p>
      <p>{data.getAuthUser.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfileSSG;

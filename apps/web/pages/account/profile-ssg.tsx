import {useGetAuthUserQuery} from "../../generated/graphql";

const ProfileSSG = () => {
  const {data, loading} = useGetAuthUserQuery({fetchPolicy: "no-cache"});

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>{data?.getAuthUser.firstName}</p>
      <p>{data?.getAuthUser.lastName}</p>
      <p>{data?.getAuthUser.username}</p>
      <p>{data?.getAuthUser.email}</p>
    </div>
  );
};

export default ProfileSSG;

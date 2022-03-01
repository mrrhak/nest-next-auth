import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {requireAuthentication} from "../../hoc/requireAuthentication";

const Profile = () => {
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async () => {
    return {
      props: {},
    };
  }
);

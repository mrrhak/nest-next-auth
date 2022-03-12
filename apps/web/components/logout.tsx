import Router from "next/router";
import {FC} from "react";
import {useAuthUser} from "../contexts/auth-user-context";

export const Logout: FC = () => {
  const {authUser} = useAuthUser();

  const onLogout = async () => {
    console.log("Logout requested");
    // await poster(`${environment.apiUrl}/logout`);
    // Router.replace("/");
  };

  const onLogoutAll = async () => {
    console.log("Logout all requested");
    // await poster(`${environment.apiUrl}/logout-all`);
    // Router.replace("/");
  };

  return (
    <>
      {authUser && (
        <div className="flex justify-center space-x-2">
          <button
            className="text-sm font-medium text-blue-500"
            onClick={onLogout}
          >
            Logout
          </button>
          <button className="text-sm text-blue-500" onClick={onLogoutAll}>
            Logout All
          </button>
        </div>
      )}
    </>
  );
};

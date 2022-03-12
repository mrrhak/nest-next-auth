import {createContext, FC, useContext, useState} from "react";
import {GetAuthUserQuery} from "../generated/graphql";

export interface AuthUserContext {
  authUser?: GetAuthUserQuery;
  setAuthUser: (authUser?: GetAuthUserQuery) => void;
}

interface Props {
  initialAuthUser?: GetAuthUserQuery;
}

export const AuthUserContextImpl = createContext<AuthUserContext>(null!);

export function useAuthUser() {
  return useContext(AuthUserContextImpl);
}

export const AuthUserProvider: FC<Props> = ({children, initialAuthUser}) => {
  const [authUser, setAuthUser] = useState(initialAuthUser);

  return (
    <AuthUserContextImpl.Provider value={{authUser, setAuthUser}}>
      {children}
    </AuthUserContextImpl.Provider>
  );
};

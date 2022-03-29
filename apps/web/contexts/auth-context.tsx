import Router from "next/router";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {
  GetAuthUserQuery,
  useGetAuthUserLazyQuery,
  useLogoutMutation,
} from "../generated/graphql";

type authContextType = {
  authUser?: GetAuthUserQuery;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const authContextDefaultValue: authContextType = {
  authUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValue);

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: ReactNode;
  loading: boolean;
  initialAuthUser?: GetAuthUserQuery;
};

export function AuthProvider({children, loading, initialAuthUser}: Props) {
  const [logoutMutation] = useLogoutMutation();
  const [getAuthUserQuery] = useGetAuthUserLazyQuery();
  const [authUser, setAuthUser] = useState(initialAuthUser);

  useEffect(() => {
    setAuthUser(initialAuthUser);
  }, [initialAuthUser]);

  const login = async () => {
    const {data} = await getAuthUserQuery();
    if (data) setAuthUser(data);
  };

  const logout = async () => {
    await logoutMutation();
    setAuthUser(null);
    Router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{authUser, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

import {createContext, ReactNode, useContext, useState} from "react";

type authUser = {
  id: string;
  email: string;
  name: string;
};

type authContextType = {
  authUser: authUser | null;
  setAuthUser: (authUser: authUser | null) => void;
};

const AuthContext = createContext<authContextType>({
  authUser: null,
  setAuthUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: ReactNode;
};

export function AuthProvider({children}: Props) {
  const [authUser, setAuthUser] = useState<authUser>(null);
  return (
    <>
      <AuthContext.Provider value={{authUser, setAuthUser}}>
        {children}
      </AuthContext.Provider>
    </>
  );
}

export default AuthContext;

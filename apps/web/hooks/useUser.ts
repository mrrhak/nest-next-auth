import Router from "next/router";
import {useEffect} from "react";
import {useGetAuthUserQuery} from "../generated/graphql";

export default function useUser({redirectTo = "", redirectIfFound = false}) {
  const {data} = useGetAuthUserQuery();

  useEffect(() => {
    if (!redirectTo || !data) return;

    if (
      (redirectTo && !redirectIfFound && !data?.getAuthUser) ||
      (redirectIfFound && data?.getAuthUser)
    ) {
      Router.push(redirectTo);
    }
  }, [data, redirectTo, redirectIfFound]);

  return {user: data?.getAuthUser};
}

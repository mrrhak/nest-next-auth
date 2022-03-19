import axios, {AxiosRequestConfig} from "axios";
import {useEffect, useState} from "react";

const useAxiosFetch = (url: string, options?: AxiosRequestConfig<any>) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios(url, options)
      .then((res) => {
        setResponse(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [url, options]);

  return {response, error, loading};
};

export default useAxiosFetch;

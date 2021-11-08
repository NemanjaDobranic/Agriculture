import { useEffect } from "react";
import { useStateIfMounted } from "use-state-if-mounted";
import { useHistory } from "react-router";

const useFetch = (url) => {
  const [data, setData] = useStateIfMounted(null);
  const [isPending, setIsPending] = useStateIfMounted(true);
  const [error, setError] = useStateIfMounted(false);
  const history = useHistory();

  useEffect(() => {
    const abortCont = new AbortController();
    /*The credentials read-only property of the Request interface indicates 
    whether the user agent should send cookies from the other domain 
    in the case of cross-origin requests.*/
    fetch(url, { credentials: "include" }, { signal: abortCont.signal })
      .then((res) => {
        if (!res.ok) throw Error("could not fetch data for that resource");
        else if (res.status == 302) history.push("/home");
        else return res.json();
      })
      .then((data) => {
        setData(data);
        setIsPending(false);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setError(err.message);
          setIsPending(false);
        }
      });
    return () => abortCont.abort();
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;

import { useEffect, useState } from "react";

export function useFetch(url, options = {}) {
  const [data, setData] = useState();
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setData(undefined);
    setError(false);
    setLoading(true);

    // used for aborting fetch
    const abortController = new AbortController();

    fetch(url, { signal: abortController.signal })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => setData(data))
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(true);
      })
      .finally(() => {
        if (abortController.signal.aborted) return;
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
    // Want to run every time url changes
  }, [url]);

  return { data, isError, isLoading };
}

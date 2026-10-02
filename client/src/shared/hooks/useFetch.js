import { useState, useEffect, useCallback } from "react";

export function useFetch(fetcher) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await fetcher();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Something went wrong!")
        } finally {
            setLoading(false)
        }
    }, [fetcher])

    useEffect(() => {
        load();
    }, [load]);

    return { data, loading, error, refresh: load };
}
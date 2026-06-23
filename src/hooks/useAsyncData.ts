"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useAsyncData<T>(fetcher: (userId: string) => Promise<T>, deps: unknown[] = []) {
  const { user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher(user.id);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  }, [user, fetcher, ...deps]);

  useEffect(() => { reload(); }, [reload]);

  return { data, loading, error, reload, userId: user?.id };
}

'use client';

import { useEffect, useState } from 'react';
import { fetchAdminStats } from '@/lib/api/admin';
import type { AdminStats } from '@/lib/api/types';

export function useAdminStats() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchAdminStats()
      .then((payload) => {
        if (!mounted) return;
        setData(payload);
        setError(null);
      })
      .catch((reason: Error & { status?: number }) => {
        if (!mounted) return;
        if (reason.status === 401) {
          setError("Session admin absente. Connecte-toi depuis l'espace d'acces.");
          return;
        }
        setError(reason.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, error, loading };
}

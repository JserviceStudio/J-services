'use client';

import { useEffect, useState } from 'react';
import { fetchClientDashboard } from '@/lib/api/clients-dashboard';
import type { ClientDashboard } from '@/lib/api/types';

export function useClientDashboard() {
  const [data, setData] = useState<ClientDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchClientDashboard()
      .then((payload) => {
        if (!mounted) return;
        setData(payload.data);
        setError(null);
      })
      .catch((reason: Error & { status?: number }) => {
        if (!mounted) return;
        if (reason.status === 401) {
          setError('Session client absente. Connecte-toi pour ouvrir le dashboard.');
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

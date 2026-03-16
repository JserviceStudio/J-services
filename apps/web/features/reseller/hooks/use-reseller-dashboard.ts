'use client';

import { useEffect, useState } from 'react';
import { fetchResellerDashboard } from '@/lib/api/reseller';
import type { ResellerDashboard } from '@/lib/api/types';

export function useResellerDashboard() {
  const [data, setData] = useState<ResellerDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchResellerDashboard()
      .then((payload) => {
        if (!mounted) return;
        setData(payload.data);
        setError(null);
      })
      .catch((reason: Error & { status?: number }) => {
        if (!mounted) return;
        if (reason.status === 401) {
          setError('Session partenaire absente. Connecte-toi pour ouvrir le portail.');
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

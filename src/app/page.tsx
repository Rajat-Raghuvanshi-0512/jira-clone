'use client';

import { useCurrent } from '@/features/auth/api/use-current';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/features/auth/api/use-logout';
import { Button } from '@/components/ui/button';
export default function Home() {
  const { data, isLoading } = useCurrent();
  const router = useRouter();
  const { mutate: logout } = useLogout();
  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/sign-in');
    }
  }, [data, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Protected Route
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
}

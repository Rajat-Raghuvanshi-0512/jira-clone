import { UserButton } from '@/features/auth/components/UserButton';
import { getCurrentUser } from '@/features/auth/actions';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();
  console.log(user);
  if (!user) {
    return redirect('/sign-in');
  }
  return (
    <div className="flex min-h-screen">
      <UserButton />
    </div>
  );
}

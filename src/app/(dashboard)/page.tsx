import { getCurrentUser } from '@/features/auth/actions';
import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspace-form';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect('/sign-in');
  }
  return (
    <div className="bg-neutral-100 p-4 h-full">
      <CreateWorkspaceForm />
    </div>
  );
}

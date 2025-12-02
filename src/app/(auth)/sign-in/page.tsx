import { getCurrentUser } from '@/features/auth/actions';
import { SignInCard } from '@/features/auth/components/SignInCard';
import { redirect } from 'next/navigation';

const SignInPage = async () => {
  const user = await getCurrentUser();
  if (user) {
    return redirect('/');
  }
  return <SignInCard />;
};

export default SignInPage;

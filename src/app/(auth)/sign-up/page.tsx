import React from 'react';
import { SignUpCard } from '@/features/auth/components/SignUpCard';
import { getCurrentUser } from '@/features/auth/actions';
import { redirect } from 'next/navigation';

const SignUpPage = async () => {
  const user = await getCurrentUser();
  if (user) {
    return redirect('/');
  }
  return <SignUpCard />;
};

export default SignUpPage;

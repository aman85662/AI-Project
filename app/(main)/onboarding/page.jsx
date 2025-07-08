import { industries } from '@/data/industries';
import { getUserOnboardingStatus } from '@/actions/user';
import React from 'react'
import { redirect } from 'next/navigation';
import OnboardingForm from './_components/onboarding-form';

const onboardingPage = async() => {
  
  const { isOnboarded } = await getUserOnboardingStatus();
  
  if (isOnboarded) {
    redirect('/dashboard');
   }

  return (
   <main><OnboardingForm industries ={industries} /></main>
  )
}

export default onboardingPage;
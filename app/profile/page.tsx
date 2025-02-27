'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Navbar } from '../components/Navbar';

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#191a1a]">
        <Navbar />
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dbdbd9]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-[#202323] rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-[#dbdbd9] mb-6">Your Profile</h1>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-[#dbdbd9]/70">Name:</div>
              <div className="text-[#dbdbd9] font-medium">{session?.user.name}</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-[#dbdbd9]/70">Email:</div>
              <div className="text-[#dbdbd9] font-medium">{session?.user.email}</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-[#dbdbd9]/70">User ID:</div>
              <div className="text-[#dbdbd9] font-medium">{session?.user.id}</div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-[#dbdbd9]/10 pt-6">
            <h2 className="text-xl font-semibold text-[#dbdbd9] mb-4">Your Learning Paths</h2>
            <p className="text-[#dbdbd9]/70">You haven't created any learning paths yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
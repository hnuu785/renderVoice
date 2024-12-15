'use client';

import Link from 'next/link';

export default function Main() {
  return (
    <div className="bg-black flex flex-col items-center min-h-screen">
      <p className="text-xl text-white mt-20">chat room</p>
      <Link href="/matroom" className="bg-state-200 text-white">room</Link>
    </div>
  );
}
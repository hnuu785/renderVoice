'use client';

import Link from 'next/link';

export default function Main() {
  return (
    <div className="bg-black flex flex-col items-center min-h-screen">
      <p className="text-xl text-white mt-20 mb-20">chat list</p>
      <Link href="/chatroom" className="bg-slate-200 ">홍길동</Link>
    </div>
  );
}
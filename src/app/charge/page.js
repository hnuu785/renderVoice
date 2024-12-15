'use client';

import Link from 'next/link';

export default function Main() {
  return (
    <div className="bg-black flex flex-col items-center min-h-screen">
      <p className="text-xl text-white mt-20 mb-20">charge</p>
      <Link href="/matroom" className="bg-slate-200 ">입금 확인 요청</Link>
    </div>
  );
}
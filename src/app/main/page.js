'use client';

import Link from 'next/link';

export default function Main() {
  return (
    <div className="bg-black flex flex-col items-center min-h-screen">
      <p className="text-xl text-white mt-20 mb-20">Main</p>
      <Link href="/voiceroom" className="bg-slate-200 mb-20">매칭 시작하기</Link>
      <p className='text-white mb-20'>나의 보유 하트</p>
      <Link href="/charge" className="bg-slate-200 mb-20">하트 충전하기</Link>
      <Link href="/" className="bg-slate-200 ">로그아웃</Link>
    </div>
  );
}
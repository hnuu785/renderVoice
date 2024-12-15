'use client';

import Link from 'next/link';

export default function Main() {
  return (
    <div className="bg-black flex flex-col items-center min-h-screen">
      <Link href="/" className="bg-state-200 text-white mt-20">개인정보처리방침 보러가기</Link>
    </div>
  );
}
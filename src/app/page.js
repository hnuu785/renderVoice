'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-black flex flex-col items-center min-h-screen">
      <p className="text-xl text-white pt-10 mb-10">Call Me May Be</p>
      <p className='text-lg'>매칭 방법:</p>
      <div className="bg-white w-96 h-96 flex flex-col rounded-xl">
        <label className="mt-10 ml-10">휴대폰번호(-없이 입력)</label>
        <input type="text" className="mx-10 bg-slate-200 rounded-lg" />
        <label className="mt-10 ml-10">비밀번호</label>
        <input type="password" className="mx-10 bg-slate-200 mb-20 rounded-lg" />
        <Link className="bg-slate-200 mx-20 text-center rounded-lg mb-3" href='/main'>로그인</Link>
        <Link className="bg-slate-200 mx-20 text-center rounded-lg" href='/signup'>회원가입</Link>
      </div>
      <div id="recaptcha-container" className=""></div>
    </div>
  );
}
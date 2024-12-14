'use client';

import Link from 'next/link';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { useState } from 'react';


export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Recaptcha 초기화
  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log('Recaptcha verified:', response);
          },
        },
        auth
      );
    }
  };

  // 인증 요청 처리
  const requestVerificationCode = async () => {
    try {
      initializeRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(result.verificationId);
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      console.error('Failed to send verification code:', error);
      alert('인증번호 발송에 실패했습니다.');
    }
  };

  // 인증 완료 처리
  const verifyCode = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const user = await auth.signInWithCredential(credential);
      alert('인증 성공!');
    } catch (error) {
      console.error('Verification failed:', error);
      alert('인증 실패. 다시 시도해주세요.');
    }
  };


  return (
    <div className="bg-black flex flex-col items-center min-h-screen">
      <p className="text-xl text-white pt-10 mb-10">Call Me May Be</p>
      <div className="bg-white w-96 h-96 flex flex-col rounded-xl">
        <label className="mt-10 ml-10">휴대폰번호(-없이 입력)</label>
        <input
          type="text"
          className="mx-10 bg-slate-200 rounded-lg"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button
          onClick={requestVerificationCode}
          className="bg-slate-200 mx-20 text-center rounded-lg my-4"
        >
          인증번호 받기
        </button>
        <label className="mt-10 ml-10">인증번호</label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="mx-10 bg-slate-200 mb-4 rounded-lg"
        />
        <button
          onClick={verifyCode}
          className="bg-slate-200 mx-20 text-center rounded-lg my-4"
        >
          인증 완료
        </button>
        <Link className="bg-slate-200 mx-20 text-center rounded-lg" href='/main'>다음</Link>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}
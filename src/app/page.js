'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useName } from '@/context/NameContext';

export default function INIT() {
  const [data, setData] = useState(null);
  const [myName, setMyName] = useName();
  const [myPhone, setMyPhone] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/notion');
        const result = await response.json();
        const filteredResult = result.filter((user) => user.name);
        console.log(result);
        console.log(filteredResult);
        setData(filteredResult);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const signin = (event) => {
    if (!data) {
      alert('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      event.preventDefault();
      return;
    }

    if (!myName) {
      alert('닉네임을 입력해주세요.');
      event.preventDefault();
      return;
    }

    if (!myPhone) {
      alert('휴대폰 번호를 입력해주세요.');
      event.preventDefault();
      return;
    }

    const isValidUser = data.some(
      (user) => user && user.name.plain_text === myName && user.phone.plain_text === myPhone
    );
    
    if (!isValidUser) {
      alert('닉네임 또는 휴대폰번호가 올바르지 않습니다.');
      event.preventDefault();
      return;
    }
  };

  return (
    <div className="bg-black flex flex-col items-center min-h-screen">
      <p className="text-xl text-white pt-10 mb-5">Call Me May Be</p>
      <p className="text-lg text-white mb-10">매칭 방법:</p>
      <div className="bg-white w-96 flex flex-col rounded-xl">
        <label className="mt-10 ml-10">닉네임</label>
        <input
          type="text"
          className="mx-10 bg-slate-200 mb-1 rounded-lg"
          value={myName}
          onChange={(e) => setMyName(e.target.value)}
        />
        <label className="mt-5 ml-10">휴대폰번호</label>
        <input
          type="text"
          className="mx-10 bg-slate-200 rounded-lg mb-10"
          value={myPhone}
          onChange={(e) => setMyPhone(e.target.value)}
        />
        <Link
          href="/main"
          onClick={signin}
          className="bg-slate-200 mx-20 text-center rounded-lg mb-10 py-2"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
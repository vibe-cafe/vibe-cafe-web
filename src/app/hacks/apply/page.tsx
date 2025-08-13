'use client';

import { useEffect } from 'react';

export default function ApplyPage() {
  useEffect(() => {
    // Automatically redirect to the Feishu form
    window.location.href = 'https://cvji2p7f0zb.feishu.cn/share/base/form/shrcny72hVeWJTsOh6q5uKOSaJf';
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">正在跳转...</h1>
        <p className="text-gray-600">正在跳转到报名表单...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
      </div>
    </main>
  );
}

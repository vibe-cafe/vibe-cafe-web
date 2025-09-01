'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BackButton() {
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    // Check if the user came from the home page
    const referrer = document.referrer;
    const currentHost = window.location.origin;
    
    // Show back button if:
    // 1. No referrer (direct navigation)
    // 2. Referrer is from a different domain
    // 3. Referrer is not the home page of the same domain
    const shouldShowBackButton = !referrer || 
      !referrer.startsWith(currentHost) || 
      (referrer.startsWith(currentHost) && referrer !== currentHost + '/' && !referrer.endsWith('/'));
    
    setShowBackButton(shouldShowBackButton);
  }, []);

  if (!showBackButton) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <Link
        href="/"
        className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 font-medium"
      >
        <span className="mr-2">←</span>
        <span>VibeCafé</span>
      </Link>
    </div>
  );
}

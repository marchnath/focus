"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthCodeError() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white  rounded-2xl p-6 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100  rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600 "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-gray-900  mb-2">
          Authentication Error
        </h1>

        <p className="text-gray-600  mb-6">
          Sorry, there was an error during the authentication process. This
          could happen if the authentication code is invalid or has expired.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-[var(--primary)] text-white py-3 px-4 rounded-xl font-medium hover:bg-opacity-90 transition-colors"
          >
            Go to Home
          </Link>

          <p className="text-sm text-gray-500 ">
            You will be redirected automatically in a few seconds
          </p>
        </div>
      </div>
    </div>
  );
}

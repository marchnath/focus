"use client";

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white  rounded-2xl p-6 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary)] bg-opacity-10 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h1 className="text-xl font-semibold text-gray-900  mb-2">
          Signing you in...
        </h1>

        <p className="text-gray-600 ">
          Please wait while we complete the authentication process.
        </p>
      </div>
    </div>
  );
}

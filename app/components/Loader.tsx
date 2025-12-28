import React from 'react';

export default function Loader({
  size = 12,
  message,
  center = true,
}: { size?: number; message?: string; center?: boolean }) {
  return (
    <div
      className={`${center ? 'p-10 text-center' : 'p-2 inline-flex items-center'} `}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <svg className={`mx-auto ${center ? 'mb-3' : 'mr-3'} h-${size} w-${size} animate-spin`} viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>

      {message && <div className="text-sm text-gray-500">{message}</div>}
    </div>
  );
}

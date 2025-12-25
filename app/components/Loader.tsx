'use client';
import React from 'react';

export default function Loader({ size = 32 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg className="animate-spin h-full w-full text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
      </svg>
    </div>
  );
}

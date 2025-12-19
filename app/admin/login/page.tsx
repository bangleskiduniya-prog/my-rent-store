"use client";
import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/admin';
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2rem] shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Admin Login</h2>
        <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-xl mb-4 outline-none" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-xl mb-6 outline-none" onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs">Sign In</button>
      </form>
    </div>
  );
}
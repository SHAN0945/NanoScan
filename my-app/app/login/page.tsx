'use client'

import React, { useState } from 'react';
import Head from 'next/head';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for authentication goes here
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Head>
        <title>Login | NanoScan</title>
      </Head>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Nano<span className="text-cyan-500">Scan</span>
          </h1>
          <p className="text-slate-400 mt-2">Sign in to access the inspection dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-900/20 transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account? <a href="#" className="text-cyan-400 hover:underline">Request access</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, Lock, Mail, User, Info } from 'lucide-react';
import api from '../lib/api';

interface AuthProps {
  onLogin: (user: any, token: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    farmDetails: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, formData);
      onLogin(data.user, data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-stone-50">
      <div className="hidden lg:flex flex-col justify-center p-12 bg-white border-r border-border-theme relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center text-white">
              <Sprout className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">GreenPulse</h1>
          </div>
          <h2 className="text-6xl font-black text-gray-800 mb-8 leading-[0.9] font-sans uppercase tracking-tighter">
            Smart<br/>
            <span className="text-emerald-600">Yield</span><br/>
            Engine.
          </h2>
          <div className="space-y-6 max-w-sm">
            <div className="flex items-start gap-4 p-4 bg-gray-50 border border-border-theme rounded-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">1</div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">Input your soil and local environmental data into our inference engine.</p>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 border border-border-theme rounded-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">2</div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">Get optimized crop and fertilizer recommendations instantly.</p>
            </div>
          </div>
        </motion.div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/3" />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-bg-grid">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-xl border border-border-theme shadow-sm"
        >
          <div className="mb-10">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
              {isLogin ? 'Security Access' : 'System Registration'}
            </h3>
            <h4 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Control Center Login' : 'Create Farmer Node'}
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="E.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Endpoint</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Passkey</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Farm Description</label>
                <div className="relative">
                  <Info className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all min-h-[80px] placeholder:text-gray-300"
                    placeholder="Acres, soil, main crops..."
                    value={formData.farmDetails}
                    onChange={(e) => setFormData({ ...formData, farmDetails: e.target.value })}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-[10px] font-bold text-red-500 bg-red-50 p-2 rounded border border-red-100 uppercase tracking-wider italic">
                Error: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm uppercase tracking-widest mt-4"
            >
              {loading ? 'Validating...' : (isLogin ? 'Initiate Session' : 'Register Node')}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium">
              {isLogin ? "New user? " : "Existing member? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4 uppercase tracking-widest text-[10px]"
              >
                {isLogin ? 'Create Account' : 'Login'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

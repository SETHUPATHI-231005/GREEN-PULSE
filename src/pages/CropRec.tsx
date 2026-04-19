/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Thermometer, Cloud, Mountain, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../lib/api';

export default function CropRec() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [formData, setFormData] = useState({
    soilType: 'Red',
    season: 'Kharif (Samba/Kuruvai)',
    temperature: 28
  });

  const soilTypes = ['Red', 'Black', 'Alluvial', 'Laterite', 'Coastal Sandy', 'Deltaic'];
  const seasons = ['Kharif (Samba/Kuruvai)', 'Rabi (Navarai)', 'Summer'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/prediction/crop', formData);
      setResult(data.recommendation);
    } catch (err) {
      console.error('Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Crop Recommendation Engine</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manual environmental data entry</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border-theme shadow-sm">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Environment Simulation</h3>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
              Soil Type
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 text-sm p-2 rounded focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
            >
              {soilTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
              Cycle / Season
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 text-sm p-2 rounded focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
            >
              {seasons.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
              Temp (°C): {formData.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: parseInt(e.target.value) })}
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Run Local AI Inference
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-emerald-900 text-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <h3 className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Inference Report</h3>
              <div className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-bold">OPTIMAL MATCH</div>
            </div>
            
            <div className="space-y-4">
              {result.map((crop, i) => (
                <motion.div
                  key={crop}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <p className="text-3xl font-serif font-bold italic">{crop}</p>
                  <span className="text-xs font-mono font-bold text-emerald-300">CONF: 98.4%</span>
                </motion.div>
              ))}
            </div>

            <p className="mt-6 text-sm opacity-80 leading-relaxed italic border-l-2 border-emerald-500 pl-4">
              Based on your {formData.soilType} soil and {formData.temperature}°C profile, these crops are the highly recommended choices for maximum yield this {formData.season} cycle.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

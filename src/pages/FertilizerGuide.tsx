/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Droplets, Info, FlaskConical, MapPin, Mountain } from 'lucide-react';
import api from '../lib/api';

export default function FertilizerGuide() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: string; quantity: string } | null>(null);
  const [formData, setFormData] = useState({
    crop: 'Paddy (Rice)',
    soilType: 'Red'
  });

  const crops = ['Paddy (Rice)', 'Sugarcane', 'Cotton', 'Groundnut', 'Ragi (Finger Millet)', 'Chillies', 'Coconut', 'Turmeric'];
  const soilTypes = ['Red', 'Black', 'Alluvial', 'Laterite', 'Coastal Sandy'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/prediction/fertilizer', formData);
      setResult(data.recommendation);
    } catch (err) {
      console.error('Fertilizer optimization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Fertilizer Lab Module</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Chemical optimization engine</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border-theme shadow-sm">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Simulation Input</h3>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
              Target Crop
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 text-sm p-2 rounded focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
            >
              {crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

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

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Droplets className="w-4 h-4 text-emerald-400" />
              {loading ? 'Analyzing Chemical Profile...' : 'Optimize Dosage'}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-white p-6 rounded-xl border border-border-theme shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Recommended Type</h3>
                <p className="text-2xl font-bold text-gray-800 mb-1">{result.type}</p>
                <p className="text-xs text-gray-400 font-medium italic">Specific for {formData.crop} growth cycle</p>
              </div>
              <FlaskConical className="absolute -bottom-4 -right-4 w-24 h-24 text-stone-50 group-hover:text-emerald-50 transition-colors" />
            </div>

            <div className="bg-emerald-950 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-4">Optimized Dosage</h3>
                <p className="text-4xl font-serif font-bold italic text-emerald-50 mb-1">{result.quantity}</p>
                <p className="text-xs opacity-60">Calculated for maximum nutrient absorption efficiency</p>
              </div>
              <Mountain className="absolute -bottom-6 -right-6 w-32 h-32 text-emerald-900 rotate-12" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

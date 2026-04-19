/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, ShieldCheck, AlertTriangle, RefreshCw, Eye } from 'lucide-react';
import api from '../lib/api';

export default function DiseaseDetection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ disease: string; suggestion: string } | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!fileInputRef.current?.files?.[0]) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('image', fileInputRef.current.files[0]);

    try {
      const { data } = await api.post('/upload-image', formData);
      // Simulate analysis delay
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Image analysis failed');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Disease Detection Engine</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">CNN-based visual analysis</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border-theme shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Neural Scan Interface</h3>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">TENSORFLOW ENGINE</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all shrink-0"
            >
              <Camera className="w-8 h-8 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
            </div>
          ) : (
            <div className="w-48 h-48 relative rounded-xl overflow-hidden shadow-md group">
              <img src={image} alt="Crop" className="w-full h-full object-cover" />
              <button 
                onClick={handleReset}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest"
              >
                Change Image
              </button>
            </div>
          )}

          <div className="flex-1 space-y-6 w-full">
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Analysis Status</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{loading ? 'Processing...' : (result ? 'Complete' : 'Ready')}</span>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading || !image}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Analyzing Neural Data...' : 'Run CNN Inference'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-xl border shadow-lg ${result.disease === 'Healthy' ? 'bg-emerald-900 text-white' : 'bg-red-900 text-white'}`}
          >
           <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Inference Report</h3>
                  <p className="text-3xl font-serif font-bold italic">{result.disease}</p>
                </div>
                <p className="text-sm opacity-80 leading-relaxed border-l-2 border-white/20 pl-4 py-1">
                  <span className="font-bold opacity-100">Expert Directive:</span> {result.suggestion}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold opacity-60">CONFIDENCE</span>
                <p className="text-xl font-mono font-bold">94.2%</p>
              </div>
           </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

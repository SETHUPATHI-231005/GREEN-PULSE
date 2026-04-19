/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Wheat, FlaskConical, History, Plus, IndianRupee, Activity } from 'lucide-react';
import api from '../lib/api';

export default function Dashboard() {
  const [crops, setCrops] = useState<any[]>([]);
  const [fertilizers, setFertilizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropsRes, fertRes] = await Promise.all([
          api.get('/crops'),
          api.get('/fertilizer')
        ]);
        setCrops(cropsRes.data);
        setFertilizers(fertRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Crops', value: crops.length, icon: Wheat, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Fertilizer Stock', value: fertilizers.length, icon: FlaskConical, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Estimated Profit', value: '₹12,450', icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Farm Health', value: '94%', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Agricultural Overview</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time localized metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-xl shadow-sm border border-border-theme flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-border-theme">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Crop Inventory</h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">High Yield</span>
          </div>
          <div className="space-y-4">
            {crops.map((crop) => (
              <div key={crop.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100 group hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
                    {crop.cropName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{crop.cropName}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{crop.season} Cycle · {crop.soilType} Soil</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600 font-mono">{crop.yield} Tons</p>
                  <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border-theme flex-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Nutrient Balance</h3>
            <div className="flex flex-1 items-end justify-around pb-4 h-40">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-emerald-600 rounded-t h-24 shadow-sm"></div>
                <span className="text-[10px] font-bold text-gray-600">N</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-emerald-400 rounded-t h-16 shadow-sm"></div>
                <span className="text-[10px] font-bold text-gray-600">P</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-emerald-200 rounded-t h-32 shadow-sm"></div>
                <span className="text-[10px] font-bold text-gray-600">K</span>
              </div>
            </div>
            <p className="text-[10px] text-center text-gray-400 pt-4 border-t border-gray-100 font-bold uppercase tracking-wider">AI Optimized Levels</p>
          </div>

          <div className="bg-emerald-900 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-[10px] font-bold text-emerald-300/60 uppercase tracking-widest mb-4">Financial Insight</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Estimated Profit</span>
                <span className="font-bold font-mono text-emerald-300">+₹12,450.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Operational Cost</span>
                <span className="font-bold font-mono text-red-300">-₹2,120.00</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-bold uppercase tracking-widest transition-colors shadow-inner">
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

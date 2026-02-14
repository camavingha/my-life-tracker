'use client'

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeightChart({ data = [] }: { data: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[250px] w-full bg-stone-50 animate-pulse rounded-2xl" />;

  const chartData = [...data]
    .sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime())
    .map(item => ({
      date: new Date(item.logged_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      weight: item.weight,
    }));

  return (
    <div className="h-[250px] w-full pt-4" style={{ minWidth: '0' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#a8a29e' }} />
          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: '#1c1917', fontWeight: 'bold' }}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#1c1917" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#1c1917', stroke: '#fff', strokeWidth: 2 }} 
            activeDot={{ r: 6, strokeWidth: 0 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
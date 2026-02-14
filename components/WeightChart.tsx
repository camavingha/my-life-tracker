"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

export default function WeightChart({ data, isDark }: { data: any[], isDark?: boolean }) {
  // กรองข้อมูลเผื่อมีค่า null และเรียงวันที่จากน้อยไปมากสำหรับกราฟ
  const chartData = [...data]
    .filter(d => d.weight)
    .reverse() 
    .map(d => ({
      ...d,
      // แปลงวันที่ให้สั้นลงเหลือแค่ "14 Feb"
      displayDate: new Date(d.logged_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {/* ทำ Gradient เงาใต้เส้นกราฟ */}
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={isDark ? "#30363d" : "#e1e4e8"} 
          />
          
          <XAxis 
            dataKey="displayDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8b949e', fontSize: 12 }}
            dy={10}
          />
          
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8b949e', fontSize: 12 }}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#161b22', 
              border: '1px solid #30363d',
              borderRadius: '8px',
              color: '#c9d1d9'
            }}
            itemStyle={{ color: '#10b981' }}
          />

          {/* ส่วนของเส้นกราฟและเงา */}
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={3} // เพิ่มความหนาของเส้น
            fillOpacity={1}
            fill="url(#colorWeight)"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#0d1117' }} // จุด Dot ชัดๆ
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
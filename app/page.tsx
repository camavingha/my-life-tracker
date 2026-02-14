import { createClient } from '@/utils/supabase/server'
import Sidebar from '@/components/Sidebar'
import WeightChart from '@/components/WeightChart'
import LogModal from '@/components/LogModal'
import { 
  Flame, Trophy, MapPin, Mail, Star, 
  Dumbbell, ShieldCheck, Phone, Info
} from 'lucide-react'

const activityIcons: { [key: string]: string } = {
  'Running': '🏃',
  'Weight Training': '🏋️',
  'Cycling': '🚴',
  'Yoga': '🧘',
  'Swimming': '🏊',
};

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: workouts } = await supabase.from('workouts').select('*').order('logged_at', { ascending: false })
  const { data: weightData } = await supabase.from('body_metrics').select('*').order('logged_at', { ascending: false })

  const currentWeight = weightData?.[0]?.weight || 0
  const prevWeight = weightData?.[1]?.weight || currentWeight
  const weightDiff = (currentWeight - prevWeight).toFixed(1)
  const isGain = parseFloat(weightDiff) > 0

  const totalSessions = workouts?.length || 0
  const totalMinutes = workouts?.reduce((sum, w) => sum + w.duration_minutes, 0) || 0

  const getDayDetails = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const dayWorkouts = workouts?.filter(w => w.logged_at === dateStr) || []
    const totalMins = dayWorkouts.reduce((sum, w) => sum + w.duration_minutes, 0)
    
    let color = 'bg-[#161b22]' 
    if (totalMins > 0 && totalMins < 30) color = 'bg-[#0e4429]'
    if (totalMins >= 30 && totalMins < 60) color = 'bg-[#006d32]'
    if (totalMins >= 60) color = 'bg-[#39d353]'

    return { 
      color, 
      totalMins, 
      dateStr: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), 
      activities: dayWorkouts.map(w => w.activity_type).join(', ') 
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] pl-[70px] flex overflow-x-hidden font-sans">
      <Sidebar />
      
      <aside className="w-[320px] p-8 hidden xl:flex flex-col border-r border-[#30363d] sticky top-0 h-screen bg-[#0d1117]/50 backdrop-blur-md z-20">
        <div className="relative mb-10 self-center">
          <div className="absolute -inset-8 bg-blue-500/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="relative w-40 h-40 bg-[#0d1117] rounded-full border border-blue-500/30 flex items-center justify-center overflow-hidden z-10 shadow-[0_0_50px_rgba(59,130,246,0.15)] group transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-blue-500/20 z-10"></div>
             {/* Your Real Profile Image */}
             <img src="/profile.png" alt="Profile" className="w-full h-full object-cover z-0 group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#0d1117] border border-[#30363d] rounded-full flex items-center justify-center text-yellow-500 z-30 shadow-xl">
             <Star size={18} fill="currentColor" />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">BEDDD</h2>
            <ShieldCheck size={18} className="text-blue-400" />
          </div>
          <p className="text-[#8b949e] font-mono text-[10px] tracking-[0.25em] opacity-50 uppercase">Sittisat Chaiyahan</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-2xl flex flex-col items-center justify-center hover:bg-[#1c2128] transition-all group">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#8b949e] mb-2 group-hover:text-emerald-500">Sessions</p>
              <p className="text-3xl font-black text-white text-center w-full">{totalSessions}</p>
           </div>
           <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-2xl flex flex-col items-center justify-center hover:bg-[#1c2128] transition-all group">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#8b949e] mb-2 group-hover:text-blue-500">Total Mins</p>
              <p className="text-3xl font-black text-white text-center w-full">{totalMinutes}</p>
           </div>
        </div>

        <div className="space-y-5 text-sm text-[#8b949e]">
          <div className="p-4 bg-[#0d1117] border-l-2 border-emerald-500 rounded-r-lg">
            <p className="text-white text-[11px] italic leading-relaxed">"East or West FOOD is the BEST"</p>
          </div>
          <div className="pt-2 space-y-4 border-t border-[#30363d]">
            <div className="flex items-center gap-3 text-[12px]"><MapPin size={14} className="text-emerald-500 opacity-70"/> RoiEt, Thailand</div>
            <div className="flex items-center gap-3 text-[12px]"><Mail size={14} className="text-blue-500 opacity-70"/> sittisat.ch@gmail.com</div>
            <div className="flex items-center gap-3 text-[12px]"><Phone size={14} className="text-blue-400 opacity-70"/> +66 82-574-0322</div>
          </div>
        </div>

        <div className="mt-auto pt-6">
           <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#484f58]">Achievements</p>
              <Info size={14} className="text-[#30363d]" />
           </div>
           <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-full text-[9px] font-bold text-emerald-500/80 uppercase">100+ Mins Run</span>
              <span className="px-3 py-1 bg-orange-500/5 border border-orange-500/20 rounded-full text-[9px] font-bold text-orange-500/80 uppercase">7 Day Streak</span>
           </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Performance</h1>
            <p className="text-[#8b949e] mt-2 text-xs uppercase tracking-[0.3em] font-bold opacity-60">System Status: Optimized</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-[#161b22]/80 backdrop-blur-xl border border-[#30363d] p-5 pr-8 rounded-2xl flex items-center gap-6 shadow-2xl transition-all hover:border-[#424b55]">
              <div className="w-12 h-12 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-emerald-400">
                <Dumbbell size={24} className="drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] mb-1 opacity-70">Current Body Mass</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white tracking-tighter">{currentWeight}</span>
                  <span className="text-sm font-bold text-[#8b949e]">KG</span>
                  <div className={`ml-4 px-2 py-0.5 rounded-md text-[10px] font-bold border ${isGain ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                    {isGain ? '▲' : '▼'} {Math.abs(parseFloat(weightDiff))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 mb-8 relative group hover:border-[#424b55] transition-all">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider mb-6 opacity-80">
            <Flame size={16} className="text-orange-500" /> Workout Contributions
          </h2>
          <div className="flex gap-1 justify-center xl:justify-end overflow-visible">
            {Array.from({ length: 42 }).map((_, weekIndex) => ( 
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const date = new Date()
                  date.setDate(date.getDate() - ((41 - weekIndex) * 7 + (6 - dayIndex)))
                  const { color, totalMins, dateStr, activities } = getDayDetails(date)
                  const isLastColumns = weekIndex > 38;
                  return (
                    <div key={dayIndex} className="relative group/day">
                      <div className={`w-3 h-3 rounded-[2px] ${color} transition-all hover:ring-2 hover:ring-white/30 cursor-pointer`} />
                      <div className={`absolute bottom-full mb-2 p-2 bg-[#0d1117] border border-[#30363d] rounded-lg shadow-2xl opacity-0 group-hover/day:opacity-100 pointer-events-none transition-all z-50 text-[10px] min-w-[100px] ${isLastColumns ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
                        <p className="text-white font-bold">{totalMins} mins</p>
                        <p className="text-[#8b949e]">{dateStr}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-3xl p-8 hover:border-[#424b55] transition-all">
             <h2 className="font-bold text-white mb-6 flex items-center gap-2 uppercase text-xs tracking-widest opacity-80">
                <Trophy size={18} className="text-yellow-500" /> Weight Progress Trend
             </h2>
             <div className="h-[300px]">
                <WeightChart data={weightData || []} isDark />
             </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 h-[415px] flex flex-col overflow-hidden hover:border-[#424b55] transition-all">
             <h2 className="text-xs font-black uppercase tracking-widest text-[#8b949e] mb-6 text-center opacity-80">Recent Commits</h2>
             
             {/* ⚡ PREMIUM SCROLLBAR FIX (TAILWIND ARBITRARY VARIANTS) */}
             <div className="space-y-3 overflow-y-auto pr-2 flex-1
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-[#30363d]
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-[#484f58]">
                {workouts?.map((w) => (
                  <div key={w.id} className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center gap-4 hover:border-emerald-500/50 transition-all group/item">
                    <div className="text-xl group-hover/item:scale-110 transition-transform">
                      {activityIcons[w.activity_type] || '✨'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{w.activity_type}</p>
                      <p className="text-[10px] text-[#8b949e] font-mono">{w.duration_minutes} Mins</p>
                    </div>
                    <div className="text-[9px] font-mono text-[#30363d] group-hover/item:text-[#8b949e]">
                      {w.logged_at.split('-').slice(1).join('/')}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <LogModal />
      </main>
    </div>
  )
}
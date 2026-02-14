"use client"
import { useState } from 'react'
import { Plus, X, Activity, Scale } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<'workout' | 'weight' | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({ duration: '', weight: '', activity: 'Running' })

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (type === 'workout') {
      await supabase.from('workouts').insert({
        user_id: user?.id,
        activity_type: form.activity,
        duration_minutes: Number(form.duration),
        logged_at: new Date().toISOString().split('T')[0]
      })
    } else {
      await supabase.from('body_metrics').insert({
        user_id: user?.id,
        weight: Number(form.weight),
        logged_at: new Date().toISOString().split('T')[0]
      })
    }
    
    setIsOpen(false)
    setType(null)
    setLoading(false)
    router.refresh() // อัปเดตข้อมูลหน้าจอโดยไม่รีโหลดทั้งหน้า
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-emerald-500 text-black rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100]"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[101] flex items-center justify-center p-6">
          <div className="bg-[#161b22] border border-[#30363d] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
            <button onClick={() => {setIsOpen(false); setType(null)}} className="absolute top-6 right-6 text-[#8b949e] hover:text-white transition-colors"><X size={24}/></button>
            
            <h2 className="text-2xl font-black text-white mb-8 tracking-tight">NEW LOG</h2>

            {!type ? (
              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => setType('workout')} className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl hover:border-emerald-500 group transition-all flex items-center gap-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all"><Activity size={28} /></div>
                  <span className="font-bold text-lg text-white">Workout</span>
                </button>
                <button onClick={() => setType('weight')} className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl hover:border-cyan-500 group transition-all flex items-center gap-6">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all"><Scale size={28} /></div>
                  <span className="font-bold text-lg text-white">Body Weight</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {type === 'workout' ? (
                  <>
                    <select value={form.activity} onChange={e => setForm({...form, activity: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] p-4 rounded-xl text-white outline-none focus:border-emerald-500 transition-all font-bold">
                      <option>Running</option>
                      <option>Weight Training</option>
                      <option>Yoga</option>
                    </select>
                    <input type="number" placeholder="Minutes" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] p-4 rounded-xl text-white outline-none focus:border-emerald-500 transition-all text-lg font-bold" />
                  </>
                ) : (
                  <input type="number" step="0.1" placeholder="Weight (kg)" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] p-4 rounded-xl text-white outline-none focus:border-cyan-500 transition-all text-2xl text-center font-black" />
                )}
                <button 
                  disabled={loading}
                  onClick={handleSave} 
                  className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-emerald-500 transition-all tracking-widest uppercase"
                >
                  {loading ? 'Saving...' : 'Deploy Commit'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
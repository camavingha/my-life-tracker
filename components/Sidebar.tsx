"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Book, Heart, ChevronRight, Scale, Home } from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ width: isHovered ? 240 : 70 }}
      className="fixed left-0 top-0 h-full bg-[#0d1117] border-r border-[#30363d] z-50 flex flex-col py-6 overflow-hidden transition-all duration-300"
    >
      <div className="px-6 mb-10 flex items-center gap-4">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex-shrink-0" />
        {isHovered && <span className="font-bold text-white tracking-tight text-lg">Habits Tracker</span>}
      </div>

      <nav className="flex-1 px-3 space-y-2">
        <MenuLink icon={<Home size={22}/>} label="Dashboard" active isHovered={isHovered} href="/" />
        <MenuLink icon={<Activity size={22}/>} label="Workouts" isHovered={isHovered} href="/workouts" />
        <MenuLink icon={<Book size={22}/>} label="Reading" isHovered={isHovered} href="/reading" />
        <MenuLink icon={<Heart size={22}/>} label="Mood" isHovered={isHovered} href="/mood" />
      </nav>
      
      <div className={`px-6 text-[#8b949e] transition-opacity ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <ChevronRight size={20} />
      </div>
    </motion.div>
  )
}

function MenuLink({ icon, label, active = false, isHovered, href }: any) {
  return (
    <Link href={href} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${active ? 'bg-[#21262d] text-emerald-400 border border-[#30363d]' : 'text-[#8b949e] hover:bg-[#161b22] hover:text-white'}`}>
      <div className="flex-shrink-0">{icon}</div>
      {isHovered && <span className="whitespace-nowrap font-medium text-sm">{label}</span>}
    </Link>
  )
}
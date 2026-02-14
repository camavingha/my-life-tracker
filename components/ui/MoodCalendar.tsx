"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { enUS } from "date-fns/locale"

// แยก Logic การเลือกสีออกมาให้เรียกใช้ง่ายๆ
const getMoodColor = (score: any) => {
  const s = Number(score);
  if (s >= 5) return "bg-emerald-500"; // Amazing (เขียว)
  if (s >= 4) return "bg-lime-400";    // Good (เขียวอ่อน)
  if (s >= 3) return "bg-yellow-400";  // Neutral (เหลือง)
  if (s >= 2) return "bg-orange-400";  // Low (ส้ม)
  return "bg-rose-500";               // Rough (แดง)
};

export default function MoodCalendar({ moods = [] }: { moods: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[350px] w-full bg-stone-100 animate-pulse rounded-2xl" />;

  return (
    <div className="bg-white p-2 rounded-2xl border shadow-inner">
      <Calendar
        mode="single"
        locale={enUS}
        className="rounded-md"
        formatters={{
          // จัดการหัวปฏิทินให้เป็น ค.ศ. เสมอ
          formatCaption: (date) => {
            const y = date.getFullYear() > 2500 ? date.getFullYear() - 543 : date.getFullYear();
            return `${date.toLocaleString('en-US', { month: 'long' })} ${y}`;
          }
        }}
        components={{
          DayContent: ({ date }) => {
            const dayNumber = date.getDate();
            
            // 1. แปลงปีในปฏิทินให้เป็น ค.ศ.
            let calendarYear = date.getFullYear();
            if (calendarYear > 2500) calendarYear -= 543;

            // 2. สร้าง String วันที่เป้าหมาย "2026-02-14"
            const targetDateStr = `${calendarYear}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

            // 3. ค้นหาข้อมูลอารมณ์ที่ตรงกับวันนั้น (กรอง null ออกด้วย)
            const dayMood = moods.find((m) => m && m.logged_at === targetDateStr);

            return (
              <div className="relative w-full h-full flex items-center justify-center min-h-[40px]">
                {/* ตัวเลขวันที่ - ถ้ามีวงกลมสี ให้เป็นสีขาวจะได้เด่น */}
                <span className={`relative z-10 font-bold ${dayMood ? 'text-white' : 'text-stone-700'}`}>
                  {dayNumber}
                </span>

                {/* วงกลมสีพื้นหลัง */}
                {dayMood && (
                  <div 
                    className={`absolute inset-0 m-auto w-8 h-8 rounded-full shadow-sm animate-in fade-in zoom-in duration-300 ${getMoodColor(dayMood.mood_score)}`} 
                  />
                )}
              </div>
            );
          },
        }}
      />
    </div>
  );
}
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { saveMood } from './actions/mood'
import { saveWeight } from './actions/metrics'
import { saveBook, updateBookProgress } from './actions/books' 

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import WeightChart from "@/components/ui/WeightChart" 
import MoodCalendar from "@/components/ui/MoodCalendar" // ใช้ตัวที่เราเพิ่งสร้าง

export default async function HomePage() {
  const supabase = await createClient()

  // ตรวจสอบการ Login
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  // ดึงข้อมูล
  const { data: moods, error } = await supabase.from('daily_moods').select('*').order('logged_at', { ascending: true }); if (error) console.error("Supabase error:", error); // มั่นใจว่าส่งไปให้ Component แบบนี้ <MoodCalendar moods={moods || []} />
  const { data: weights } = await supabase.from('body_metrics').select('*').order('logged_at', { ascending: false }).limit(20)
  const { data: books } = await supabase.from('books').select('*').order('updated_at', { ascending: false })

  return (
    <main className="mx-auto p-6 md:p-10 w-full max-w-[1400px] space-y-10 text-stone-900 bg-white min-h-screen">
      
      {/* HEADER: ขยับมาไว้ตรงกลางและกว้างขึ้น */}
      <header className="flex flex-col md:flex-row justify-between items-center border-b pb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Life Dashboard</h1>
          <p className="text-muted-foreground font-medium text-sm">Welcome back, {user.email}</p>
        </div>
        <div className="px-4 py-2 bg-stone-100 rounded-full text-[10px] font-black uppercase tracking-widest text-stone-500">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      </header>

      {/* SECTION 1: MOOD JOURNEY (FORM & CALENDAR) */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Mood Entry Form */}
        <div className="lg:col-span-4">
          <Card className="shadow-sm border-stone-200 h-full">
            <CardHeader>
              <CardTitle>Daily Mood</CardTitle>
              <CardDescription>How are you feeling?</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={saveMood} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Happiness Score</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="cursor-pointer group">
                        <input type="radio" name="mood_score" value={num} className="peer hidden" required />
                        <div className="p-3 border-2 rounded-xl text-center font-black peer-checked:bg-stone-900 peer-checked:text-white peer-checked:border-stone-900 transition-all">
                          {num}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <input type="hidden" name="mood_label" value="Daily Entry" />
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-stone-400 tracking-widest text-xs">Notes</Label>
                  <Textarea name="note" placeholder="Write something..." className="min-h-[120px] border-stone-200" />
                </div>
                <Button type="submit" className="w-full bg-stone-900">Save Log</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Calendar View */}
        <div className="lg:col-span-8">
          <Card className="shadow-sm border-stone-200 h-full">
            <CardHeader>
              <CardTitle>Mood Journey</CardTitle>
              <CardDescription>Daily emotional patterns</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row justify-center items-center p-6 gap-8">
              {/* เรียกใช้ Component ใหม่ที่เราสร้างแยกไว้ */}
              <MoodCalendar moods={moods || []} />
              
              <div className="space-y-4 min-w-[120px]">
                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest text-xs">Mood Levels</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold"><div className="w-3 h-3 rounded-full bg-emerald-500"/> Amazing</div>
                  <div className="flex items-center gap-2 text-xs font-bold"><div className="w-3 h-3 rounded-full bg-yellow-400"/> Neutral</div>
                  <div className="flex items-center gap-2 text-xs font-bold"><div className="w-3 h-3 rounded-full bg-rose-500"/> Rough</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 2: WEIGHT & BOOKS */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* WEIGHT PROGRESS */}
        <Card className="shadow-sm border-stone-200">
          <CardHeader>
            <CardTitle>Body Metrics</CardTitle>
            <CardDescription>Weight tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-stone-50 rounded-2xl p-4 border overflow-hidden">
              {weights && weights.length > 1 ? (
                <WeightChart data={weights} />
              ) : (
                <div className="h-[250px] flex items-center justify-center italic text-stone-400">Need more data to show chart...</div>
              )}
            </div>
            <form action={saveWeight} className="flex gap-2">
              <Input name="weight" type="number" step="0.1" placeholder="Update Weight (kg)" required />
              <Button type="submit" variant="secondary" className="font-bold">Log</Button>
            </form>
          </CardContent>
        </Card>

        {/* READING LIBRARY */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase px-1">Reading Library</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {books?.map((book) => {
              const progress = Math.round((book.current_page / book.total_pages) * 100);
              return (
                <Card key={book.id} className="shadow-sm border-stone-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-black truncate">{book.title}</CardTitle>
                    <p className="text-[10px] font-bold text-stone-400">{book.current_page} / {book.total_pages} PAGES</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-stone-900 transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                    {/* ปุ่ม Update Book Progress */}
                    <form action={async (formData) => {
                        'use server'
                        const newPage = parseInt(formData.get('current_page') as string);
                        await updateBookProgress(book.id, newPage);
                    }} className="flex gap-2">
                        <Input name="current_page" type="number" className="h-8 text-xs font-bold" defaultValue={book.current_page} />
                        <Button type="submit" size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase">Update</Button>
                    </form>
                  </CardContent>
                </Card>
              )
            })}
            
            {/* Form เพิ่มหนังสือใหม่ */}
            <Card className="border-dashed border-2 bg-stone-50/50 flex flex-col justify-center p-6 min-h-[160px]">
              <form action={saveBook} className="space-y-2">
                <Input name="title" placeholder="Book Title" required className="h-8 text-sm" />
                <Input name="total_pages" type="number" placeholder="Total Pages" required className="h-8 text-sm" />
                <Button type="submit" className="w-full h-8 text-[10px] font-black bg-stone-400 hover:bg-stone-900 text-white">+ ADD BOOK</Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
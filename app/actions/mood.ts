'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveMood(formData: FormData) {
  const supabase = await createClient()
  
  const mood_score = formData.get('mood_score')
  const note = formData.get('note')
  const logged_at = formData.get('logged_at') // "2026-02-14"

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('daily_moods')
    .upsert({
      user_id: user.id,
      mood_score: Number(mood_score),
      note: note,
      logged_at: logged_at,
      mood_label: 'Daily Entry'
    }, {
      onConflict: 'user_id,logged_at' 
    })

  if (error) {
    console.error('Supabase Error:', error.message)
    throw new Error(`Failed to save mood: ${error.message}`)
  }

  // บังคับให้หน้าแรกอัปเดตข้อมูลทันที
  revalidatePath('/')
  
  return { success: true }
}
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveWeight(formData: FormData): Promise<void> {
  const supabase = await createClient()
  
  const weight = formData.get('weight')
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !weight) return

  const { error } = await supabase
    .from('body_metrics')
    .insert({
      user_id: user.id,
      weight: parseFloat(weight as string),
    })

  if (error) {
    console.error(error.message)
    return
  }

  revalidatePath('/')
}
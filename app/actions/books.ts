'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveBook(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const total_pages = parseInt(formData.get('total_pages') as string)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from('books').insert({
    user_id: user.id,
    title,
    total_pages,
    current_page: 0,
  })

  if (error) console.error(error)
  revalidatePath('/')
}

export async function updateBookProgress(bookId: string, currentPage: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('books')
    .update({ current_page: currentPage })
    .eq('id', bookId)

  if (error) console.error(error)
  revalidatePath('/')
}
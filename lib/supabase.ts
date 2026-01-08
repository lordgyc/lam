import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://asyvskwyuwmaqtlqndsy.supabase.co'
const supabaseAnonKey = 'sb_publishable_vXNvw08hV5nIsWHzi8AcVQ_p99giVCu'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


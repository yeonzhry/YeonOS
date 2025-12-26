// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yobzgyjvckgvbmoueude.supabase.co' // 복사한 URL 붙여넣기
const supabaseKey = 'sb_publishable_LPbdD5EE1L4hftCiS0QHBw_bf5PJx8Y'    // 복사한 Key 붙여넣기

export const supabase = createClient(supabaseUrl, supabaseKey)
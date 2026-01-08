// Database types matching your Supabase schema

export interface Category {
  id: string
  name: string
  desc: string
}

export interface Item {
  id: string
  name: string
  desc: string
  price: number
  cat_id: string
}


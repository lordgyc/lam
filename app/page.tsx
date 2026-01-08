'use client'

import { useState, useEffect } from 'react'
import MenuHeader from '@/components/MenuHeader'
import CategoryList from '@/components/CategoryList'
import MenuItems from '@/components/MenuItems'
import { supabase } from '@/lib/supabase'
import { Category, Item } from '@/types/database'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [restaurantName, setRestaurantName] = useState('La Menu')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchItems(selectedCategory)
    }
  }, [selectedCategory])

  async function fetchData() {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('category')
        .select('*')
        .order('name')

      if (categoriesError) throw categoriesError

      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData)
        setSelectedCategory(categoriesData[0].id)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchItems(categoryId: string) {
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('cat_id', categoryId)
        .order('name')

      if (itemsError) throw itemsError

      setItems(itemsData || [])
    } catch (error) {
      console.error('Error fetching items:', error)
      setItems([])
    }
  }

  if (loading) {
    return (
      <main className="menu-app">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          color: 'var(--text-secondary)'
        }}>
          Loading menu...
        </div>
      </main>
    )
  }

  return (
    <main className="menu-app">
      <MenuHeader restaurantName={restaurantName} />
      {categories.length > 0 && (
        <>
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <MenuItems items={items} />
        </>
      )}
    </main>
  )
}


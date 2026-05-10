'use client'

import { useState, useEffect, useCallback } from 'react'
import MenuHeader from '@/components/MenuHeader'
import CategoryList from '@/components/CategoryList'
import MenuItems from '@/components/MenuItems'
import { supabase } from '@/lib/supabase'
import { Category, Item } from '@/types/database'
import Image from 'next/image'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [itemsLoading, setItemsLoading] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchItems = useCallback(async (categoryId: string) => {
    try {
      setItemsLoading(true)
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('cat_id', categoryId)
        .order('name')

      if (itemsError) throw itemsError
      // Small delay so animation resets between categories
      await new Promise(r => setTimeout(r, 150))
      setItems(itemsData || [])
    } catch (error) {
      console.error('Error fetching items:', error)
      setItems([])
    } finally {
      setItemsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchItems(selectedCategory)
    }
  }, [selectedCategory, fetchItems])

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

  const toggleOrderItem = (item: Item) => {
    setSelectedItems((current) => {
      const isSelected = current.some((selectedItem) => selectedItem.id === item.id)
      if (isSelected) {
        return current.filter((selectedItem) => selectedItem.id !== item.id)
      }

      return [...current, item]
    })
  }

  const selectedTotal = selectedItems.reduce((total, item) => total + item.price, 0)

  if (loading) {
    return (
      <main className="menu-app">
        <div className="loading-screen">
          <div className="loading-logo-wrapper">
            <Image
              src="/lamlogo.png"
              alt="Lambadina Logo"
              width={80}
              height={80}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
              priority
            />
          </div>
          <div className="loading-spinner" />
          <p className="loading-text">Loading menu...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="menu-app">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-bg-pattern" />
        <div className="hero-content">
          <div className={`logo-container ${logoLoaded ? 'logo-loaded' : ''}`}>
            <div className="logo-glow" />
            <div className="logo-ring" />
            <div className="logo-wrapper">
              <Image
                src="/lamlogo.png"
                alt="Lambadina Logo"
                fill
                sizes="140px"
                style={{ objectFit: 'cover' }}
                priority
                onLoad={() => setLogoLoaded(true)}
              />
            </div>
          </div>
          <MenuHeader restaurantName="Lambadina" />
          <div className="hero-divider">
            <span className="divider-diamond" />
            <span className="divider-line" />
            <span className="divider-diamond" />
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path
              d="M0,40 C320,100 620,0 960,50 C1200,85 1360,30 1440,50 L1440,100 L0,100 Z"
              fill="var(--background)"
            />
          </svg>
        </div>
      </div>

      {/* Menu Content */}
      {categories.length > 0 && (
        <>
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <MenuItems
            items={items}
            loading={itemsLoading}
            selectedItemIds={selectedItems.map((item) => item.id)}
            onToggleItem={toggleOrderItem}
          />
        </>
      )}

      {selectedItems.length > 0 && (
        <aside className="order-note" aria-label="Temporary order note">
          <div className="order-note-header">
            <div>
              <p className="order-note-label">Order note</p>
              <strong>{selectedItems.length} selected</strong>
            </div>
            <button type="button" onClick={() => setSelectedItems([])}>
              Clear
            </button>
          </div>
          <div className="order-note-list">
            {selectedItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="order-note-item"
                onClick={() => toggleOrderItem(item)}
              >
                <span>{item.name}</span>
                <span>
                  <span className="currency-label">ETB</span>
                  {item.price.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
          <div className="order-note-total">
            <span>Estimated total</span>
            <strong>
              <span className="currency-label">ETB</span>
              {selectedTotal.toFixed(2)}
            </strong>
          </div>
        </aside>
      )}

      <footer className="menu-footer">
        <div className="footer-divider" />
        <p>Lambadina Restaurant</p>
        <p className="footer-sub">Fresh • Local • Delicious</p>
      </footer>
    </main>
  )
}

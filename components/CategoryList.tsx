'use client'

import { useRef, useEffect } from 'react'
import { Category } from '@/types/database'

interface CategoryListProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Auto-scroll to keep selected category visible
  useEffect(() => {
    const btn = buttonRefs.current.get(selectedCategory)
    if (btn && scrollRef.current) {
      const container = scrollRef.current
      const scrollLeft = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [selectedCategory])

  return (
    <nav className="category-nav">
      <div className="category-label">
        <span>Browse Menu</span>
      </div>
      <div className="category-scroll" ref={scrollRef}>
        <div className="category-list">
          {categories.map((category, index) => (
            <button
              key={category.id}
              ref={(el) => {
                if (el) buttonRefs.current.set(category.id, el)
              }}
              className={`category-button ${
                selectedCategory === category.id ? 'active' : ''
              }`}
              onClick={() => onSelectCategory(category.id)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="category-button-text">{category.name}</span>
              {selectedCategory === category.id && (
                <span className="category-active-dot" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
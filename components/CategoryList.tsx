'use client'

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
  return (
    <nav className="category-nav">
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${
              selectedCategory === category.id ? 'active' : ''
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  )
}


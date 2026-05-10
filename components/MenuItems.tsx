'use client'

import { Item } from '@/types/database'

interface MenuItemsProps {
  items: Item[]
  loading?: boolean
  selectedItemIds?: string[]
  onToggleItem?: (item: Item) => void
}

function MenuItemCard({
  item,
  index,
  selected,
  onToggle,
}: {
  item: Item
  index: number
  selected: boolean
  onToggle?: (item: Item) => void
}) {

  return (
    <div
      className={`menu-item-card ${selected ? 'menu-item-card-tapped' : ''}`}
      style={{ animationDelay: `${index * 70}ms` }}
      onClick={() => onToggle?.(item)}
      role="button"
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onToggle?.(item)
        }
      }}
    >
      <div className="menu-item-accent-line" />
      <div className="menu-item-body">
        <div className="menu-item-header">
          <h3 className="menu-item-name">{item.name}</h3>
          <div className="menu-item-actions">
            <span className="menu-item-price">${item.price.toFixed(2)}</span>
            <span className="menu-item-pick">{selected ? 'Added' : 'Add'}</span>
          </div>
        </div>
        {item.desc && (
          <p className={`menu-item-description ${selected ? 'description-expanded' : ''}`}>
            {item.desc}
          </p>
        )}
      </div>
    </div>
  )
}

export default function MenuItems({
  items,
  loading,
  selectedItemIds = [],
  onToggleItem,
}: MenuItemsProps) {
  if (loading) {
    return (
      <section className="menu-items-section">
        <div className="menu-items-container">
          <div className="menu-items-grid">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="skeleton-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="skeleton-top">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-price" />
                </div>
                <div className="skeleton-line skeleton-desc" />
                <div className="skeleton-line skeleton-desc-short" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="menu-items-section">
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <p className="empty-title">No items yet</p>
          <p className="empty-sub">Check back soon for updates!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="menu-items-section">
      <div className="menu-items-container">
        <div className="items-count">{items.length} item{items.length !== 1 ? 's' : ''}</div>
        <div className="menu-items-grid">
          {items.map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={item}
              index={index}
              selected={selectedItemIds.includes(item.id)}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

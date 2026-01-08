import { Item } from '@/types/database'

interface MenuItemsProps {
  items: Item[]
}

export default function MenuItems({ items }: MenuItemsProps) {
  return (
    <section className="menu-items-section">
      <div className="menu-items-container">
        <div className="menu-items-grid">
          {items.map((item) => (
            <div key={item.id} className="menu-item-card">
              <div className="menu-item-header">
                <h3 className="menu-item-name">{item.name}</h3>
                <span className="menu-item-price">${item.price.toFixed(2)}</span>
              </div>
              <p className="menu-item-description">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


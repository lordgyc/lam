interface MenuHeaderProps {
  restaurantName: string
}

export default function MenuHeader({ restaurantName }: MenuHeaderProps) {
  return (
    <header className="menu-header">
      <div className="menu-header-content">
        <h1 className="restaurant-name">{restaurantName}</h1>
        <p className="restaurant-tagline">Fresh • Local • Delicious</p>
      </div>
    </header>
  )
}


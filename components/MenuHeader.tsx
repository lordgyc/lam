'use client'

interface MenuHeaderProps {
  restaurantName: string
}

export default function MenuHeader({ restaurantName }: MenuHeaderProps) {
  return (
    <div className="hero-text">
      <h1 className="restaurant-name">{restaurantName}</h1>
      <p className="restaurant-tagline">Authentic Ethiopian Cuisine</p>
    </div>
  )
}
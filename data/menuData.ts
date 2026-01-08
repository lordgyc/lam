export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  popular?: boolean
  spicy?: boolean
  vegetarian?: boolean
  vegan?: boolean
}

export interface Category {
  id: string
  name: string
  items: MenuItem[]
}

export interface MenuData {
  restaurantName: string
  categories: Category[]
}

export const menuData: MenuData = {
  restaurantName: 'La Menu',
  categories: [
    {
      id: 'appetizers',
      name: 'Appetizers',
      items: [
        {
          id: 'bruschetta',
          name: 'Classic Bruschetta',
          description:
            'Toasted bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil',
          price: 8.99,
          vegetarian: true,
          popular: true,
        },
        {
          id: 'caesar-salad',
          name: 'Caesar Salad',
          description:
            'Crisp romaine lettuce with parmesan cheese, croutons, and house-made caesar dressing',
          price: 9.99,
          vegetarian: true,
        },
        {
          id: 'wings',
          name: 'Buffalo Wings',
          description:
            'Crispy chicken wings tossed in our signature buffalo sauce, served with blue cheese',
          price: 12.99,
          spicy: true,
          popular: true,
        },
        {
          id: 'spring-rolls',
          name: 'Vegetable Spring Rolls',
          description:
            'Fresh vegetables wrapped in rice paper, served with sweet chili dipping sauce',
          price: 7.99,
          vegetarian: true,
          vegan: true,
        },
      ],
    },
    {
      id: 'mains',
      name: 'Main Courses',
      items: [
        {
          id: 'burger',
          name: 'Classic Burger',
          description:
            'Angus beef patty with lettuce, tomato, onion, pickles, and special sauce on brioche bun',
          price: 14.99,
          popular: true,
        },
        {
          id: 'pasta',
          name: 'Spaghetti Carbonara',
          description:
            'Creamy pasta with pancetta, parmesan cheese, eggs, and black pepper',
          price: 16.99,
        },
        {
          id: 'salmon',
          name: 'Grilled Salmon',
          description:
            'Fresh Atlantic salmon grilled to perfection, served with roasted vegetables and lemon',
          price: 22.99,
          popular: true,
        },
        {
          id: 'risotto',
          name: 'Mushroom Risotto',
          description:
            'Creamy arborio rice with mixed wild mushrooms, parmesan, and fresh herbs',
          price: 18.99,
          vegetarian: true,
        },
        {
          id: 'curry',
          name: 'Thai Green Curry',
          description:
            'Aromatic green curry with vegetables, coconut milk, and jasmine rice',
          price: 17.99,
          spicy: true,
          vegetarian: true,
          vegan: true,
        },
      ],
    },
    {
      id: 'desserts',
      name: 'Desserts',
      items: [
        {
          id: 'tiramisu',
          name: 'Tiramisu',
          description:
            'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
          price: 8.99,
          popular: true,
        },
        {
          id: 'chocolate-cake',
          name: 'Chocolate Lava Cake',
          description:
            'Warm chocolate cake with a molten center, served with vanilla ice cream',
          price: 9.99,
          popular: true,
        },
        {
          id: 'cheesecake',
          name: 'New York Cheesecake',
          description:
            'Rich and creamy cheesecake with graham cracker crust and berry compote',
          price: 8.99,
        },
        {
          id: 'sorbet',
          name: 'Mixed Berry Sorbet',
          description:
            'Refreshing sorbet made with fresh seasonal berries',
          price: 6.99,
          vegetarian: true,
          vegan: true,
        },
      ],
    },
    {
      id: 'drinks',
      name: 'Beverages',
      items: [
        {
          id: 'lemonade',
          name: 'Fresh Lemonade',
          description: 'House-made lemonade with fresh lemons and a hint of mint',
          price: 4.99,
          vegetarian: true,
          vegan: true,
        },
        {
          id: 'coffee',
          name: 'Espresso',
          description: 'Rich and bold espresso, served hot',
          price: 3.99,
          vegetarian: true,
          vegan: true,
        },
        {
          id: 'smoothie',
          name: 'Berry Smoothie',
          description: 'Blended mixed berries with yogurt and honey',
          price: 6.99,
          vegetarian: true,
        },
        {
          id: 'iced-tea',
          name: 'Iced Tea',
          description: 'Refreshing iced tea with lemon, sweetened to perfection',
          price: 3.99,
          vegetarian: true,
          vegan: true,
        },
      ],
    },
  ],
}


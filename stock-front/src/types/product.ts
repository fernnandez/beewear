export interface ProductVariation {
  id: string
  productId: string
  sku: string
  size: string
  color: string
  stock: number
  minStock: number
  price: number
  images?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  brand?: string
  supplier?: string
  basePrice: number
  isActive: boolean
  variations: ProductVariation[]
  totalStock: number
  createdAt: string
  updatedAt: string
}

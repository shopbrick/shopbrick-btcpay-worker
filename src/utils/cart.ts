import { CartItem } from '../types'

export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) =>
    sum + item.qty * item.price,
    0
  )
}

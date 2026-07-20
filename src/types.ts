export interface Env {
  BTCPAY_URL: string
  BTCPAY_STORE_ID: string
  BTCPAY_API_KEY: string
}

interface CartItem {
  pvk: string
  qty: number
  price: number
  currency: string
}

export interface CreateInvoiceRequest {
  cart: CartItem[]
  returnUrl: string
}

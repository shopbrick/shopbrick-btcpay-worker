import { CreateInvoiceRequest, Env } from "./types"
import { jsonResponse } from "./utils/response"

export async function createInvoice(request: Request, env: Env): Promise<Response> {
  const body = await request.json<CreateInvoiceRequest>()

  const total = body.cart.reduce(
    (sum, item) =>
      sum + item.qty * item.price,
    0
  )

  const currency = body.cart[0]?.currency ?? 'GBP'

  const response = await fetch(
    `${env.BTCPAY_URL}/api/v1/stores/${env.BTCPAY_STORE_ID}/invoices`,
    {
      method: 'POST',
      headers: {
        Authorization:
          `token ${env.BTCPAY_API_KEY}`,
        'Content-Type':
          'application/json'
      },
      body: JSON.stringify({
        amount: total.toFixed(2),
        currency,
        metadata: {
          cart: body.cart,
          shopbrick: { version: '1.0.0' }
        },
        checkout: {
          redirectURL: body.returnUrl,
          redirectAutomatically: true
        }
      })
    }
  )

  const invoice = await response.json<any>()
  const self = new URL(request.url)
  const statusUrl = `${self.origin}/invoice/${invoice.id}`

  return jsonResponse({
    invoiceId: invoice.id,
    checkoutUrl: invoice.checkoutLink,
    statusUrl
  })
}

export async function getInvoice(invoiceId: string, env: Env): Promise<Response> {
  const response = await fetch(
    `${env.BTCPAY_URL}/api/v1/stores/${env.BTCPAY_STORE_ID}/invoices/${invoiceId}`,
    {
      headers: {
        Authorization:
          `token ${env.BTCPAY_API_KEY}`
      }
    }
  )

  const invoice = await response.json<any>()

  return jsonResponse({
    invoiceId: invoice.id,
    status: invoice.status,
    metadata: invoice.metadata
  })
}

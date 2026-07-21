// BTCPay REST client
import { CreateInvoiceRequest, Env } from '../types'

interface BTCPayInvoice {
  id: string
  status: string
  checkoutLink: string
  metadata: unknown
}

export async function btcpayCreateInvoice(body: CreateInvoiceRequest, total: number, env: Env): Promise<BTCPayInvoice> {
  const currency = body.cart[0]?.currency ?? 'GBP'

  const response = await fetch(
    `${env.BTCPAY_URL}/api/v1/stores/${env.BTCPAY_STORE_ID}/invoices`,
    {
      method: 'POST',
      headers: {
        Authorization: `token ${env.BTCPAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        buildInvoicePayload(
          body,
          total,
          currency
        )
      )
    }
  )

  return response.json<BTCPayInvoice>()
}

export async function btcpayGetInvoice(invoiceId: string, env: Env): Promise<BTCPayInvoice> {
  const response = await fetch(
    `${env.BTCPAY_URL}/api/v1/stores/${env.BTCPAY_STORE_ID}/invoices/${invoiceId}`,
    {
      headers: {
        Authorization: `token ${env.BTCPAY_API_KEY}`
      }
    }
  )

  return response.json<BTCPayInvoice>()
}

export function buildInvoicePayload(body: CreateInvoiceRequest, total: number, currency: string) {
  return {
    amount: total.toFixed(2),
    currency,
    metadata: {
      cart: body.cart,
      shopbrick: {
        version: '1.0.0'
      }
    },
    checkout: {
      redirectURL: body.returnUrl,
      redirectAutomatically: true
    }
  }
}

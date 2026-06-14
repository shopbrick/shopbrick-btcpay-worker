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

interface CreateInvoiceRequest {
  cart: CartItem[]
  successUrl: string
  cancelUrl: string
}

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {
    const url = new URL(request.url)

    if (
      request.method === 'POST' &&
      url.pathname === '/invoice'
    ) {
      return createInvoice(request, env)
    }

    if (
      request.method === 'GET' &&
      url.pathname.startsWith('/invoice/')
    ) {
      const invoiceId =
        url.pathname.split('/').pop()

      return getInvoice(invoiceId!, env)
    }

    return new Response('Not found', {
      status: 404
    })
  }
}

async function createInvoice(
  request: Request,
  env: Env
): Promise<Response> {
  const body =
    await request.json<CreateInvoiceRequest>()

  const total = body.cart.reduce(
    (sum, item) =>
      sum + item.qty * item.price,
    0
  )

  const currency =
    body.cart[0]?.currency ?? 'GBP'

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

          shopbrick: {
            version: '1.0.0'
          }
        },

        checkout: {
          redirectURL:
            body.successUrl,

          redirectAutomatically:
            true
        }
      })
    }
  )

  const invoice =
    await response.json<any>()

  return Response.json({
    invoiceId: invoice.id,

    checkoutUrl:
      invoice.checkoutLink
  })
}

async function getInvoice(
  invoiceId: string,
  env: Env
): Promise<Response> {
  const response = await fetch(
    `${env.BTCPAY_URL}/api/v1/stores/${env.BTCPAY_STORE_ID}/invoices/${invoiceId}`,
    {
      headers: {
        Authorization:
          `token ${env.BTCPAY_API_KEY}`
      }
    }
  )

  const invoice =
    await response.json<any>()

  return Response.json({
    invoiceId: invoice.id,
    status: invoice.status,
    metadata: invoice.metadata
  })
}

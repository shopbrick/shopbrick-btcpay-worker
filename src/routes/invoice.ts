// HTTP handlers
import { CreateInvoiceRequest, Env } from '../utils/types'
import { btcpayCreateInvoice, btcpayGetInvoice } from '../services/btcpay'
import { calculateCartTotal } from '../utils/cart'
import { jsonResponse } from '../utils/response'
import { buildStatusUrl } from '../utils/url'

export async function handleCreateInvoice(request: Request, env: Env): Promise<Response> {
  const body = await request.json<CreateInvoiceRequest>()

  const total = calculateCartTotal(body.cart)

  const invoice = await btcpayCreateInvoice(body, total, env)

  return jsonResponse({
    invoiceId: invoice.id,
    checkoutUrl: invoice.checkoutLink,
    statusUrl: buildStatusUrl(request, invoice.id)
  })
}

export async function handleGetInvoice(invoiceId: string, env: Env): Promise<Response> {
  const invoice = await btcpayGetInvoice(invoiceId, env)

  return jsonResponse({
    invoiceId: invoice.id,
    status: invoice.status,
    metadata: invoice.metadata
  })
}

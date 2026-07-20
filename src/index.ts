import { createInvoice, getInvoice } from "./invoice"
import { Env } from "./types"
import { corsHeaders } from "./utils/cors"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname === '/invoice') {
      return createInvoice(request, env)
    }

    if (request.method === 'GET' && url.pathname.startsWith('/invoice/')) {
      const invoiceId = url.pathname.split('/').pop()
      return getInvoice(invoiceId!, env)
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  }
}

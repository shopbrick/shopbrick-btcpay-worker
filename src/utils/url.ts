export function buildStatusUrl(request: Request, invoiceId: string): string {
  const self = new URL(request.url)

  return `${self.origin}/invoice/${invoiceId}`
}

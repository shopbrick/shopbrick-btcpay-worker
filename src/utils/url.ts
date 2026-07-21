export function buildStatusUrl(origin: string, invoiceId: string): string {
  return `${origin}/invoice/${invoiceId}`
}

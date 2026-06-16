# shopbrick-btcpay-worker

Cloudflare Worker that allows ShopBrick to create and query BTCPay Server invoices without exposing BTCPay API credentials to the browser.

## Features

* Create BTCPay invoices
* Store full ShopBrick cart metadata
* Query invoice status
* Redirect customers to BTCPay checkout
* Works with static ShopBrick deployments

## Requirements

* Cloudflare account
* BTCPay Server
* Node.js 20+

## Installation

```bash
git clone https://github.com/shopbrick/shopbrick-btcpay-worker.git

cd shopbrick-btcpay-worker

npm install
```

## Local Development

Create `.dev.vars`

```bash
BTCPAY_URL=https://btcpay.example.com
BTCPAY_STORE_ID=xxxxxxxx
BTCPAY_API_KEY=xxxxxxxx
```

Run:

```bash
npx wrangler dev
```

Worker will be available at:

```text
http://localhost:8787
```

## Create Invoice

Request:

```http
POST /invoice
```

Body:

```json
{
  "cart": [
    {
      "pvk": "hoodie-black",
      "qty": 2,
      "price": 39.99,
      "currency": "GBP"
    }
  ],
  "returnUrl": "http://localhost:3000/payment-status"
}
```

Response:

```json
{
  "invoiceId": "...",
  "checkoutUrl": "...",
  "statusUrl": "..."
}
```

Testing with cURL:

```sh
curl \
  -X POST \
  http://localhost:8787/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "cart": [
      {
        "pvk":"hoodie-black",
        "qty":2,
        "price":39.99,
        "currency":"GBP"
      }
    ],
    "returnUrl":"http://localhost:3000/payment-status"
  }'
```

## Get Invoice Status

Request:

```http
GET /invoice/:id
```

Response:

```json
{
  "invoiceId": "...",
  "status": "Settled",
  "metadata": {}
}
```

## Production Deployment

Login to Cloudflare:

```bash
npx wrangler login
```

Configure secrets:

```bash
npx wrangler secret put BTCPAY_API_KEY
```

Configure non-secret variables in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "BTCPAY_URL": "https://btcpay.example.com",
    "BTCPAY_STORE_ID": "xxxxxxxx"
  }
}
```

Example:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",

  "name": "shopbrick-btcpay-worker",

  "main": "src/index.ts",

  "compatibility_date": "2025-01-01",

  "vars": {
    "BTCPAY_URL": "https://btcpay.example.com",
    "BTCPAY_STORE_ID": "xxxxxxxx"
  }
}
```

Deploy:

```bash
npx wrangler deploy
```

Cloudflare will return a URL similar to:

```text
https://shopbrick-btcpay-worker.your-subdomain.workers.dev
```

### Production Variables

| Variable          | Description                             | Example                       |
| ----------------- | --------------------------------------- | ----------------------------- |
| `BTCPAY_URL`      | BTCPay Server URL                       | `https://btcpay.example.com`  |
| `BTCPAY_STORE_ID` | BTCPay Store ID                         | `xxxxxxxx`                    |
| `BTCPAY_API_KEY`  | BTCPay API Key with invoice permissions | Stored as a Cloudflare Secret |

### Viewing Current Configuration

View deployed variables:

```bash
npx wrangler versions secret list
```

and inspect your local `wrangler.jsonc` for non-secret variables.

## ShopBrick Configuration

Add URL of the BTCPay worker into ShopBrick's `config/production.yml` and `config/test.yml`

```yaml
btcPayWorkerUrl: https://shopbrick-btcpay-worker.your-subdomain.workers.dev
```

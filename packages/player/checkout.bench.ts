import { getBestCheckout, getBestCheckout2 } from '../aim/checkout.ts'
import { randomProfile } from './profile.ts'

const profile = randomProfile()
Deno.bench(
  'getBestCheckout',
  { group: 'checkout', baseline: true, warmup: 100 },
  () => {
    getBestCheckout(100, profile)
  },
)

Deno.bench('getBestCheckout2', { group: 'checkout', warmup: 100 }, () => {
  getBestCheckout2(100, profile)
})

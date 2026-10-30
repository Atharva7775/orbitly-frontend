# Volume-tier pricing experiment

| Quantity of one SKU | Unit discount |
| --- | --- |
| 3–5 | 5% |
| 6–11 | 10% |
| 12+ | 15% |

Tiers do not stack with promo codes; `computeTotals` applies whichever saves the
customer more. The backend mirrors this in `app/services/pricing.py` on its own
`exp/new-pricing` branch. This build is for the A/B cohort only.

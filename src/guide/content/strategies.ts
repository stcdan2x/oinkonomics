import type { GuideArticle } from '../types'

// Strategies section: the eleven catalog strategies (catalog 1 to 11), the
// framing article, the decision rules and capital and payback. Compiled from
// research/business-models-and-strategies.md (BM- rows) and the sibling rows it
// cites, all in research/parameters.md.

export const STRATEGIES: GuideArticle[] = [
  {
    id: 'strategy-sell-weaners',
    section: 'strategies',
    title: 'Sell weaners (biik)',
    summary: 'Keep sows and sell the litter at weaning or at 10 to 15 kg, before the piglets need grower feed. The shortest and least cash-hungry sow strategy; it lives or dies on pigs weaned per litter and the local per-head price.',
    catalog: 1,
    prices: true,
    sources: ['BM-01', 'BM-02', 'BM-03', 'BM-11', 'BM-12', 'BM-15', 'BM-16', 'BM-17', 'BM-18', 'BM-21', 'BM-31', 'BM-33', 'BM-99', 'BM-100', 'PC-24', 'PC-55', 'PC-58', 'PC-61', 'PC-66', 'PM-26', 'PM-27', 'RT-42', 'RK-06', 'HO-57'],
    terms: [{ term: 'Weaner piglet', tagalog: 'biik', meaning: 'A piglet sold at or soon after weaning, traded at 10 to 15 kg live and priced per head.' }],
    body: `## What it is

Keep one or more sows, breed by AI or a travelling boar, and sell the litter at or soon after weaning, before the piglets need starter and grower feed. The DA roadmap calls this the sow-weaner operation (BM-16). Feeder piglets are traded at 10 to 15 kg, which the roadmap feed schedule reaches at about 2 months of age after 11.16 kg of booster and pre-starter (BM-02, BM-03). Buyers pay per head, with a two-tier per-kg convention behind it: the first 10 kg cost far more per kg than the weight above 10 kg, so lighter piglets fetch more per kg (PM-27). The main outlets are neighbouring raisers and village agents (PM-26); see [sale channels and buyers](/guide/sale-channels-and-buyers).

This is one of the three strategies the Plan page scores. See [projection assumptions](/guide/projection-assumptions) and [decision rules](/guide/decision-rules).

## Cash cycle

Service to sale: 115 days of gestation (PC-24) plus 30 to 60 days to weaning or 10 to 15 kg, so 145 to 175 days. Farrowing to cash: 30 to 60 days. Sow feed runs on between litters: 413 kg per cycle plus feed for the lost days (BM-11). Of the sow-based activities this one has the shortest cycle and the least total and cash cost; in the 2000-2001 Southern Luzon survey 27.5 percent of its cost was unpaid family labour (BM-31).

## Costs and revenue

DA roadmap budget per weaner (2022 Batangas prices): sow feed share ₱920.10, plus biologics, wages, water and electricity, breeding, repairs and sundries, total cost ₱1,738.81; sale at ₱2,500; net ₱761.19 per weaner (BM-12, BM-16). The roadmap text quotes sales of ₱3,000 to ₱4,000, which lifts the net to ₱1,261 to ₱2,261 per weaner (BM-16). The app default weaner price is ₱2,500 (DA roadmap, 2022 prices); a Cotabato survey published April 2026 found ₱2,586 per head (BM-01).

The research rebuilds the litter at 2022 prices with family labour costed at ₱3,000 per cycle (BM-15). These figures are derived:

| Litter | Total cost | Cost per weaner | Revenue at ₱2,500 | Net per litter |
|---|---|---|---|---|
| 10 weaned | ₱20,956 | ₱2,096 | ₱25,000 | ₱4,044 |
| 7 weaned | ₱19,752 | ₱2,822 | ₱17,500 | -₱2,252 |

At 7 weaned the break-even weaner price is about ₱2,820 with family labour costed and ₱2,390 cash only (2022 prices) (BM-17). At ₱2,500 per head the litter needs 8.1 weaned to break even (BM-18). Per sow per year, 1.8 litters of 7 weaned gives 12.6 weaners; 2.0 litters of 10 gives 20 (PC-66).

## When it wins

- The weaner price is at or above about ₱2,800 per head (2022 feed prices), or the litter reaches 9 to 10 weaned (BM-17).
- You have little cash for grower feed. Fattening is the most cash-demanding activity, with weaners and feed paid up front (BM-33).
- Restocking demand is high, after ASF culls or when repopulation programs buy piglets.
- Your pens cover only farrowing and gestation.

## When it loses

- Piglet buyers are scarce or pay below about ₱2,400 (2022 feed prices) (BM-17).
- Pre-weaning mortality runs at the smallholder 16 to 37 percent instead of under 10 percent (PC-58, PC-55).
- Sow non-productive days pile up; each lost day costs 2 kg of feed (BM-11).
- ASF movement bans stop piglet trade in red and pink zones (RT-42).

The Bulacan 2014 survey found farrow-to-feeder the lowest net per head of the sow-herd systems, ₱399 to ₱693 per head at 2014 prices, though at 18 to 22 percent profit-to-sales (BM-21).

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Piglet price below break-even (about ₱2,400 to ₱2,800 at 2022 feed prices, 7 weaned) | Medium: no price series exists, only three dated points (BM-01) | -₱2,252 per litter at ₱2,500 with 7 weaned (BM-17) | Raise pigs weaned per litter (creep heat, colostrum, iron); sell the smallest first (PM-27); keep Rule 4 on the sow card |
| Pre-weaning mortality 16 to 37 percent (PC-58) | High for untreated smallholder herds | Each lost piglet is ₱2,500 to ₱3,500 of revenue on a fixed sow cost | Heated creep at 32 C, colostrum within 24 hours, iron at day 2 to 3, farrowing crate or guard rails (PC-61, HO-57) |
| ASF: suckling piglets get ₱0 cash assistance and a movement ban stops piglet trade (BM-99) | Medium | Loss of the sow (₱12,000 assistance, 2024 terms) and the litter | Level 1 biosecurity, RSBSA and PCIC enrolment (F1 breeder cover ₱14,500, 2021 terms) (BM-100); sell within the municipality in pink or red zones (RT-42) |

See [ASF in the Philippines](/guide/asf-in-the-philippines) and [mortality benchmarks](/guide/mortality-benchmarks).

## Records needed

Sow card (service date, boar or AI batch, expected farrowing at service plus 114 to 115 days, born alive, stillborn, weaned, weaning weights); piglet processing log; a piglet sales or dispersal record (date, head, age, total weight, value); feed purchase log; treatment log with withdrawal periods; non-productive days per sow (RK-06). Selling part of the litter and growing the rest is covered in [the mixed litter](/guide/strategy-mixed-litter).`,
  },
  {
    id: 'strategy-grow-to-roaster',
    section: 'strategies',
    title: 'Grow to roaster (lechon) size',
    summary: 'Hold piglets to the 5 to 30 kg live weights lechoneros buy and sell per head by size class. It pays only against a per-head order above the break-even lechon live price.',
    catalog: 2,
    prices: true,
    sources: ['BM-59', 'BM-60', 'BM-61', 'BM-62', 'BM-63', 'BM-75', 'BM-102', 'GN-10', 'GN-11', 'GN-35', 'GN-36', 'GN-91', 'PC-47', 'PC-62', 'PM-05', 'PM-23', 'PM-25', 'RK-34', 'RK-48', 'RK-49', 'RK-50', 'RT-35', 'HO-104'],
    terms: [
      { term: 'Lechonero', tagalog: 'lechonero', meaning: 'A roaster who buys live pigs by size class to cook and sell as lechon.' },
      { term: 'Lechon de leche', tagalog: 'lechon de leche', meaning: 'The smallest roasting pig: 5 to 9 or 10 kg live, about 3 to 5 kg cooked.' },
    ],
    body: `## What it is

Instead of selling at 10 to 15 kg, keep part or all of a litter to the live weights lechoneros (roasters) buy (BM-59):

| Class | Live weight |
|---|---|
| Lechon de leche | 5 to 10 kg (vendor band 5 to 9 kg) |
| Small | 10 to 15 kg |
| Medium | 15 to 20 kg |
| Large | 20 to 25 kg |
| Extra large | 25 to 30 kg |

Cooked weight is about half of live weight (GN-11). Lechon bands are only 3 to 4 kg wide (GN-10). Roasters buy live pigs by size class, re-set prices around mid-December, source from whichever island is cheapest and are sensitive to ASF shipping rules (PM-23). See [pricing units](/guide/pricing-units) and [sale channels and buyers](/guide/sale-channels-and-buyers).

This is one of the three strategies the Plan page scores. See [projection assumptions](/guide/projection-assumptions) and [decision rules](/guide/decision-rules).

## Cash cycle

Farrowing to sale at 20 to 25 kg live: about 75 to 95 days (GN-35, GN-36). From the 10 to 15 kg weaner stage, 25 to 40 extra days. Lechon de leche at 5 to 9 kg live is sold at or just after weaning at 30 days (PC-47).

## Costs and revenue

Everything in [sell weaners](/guide/strategy-sell-weaners) plus about 25 kg of pre-starter and starter feed from a 10 kg weaner to 25 kg live, about ₱738 at 2022 prices (BM-60), plus 11 percent for biologics, repairs and sundries, about ₱81 (RK-48, RK-49, RK-50). Nursery mortality benchmark 1.5 to 3 percent (RK-34). A live pig crossing a municipal boundary needs a VHC (RT-35).

Revenue is per head by size class, negotiated with the roaster. No primary source publishes the live price lechoneros pay; the research lists this as an open question, so the app asks for the offer. What is documented is downstream: roasted lechon de leche (3 to 5 kg cooked) retailed at ₱8,000 on a Cebu chain list of 17 December 2025, and the smallest La Loma lechon at ₱10,000 to ₱12,000 on 23 December 2025 (BM-62). Live hogs cost lechoneros ₱120 to ₱140 per kg in Negros against ₱180 in Cebu in October 2024 (PM-05).

Break-even lechon live price (Rule 2, derived): the weaner value plus holding cost, divided by the expected live weight after nursery mortality. For a 25 kg pig it is ₱135 per kg live at a ₱2,500 weaner and ₱176 at a ₱3,500 weaner (2022 feed prices), or ₱143 and ₱184 with 2026 dealer feed at ₱36.55 per kg (secondary, July 2026) (BM-61). Read: unless the roaster pays at least those per-kg figures times the live weight, about ₱3,400 to ₱4,600 for a 25 kg pig, you earn more by selling the weaner and saving the feed. A 25 kg pig sold at the June 2026 national market-hog price of ₱172.62 per kg would gross ₱4,316 (BM-102), so the hold is roughly a wash at a ₱3,500 weaner price and pays only when the lechon channel offers a per-head premium. Historically piglets fetched 55 percent more per kg than slaughter hogs (PM-25), which is why the smallest pigs are sold, not grown, without a lechon order.

Seasonality: roasted lechon prices rose 29 to 33 percent at La Loma in early December 2024 (BM-63), but the farmgate series shows no reliable December uplift (BM-75). No series prices lechon-size live pigs, so a December live premium can neither be confirmed nor excluded. Pre-arrange per-head orders for the December run rather than speculate; see [price seasonality](/guide/price-seasonality).

## When it wins

- A lechonero, caterer or fiesta host places a per-head order in advance at a price above the break-even.
- You have starter feed on hand and spare nursery space.
- Piglet prices are seasonally weak (undocumented but plausible after mass culls, when many raisers sell weaners at once).
- The pig is small enough to sell whole to a household for a family event.

## When it loses

- No roaster order, and the pig is sold per kg at the market-hog price: the extra feed earns less than the weaner premium.
- An ASF movement restriction closes inter-island lechon trade; La Loma roasters closed for three weeks in late 2025.
- Roasters switch sourcing to a cheaper island.
- Mortality or a diarrhoea break after the feed change.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| No roaster order: pig sold per kg at market-hog price | High unless pre-arranged | Hold cost of ₱740 to ₱1,000 per pig (2022 to 2026 feed) earns less than the weaner premium (PM-25) | Sell only against a per-head order with a deposit; compute the break-even (Rule 2) |
| Feed-change scours and nursery mortality | Medium | 2 to 3 percent losses plus treatment (RK-34) | Gradual feed transition, creep feed from day 14, deworm 1 to 2 weeks after weaning (PC-62, HO-104) |
| ASF shipping rules close inter-island lechon trade | Medium (La Loma closed 3 weeks in late 2025) | Orders cancelled | Local roasters, written orders, VHC readiness (RT-35) |

See [ASF in the Philippines](/guide/asf-in-the-philippines).

## Records needed

As sell weaners, plus a per-pig weight log by heart-girth estimate (GN-91), an order book (buyer, size band, agreed price per head, delivery date, deposit) and VHC copies for pigs leaving the municipality (RT-35). Holding only part of the litter is [the mixed litter](/guide/strategy-mixed-litter).`,
  },
  {
    id: 'strategy-grow-to-market',
    section: 'strategies',
    title: 'Grow to market weight',
    summary: 'Keep sows and grow the whole litter to 80 to 100 kg for sale per kg live. The longest cycle and the highest net per pig in the budgets, but the most exposed to the liveweight price and the feed price.',
    catalog: 3,
    prices: true,
    sources: ['BM-03', 'BM-04', 'BM-05', 'BM-08', 'BM-09', 'BM-10', 'BM-19', 'BM-20', 'BM-29', 'BM-73', 'BM-77', 'BM-79', 'BM-99', 'BM-100', 'BM-101', 'BM-102', 'GN-17', 'GN-19', 'GN-27', 'GN-32', 'GN-62', 'GN-68', 'GN-72', 'GN-73', 'GN-80', 'GN-91', 'PM-20', 'PM-28', 'PM-35', 'PM-48', 'RK-36', 'RT-59', 'RT-68', 'HB-10', 'HB-35', 'HB-42', 'HO-65'],
    terms: [{ term: 'Viajero', tagalog: 'viajero', meaning: 'A travelling hog trader who buys live pigs per kg at the farm and sells them on, live or as carcasses.' }],
    body: `## What it is

Keep sows and grow the whole litter to market weight, then sell live per kg to a viajero, a village agent, a meat vendor or at the LGU slaughterhouse. The DA roadmap calls it the farrow-to-finish operation (BM-19). Market weight: the roadmap uses 90 kg, and buyers deduct ₱5 per kg below 80 kg or above 100 kg (BM-79). See [pricing units](/guide/pricing-units) and [price levels](/guide/price-levels).

This is one of the three strategies the Plan page scores. See [projection assumptions](/guide/projection-assumptions) and [decision rules](/guide/decision-rules).

## Cash cycle

Service to sale 255 to 283 days: 115 days of gestation plus 140 to 168 days from birth to 90 kg (BM-77). Farrowing to sale takes 140 to 168 days at 650 g of daily gain, longer at the national average of 561 g (GN-19, GN-17). This is the longest cycle in the catalog, and sow feed continues throughout.

## Costs and revenue

Sow upkeep and breeding as in [sell weaners](/guide/strategy-sell-weaners); piglet feed 11.16 kg (BM-03); then 206.4 kg of starter, grower and finisher feed per pig from 2 months to 90 kg, ₱5,162.40 at 2022 prices, a weighted ₱25.0 per kg and 2.65 kg of feed per kg of gain (BM-04, BM-05, BM-09); other cash costs ₱1,055 per pig at 2022 prices (BM-10). Feed is 65 to 80 percent of production cost (GN-68).

Revenue is per kg liveweight, weighed at pickup or at the slaughterhouse. Defaults: PSA Household farmgate ₱172.62 per kg (June 2026), 2025 annual ₱198.30, with trader quotes of ₱105 to ₱150 in surplus regions (BM-102).

DA roadmap budget (2022 Batangas prices, 90 kg at ₱110 per kg): sales ₱9,900; total cost ₱8,384.22; cost per kg ₱93.16; net ₱1,515.78 per pig, the highest of the roadmap's four enterprises, assuming 10 per litter and no mortality (BM-19). Bulacan 2014 survey: net ₱2,139 per head in San Jose del Monte and ₱2,797 in Santa Maria, at 20 and 26 percent profit-to-sales (BM-20).

The research rebuilds one litter at 7 weaned and 6.5 finished after 7 percent wean-to-finish mortality (RK-36). These figures are derived:

| Price case | Litter cost | Litter revenue | Net per litter | Per pig sold |
|---|---|---|---|---|
| 2022 roadmap: ₱110 per kg, feed ₱25.0 per kg | ₱63,326 | ₱64,350 | ₱1,024 | about ₱158 |
| ₱172.62 per kg (PSA, June 2026), dealer feed ₱36.55 per kg (secondary, July 2026) | ₱88,355 | ₱100,983 | ₱12,628 | about ₱1,940 |
| ₱172.62 per kg, online feed ₱49.45 per kg (September 2026) | ₱116,648 | ₱100,983 | -₱15,665 | loss |

Litter size and mortality, not feed price, separate a good backyard result from a poor one at a given price.

## When it wins

- The liveweight price is at or above your cost per kg: 2022 roadmap ₱93.16; PIDS backyard ₱103.78 at 2018 prices; industry ₱185 to ₱205 in 2026 (BM-19, BM-29, BM-101).
- Feed is bought at mill or cooperative prices. A ₱12 per kg feed difference moves the per-pig result by about ₱2,500 (BM-08).
- The litter is 9 or more weaned, pigs sell inside the 80 to 100 kg window (BM-79) and the sale month is March to June (BM-73).
- You can finance about ₱5,200 (2022 prices) to ₱7,500 (2026 dealer feed) of feed per pig for 4 to 5 months (BM-08).

## When it loses

- Prices fall below cost. In October 2025 raisers were losing ₱1,000 per head at ₱150; in August 2026 up to ₱4,200 per head at ₱110 on an 80 kg pig (PM-35).
- An ASF lockdown traps finished pigs; Batangas 2019 saw ₱75 to ₱80 against ₱110 (PM-48).
- Feed prices spike; early 2026 rose 4 to 6 percent (GN-62).
- Growth stalls. The national feed conversion of 3.19 against the roadmap's 2.42 from birth to 90 kg means 30 percent more feed per kg sold (GN-27, GN-32).

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Liveweight price below cost per kg | High in 2025 to 2026 (₱172 against ₱185 to ₱205 claimed cost) (BM-101) | -₱1,000 to -₱4,200 per head at ₱110 to ₱150 per kg (PM-35) | Buy feed at mill or cooperative price; sell in March to June (BM-73); keep to 80 to 100 kg; a cooperative outlet paid 11 percent more (PM-28) |
| Feed price rise | High: feed is 65 to 80 percent of cost, up 4 to 6 percent in the first half of 2026 (GN-68, GN-62) | ₱1 per kg of feed is about ₱230 per pig | Fixed-price feed supply, cooperative membership, by-products within limits (rice bran to 30 percent, copra 10 percent) (GN-72, GN-73) |
| ASF | Medium | Near 100 percent mortality; assistance ₱8,000 per finisher and ₱12,000 per sow (2024 terms), not paid for PCIC-insured hogs (BM-99) | Level 1 biosecurity, no swill, 30-day quarantine of new stock, PCIC cover up to ₱10,000 per fattener (2021 terms), vaccination where eligible (HB-10, HB-42, HB-35, BM-100) |
| Poor growth (FCR 3.19 national against 2.42 budget) | Medium | 30 percent more feed per kg sold (GN-27, GN-32) | Weigh by heart girth (GN-91), phase feeding, water at 2 to 3 litres per kg of feed (GN-80), heat relief (HO-65) |
| Trader lowballing, scale disputes, deductions | Medium: complaints documented in 2019, 2025 and 2026 | 5 to 30 percent of price (PM-20) | Own scale or girth check, several buyers, a slaughterhouse quote, a cooperative |

See [ASF in the Philippines](/guide/asf-in-the-philippines) and [feed conversion and days to weight](/guide/feed-conversion-and-days-to-weight).

## Records needed

The sell-weaners records plus a batch closeout per litter (pigs placed, deaths, feed bags by phase, days on feed, total kg sold, price per kg, buyer), feed conversion and daily gain per batch, weight checks by heart girth (GN-91), VHC and shipping permit copies, and sales invoices for sales of ₱500 or more (RT-59). If you slaughter yourself, the hot-meat rules apply (RT-68). Growing only part of the litter is [the mixed litter](/guide/strategy-mixed-litter).`,
  },
  {
    id: 'strategy-grow-out-only',
    section: 'strategies',
    title: 'Grow-out only (no sows)',
    summary: 'Buy weaners, fatten them to 90 to 100 kg and sell per kg. Shortest cycle and no breeding stock, but the most cash-demanding: the weaner and the first bags of feed are paid before any revenue.',
    catalog: 4,
    prices: true,
    sources: ['BM-01', 'BM-04', 'BM-08', 'BM-10', 'BM-22', 'BM-27', 'BM-28', 'BM-29', 'BM-30', 'BM-33', 'BM-36', 'BM-97', 'BM-98', 'BM-99', 'BM-100', 'BM-102', 'GN-04', 'GN-34', 'PM-01', 'PM-03', 'PM-20', 'RK-36', 'RK-63', 'RT-35', 'RT-59', 'HB-04', 'HB-18', 'HB-42'],
    body: `## What it is

Buy 10 to 15 kg (or 20 to 25 kg) weaners from neighbours, a village trader, a commercial farm or a cooperative, fatten them to 90 to 100 kg and sell per kg. The DA roadmap calls it the finisher operation (BM-27); the Bulacan study calls it the growing-finishing enterprise (BM-22). Independent smallholders mostly buy weaners of unverifiable genetics from neighbouring backyard farms, while cooperative growers get cooperative stock at a 42 percent higher price per head (BM-36). See [decision rules](/guide/decision-rules) and [sale channels and buyers](/guide/sale-channels-and-buyers).

## Cash cycle

120 to 150 days from purchase to sale from a 10 to 15 kg weaner (GN-34); 100 to 120 days from a 20 to 25 kg weaner, from a secondary webinar report (GN-04). The largest cash outlay comes first: the weaner plus the first bags of feed. The Southern Luzon survey called this the most cash-demanding activity even though the cycle is the shortest (BM-33).

## Costs and revenue

Weaner purchase: 36.7 percent of the grow-out cost in 2000-2001, feed 50.3 percent, cash costs 88.5 percent (BM-33). Feed 206.4 kg from 12 to 90 kg, ₱5,162.40 at 2022 prices (BM-04); other cash costs ₱1,055 per pig at 2022 prices (BM-10). Bought pigs need a 30-day quarantine and a VHC on arrival if they come from another municipality (HB-42, RT-35). PIDS adds land rent, which is 31 percent of its modelled backyard operating cost (BM-30). No sow, boar or AI costs. Revenue is per kg liveweight (BM-102).

| Source and date | Selling price | Net per head |
|---|---|---|
| DA roadmap finisher budget, 2022 Batangas, 90 kg at ₱110 per kg | ₱9,900 | ₱1,181.57 (cost per kg ₱96.87) (BM-27) |
| Bulacan survey, 2014, San Jose del Monte | ₱10,611 | ₱1,862 (18 percent profit-to-sales) (BM-22) |
| Bulacan survey, 2014, Santa Maria | ₱10,004 | ₱2,077 (21 percent) (BM-22) |
| Mlang, Cotabato survey published April 2026, 95 kg at ₱140 per kg | gross ₱127,809 per 10-pig cycle | ₱3,690 (piglet ₱2,586, feed ₱5,564; ROI 40.59 percent) (BM-28) |
| PIDS backyard model, 2018 prices, 40 head per cycle | ₱118 per kg | cost ₱103.78 per kg, net ₱14.22 per kg; IRR 2 percent (BM-29) |

The research notes the PIDS per-head detail is internally inconsistent and treats only its cost per kg as citable. The Bulacan authors found the lowest profit-to-sales ratio in this system because substantial expenditures on weaners and feeds are incurred over only 4 to 5 months (BM-22).

2026 re-pricing (derived): at ₱172.62 per kg (PSA, June 2026), 90 kg, 4.5 percent mortality (RK-36), a ₱2,586 weaner (BM-01) and dealer feed at ₱36.55 per kg (secondary, July 2026), the expected margin is about ₱3,390 per head; at online feed prices of ₱49.45 per kg (September 2026) it is ₱435; at a surplus-region quote of ₱120 per kg with dealer feed it is -₱1,132 (BM-08, BM-10).

## When it wins

- The weaner price is low against the break-even weaner price (Rule 1 in [decision rules](/guide/decision-rules)).
- You have a reliable source of healthy, verified weaners (a cooperative or a commercial farm) (BM-36).
- Feed is bought at mill or cooperative price, and capital or credit covers the whole cycle. LIMCOMA offers members a 30-day feed credit line (BM-98); ACPC ANYO lends up to ₱300,000 at 2 percent per year to RSBSA-registered farmers (BM-97).
- You want no long-term commitment, and pens can be emptied and rested between batches.

## When it loses

- Weaner prices spike with restocking demand while finished-hog prices fall, as in 2025 to 2026 when ₱198 per kg fell to ₱172 (PM-03, PM-01).
- Bought pigs bring ASF or PRRS into the pen; quarantine and sentinel rules apply after outbreaks (HB-42, HB-18).
- Feed is bought by the repacked kilo at sari-sari prices.
- Pigs are sold outside the 80 to 100 kg window (PM-20).

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cash exposure: weaner plus feed paid before any revenue | High: the most cash-demanding activity (BM-33) | ₱7,700 to ₱12,800 per pig tied up 120 to 150 days (2022 to 2026 prices) | ANYO credit (BM-97), a cooperative feed line (BM-98), the mixed litter, smaller batches |
| Disease brought in with purchased weaners | Medium: 77 percent of independents buy from neighbours | Batch loss; ASF depopulation within 500 m (HB-04) | 30-day quarantine (HB-42), VHC on arrival, a verified source |
| Weaner price rises while the finished price falls | Medium | Margin turns negative when the weaner price passes the break-even | Apply Rule 1 before each purchase; do not buy above the break-even |
| Buyer default at delivery | Low to medium (undocumented) | One cycle's revenue | Cash at weighing, split deliveries, a known viajero, an invoice (RT-59) |

ASF cash assistance is only ₱8,000 per grower or finisher (2024 terms) (BM-99) and PCIC fattener cover is up to ₱10,000 (2021 terms) (BM-100). See [ASF in the Philippines](/guide/asf-in-the-philippines) and [biosecurity checklist](/guide/biosecurity-checklist).

## Records needed

A purchase record per batch (source farm, VHC number, weight, price per head, date); a quarantine log with daily sickness and deaths (HB-42, RK-63); feed by phase per batch; a treatment log with withdrawal dates; a batch closeout (daily gain, feed conversion, mortality, days on feed, kg sold, price); sales invoices.`,
  },
  {
    id: 'strategy-paiwi',
    section: 'strategies',
    title: 'Paiwi (share-farming)',
    summary: 'A caretaker raises pigs owned by someone else and shares the piglets or the profit. Zero stock and feed capital in the cooperative form, in exchange for half the margin and no side sales.',
    catalog: 5,
    prices: true,
    sources: ['BM-11', 'BM-17', 'BM-37', 'BM-38', 'BM-39', 'BM-40', 'BM-41', 'BM-42', 'BM-43', 'BM-44', 'BM-45', 'GN-34', 'PC-24', 'PC-47', 'PM-29', 'HO-91'],
    terms: [
      { term: 'Paiwi', tagalog: 'paiwi', meaning: 'Share-farming: the owner entrusts a pig to a caretaker who raises it, and they share the piglets or the profit. Also the name of cooperative contract-growing schemes such as SIDC in Batangas.' },
      { term: 'Patronage refund', meaning: 'A cooperative year-end refund to members, credited here on 50 percent of the feed a contract grower used, if the cooperative posts a profit.' },
    ],
    body: `## What it is

Paiwi is the Filipino term for the traditional stewardship of livestock between households: the owner entrusts a gilt to a steward who finances the inputs and breeds the animal, and at weaning the owner takes one or two piglets of their choice (BM-44). The word also names institutional contract growing: the Sorosoro Ibaba Development Cooperative (SIDC, Batangas) has run its paiwi scheme since 1972, supplying member-raisers with piglets, feed, veterinary supplies and technical services while the member provides labour, housing and utilities; the cooperative markets the hogs and profits are shared equally (BM-37, PM-29). Government dispersal programs use a pass-on variant: DA-CAR's SAAD piglet dispersal (2022) gives piglets and feed and takes back one female piglet from the first litter (BM-45). See [sale channels and buyers](/guide/sale-channels-and-buyers) and [decision rules](/guide/decision-rules).

The three documented forms:

| Form | Owner provides | Caretaker provides | Caretaker receives |
|---|---|---|---|
| Traditional stewardship | A gilt or sow | Feed and care, breeding | The litter less 1 or 2 piglets of the owner's choice (BM-44) |
| Cooperative contract growing (SIDC) | Weaners, feed, veterinary supplies, technical service, marketing | Housing, equipment, utilities, labour | 50 percent of activity profit after inputs are deducted from sales (BM-37) |
| Program pass-on (SAAD) | Piglets and feed | Care | The litter less one female piglet returned (BM-45) |

Under the SIDC rules deaths from natural causes are shared through lower profit, deaths from negligence are charged to the grower's share, and the grower may not raise own fatteners, use contract feed on other animals or sell without permission (BM-39). Half of the feed consumed counts toward the grower's year-end patronage refund (BM-38). Contract growers received an 11 percent higher liveweight price than independents (BM-40) and household net income three times that of independents (BM-41), both from the 2000-2001 survey.

## Cash cycle

Contract growing: the grower's cash out is utilities and labour during a 120 to 150 day fattening cycle (GN-34); settlement comes after the cooperative sells. Traditional stewardship: the steward feeds the animal from receipt through gestation to weaning of the first litter, about 145 days for an 8-month gilt bred at once (PC-24, PC-47), and gets cash only when the steward's share of piglets is sold.

## Costs and revenue

Contract growing grower cash cost, DA roadmap paiwi column (2022 prices): wages ₱87.20, water and electricity ₱400, repairs ₱146, total ₱633.20 per head (BM-42). Worked at 2022 roadmap prices (derived): sales ₱9,900 less inputs charged to the grower (animal ₱2,500, feed ₱5,163, biologics ₱154.89) leaves an activity profit of ₱2,082.11; the grower's 50 percent share is ₱1,041 per head, or ₱1,585 with the 11 percent price premium (BM-43). After the grower's own cash costs that leaves about ₱408 per head for housing, labour and risk, plus ₱2,582 of feed credited toward the patronage refund. The research notes the roadmap's own paiwi column prints the same net as its finisher column without netting a split, and uses the documented 50/50 mechanism instead.

Traditional stewardship on a litter of 7 weaned worth ₱2,500 each (2022 prices, derived): the owner takes 2 piglets (₱5,000 in kind) and the steward keeps 5 (₱12,500) against a litter cost of about ₱19,752 with family labour or ₱16,752 cash (BM-17). The steward loses cash unless the owner also pays feed, the litter is larger or weaner prices are higher; at 10 weaned and ₱3,500 per head the steward keeps 8 piglets worth ₱28,000 against ₱20,956 and clears about ₱7,000. No primary source gives cash splits for the traditional form or the share of feed the owner pays; that is an open question.

## When it wins

- You have pens, water, family labour and time but no cash for weaners and feed.
- A cooperative or integrator operates nearby (SIDC and LIMCOMA in Batangas, SOCOSPA in South Cotabato).
- In a traditional paiwi the owner pays for feed, or the litter is large.

## When it loses

- Deaths attributed to your negligence are charged to you (BM-39).
- The owner or cooperative delays settlement or sets an unfavourable sale date.
- You cannot raise own pigs alongside the contract pigs (BM-39).
- In a traditional paiwi you pay the sow's feed for a litter of 6 to 7 and hand over the best two piglets (BM-44, BM-11).

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Counterparty dispute over inputs, deaths or sale date | Medium: verbal terms are common; no written template was found | Loss of your share or of the animal | Written agreement, a joint input ledger, a mortality cause log, the cooperative's statement |
| Mortality charged to the caretaker as negligence (BM-39) | Medium | Animal cost of ₱2,500 plus feed charged to your share (2022 prices) | Daily inspection log, vet call record, biosecurity (HO-91) |
| Lock-in: no side sales or own pigs (BM-39) | Certain under SIDC-type contracts | Forgone independent margin | Accept as the price of zero capital; compare with Rule 5 |

ASF: whose loss it is depends on the form. The SIDC rule shares natural deaths; the traditional form is unspecified. See [ASF in the Philippines](/guide/asf-in-the-philippines).

## Records needed

A written agreement (parties, animals by ID and weight at transfer, who pays feed, medicines and AI, the split rule, the mortality rule, sale authority, settlement date); a running input ledger signed by both sides (feed bags delivered, medicines, dates); weight at delivery and at sale; the cooperative's settlement statement; a daily mortality log with cause, because cause decides who bears the loss (BM-39).`,
  },
  {
    id: 'strategy-contract-growing',
    section: 'strategies',
    title: 'Contract growing for integrators',
    summary: 'Corporate integrators place company-owned pigs with growers who supply land, buildings and labour. Modules start at 400 head with bonds and titled land, so this is not open to a 1 to 10 sow farm.',
    catalog: 6,
    prices: true,
    sources: ['BM-46', 'BM-47', 'BM-48', 'BM-49', 'BM-50', 'BM-39', 'HO-109'],
    terms: [{ term: 'Integrator', meaning: 'A company such as San Miguel Foods (Monterey), Pilmico, Bounty or Robina that owns the pigs, supplies feed, medicines and the market, and pays a grower a fee for raising them.' }],
    body: `## What it is

Corporate integrators place company-owned pigs with growers who supply land, buildings, utilities and labour. The company supplies stock, feed, medicines, veterinary service, hauling and the market, and pays a fee per head or a performance-based payment (BM-50). The DA roadmap names Monterey Foods (San Miguel Foods) as producing hogs through contract growing, and with SIDC and SOCOSPA as an example of integrated production, processing and marketing.

The only itemised hog terms the research found are a 2009 reproduction of Monterey's grower brochure on a grower's blog, which is secondary and dated. The grower provides 1 to 5 hectares of agricultural land at least 1 km from residential areas and other farms, pig houses, power and water, labour, security, equipment, permits (barangay, mayor, ECC, permit to operate) and maintenance; documents include DTI or SEC and BIR registration, a performance bond, a cash bond of ₱400 per animal (2009, secondary) and a real estate mortgage (BM-47). Module capacity is 400 to 5,000 head (BM-46). San Miguel Foods' current site, accessed 1 September 2026, lists only broiler contract growing, paid on harvest recovery, average live weight and feed conversion, with a minimum of 1 hectare; no hog page was found (BM-50). Pilmico, Robina Farms and Bounty could not be checked; current integrator hog terms are an open question. The accessible equivalent for a small raiser is the cooperative scheme in [paiwi](/guide/strategy-paiwi); see also [decision rules](/guide/decision-rules).

## Cash cycle

About 120 days per batch, 3 cycles per year (2009, secondary). Payment after harvest on the company's scheme; timing is not published.

## Costs and revenue

Grower: land, buildings, utilities, labour, security and permits including an ECC, which a piggery above 100 head needs (HO-109). Grower investment was ₱6,784 to ₱11,372 per head in the 2009 brochure (secondary) (BM-49). Company: stock, feed, medicines, veterinary service, hauling.

Revenue: income per head ₱654 (elevated 960-head module) to ₱900 (climate-controlled 1,000-head module), 3 cycles per year, in the 2009 brochure (secondary) (BM-48). That is roughly ₱1.9 to ₱2.7 million per year on an investment of ₱6.5 to ₱11.4 million (derived from the 2009 figures). The research says this is not usable for a backyard engine except as an upper-bound benchmark of what integrators paid per head.

## When it wins

Not applicable below several hundred head. It suits a raiser who scales to 400 or more finisher places with titled land, three-phase power and all-weather road access, and who prefers a fee without price or feed risk.

## When it loses

- Any 1 to 10 sow farm: it does not meet the minimum capacity (BM-46).
- Growers who want to sell independently or keep own pigs; contracts forbid it (BM-39).

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scale barrier (400 head minimum) and bonds (BM-46, BM-47) | Certain for 1 to 10 sows | Not accessible | Use cooperative paiwi instead |
| Capital lock-in, ECC and zoning (BM-49, HO-109) | High at that scale | Millions of pesos | Not applicable to a backyard raiser |

Other risks named by the research: performance penalties, the company setting stocking and harvest dates, bond forfeiture. See [local rules for small piggeries](/guide/local-rules-for-small-piggeries).

## Records needed

The company's own recording materials (placement, mortality, feed deliveries, medication, harvest weights), a permits file and the ECC.`,
  },
  {
    id: 'strategy-breeder-multiplier',
    section: 'strategies',
    title: 'Breeder or gilt multiplier',
    summary: 'Keep sows of known genetics and sell selected gilts at breeding age instead of fatteners. The highest price per head in the surveys, but it needs records buyers trust, tests before movement and 2 to 3 extra months of feed.',
    catalog: 7,
    prices: true,
    sources: ['BM-23', 'BM-24', 'BM-36', 'BM-51', 'BM-52', 'BM-53', 'BM-54', 'BM-55', 'BM-56', 'BM-57', 'BM-58', 'GN-56', 'PC-17', 'PC-18', 'PC-79', 'RT-42', 'HB-61', 'HB-63', 'HO-07'],
    body: `## What it is

Keep a small sow herd of known genetics and sell selected gilts, and junior boars, at breeding age rather than as fatteners. The Bulacan study calls it farrow-to-breeder (BM-23). Buyers are other backyard raisers (most independents buy sows from neighbouring backyard farms), LGU and DA repopulation programs (SIRP's breeder base development package, INSPIRE's breeder multiplier component) and cooperatives. BAI's Swine Breeder Farm Accreditation Program lists accredited breeder farms, and AI stations must source boars from them. See [gilt selection and first service](/guide/gilt-selection-and-first-service) and [decision rules](/guide/decision-rules).

## Cash cycle

A gilt is sold at breeding age, 7 to 8 months: Philippine guidance says 8 months and 120 to 130 kg, PIC says 200 to 225 days and 135 to 160 kg (BM-57). From birth that is 210 to 240 days, 60 to 90 days longer than a market hog. Up to 30 percent of gilts fail selection on growth, structure, teats or genitals and are sold as market hogs (BM-58).

## Costs and revenue

As grow to market plus gilt development feed: 193 kg of breeder ration from 5.5 to 8 months including flushing, ₱4,053 at 2022 prices (GN-56); the whole feed from birth to 8 months is 410.56 kg, ₱9,577 at 2022 prices (BM-56). Add tests required before movement for breeding (negative PRRS, pseudorabies and brucellosis tests, CSF vaccination, VHC), parvo and erysipelas vaccination before mating (HB-61, HB-63), identification, pedigree and performance records, and accreditation costs where sought. Pen occupancy is longer, at 1.0 m2 per gilt to mating (HO-07).

Price points:

| Stock | Price | Basis |
|---|---|---|
| F1 or parent-stock gilt | ₱15,000 to ₱30,000 per head | DA roadmap, 2022 (BM-51) |
| Purebred gilt | ₱40,000 to ₱150,000 per head | DA roadmap, 2022 (BM-51) |
| Hogs upgraded for breeding, farmgate | ₱222.62 (2019), ₱213.32 (2020), ₱195.81 (2021) per kg | PSA Household series; blank from 2022 (BM-52) |
| Premium over slaughter hogs per kg | 2.06 (2019), 1.90 (2020), 1.26 (2021) | Derived from the same series (BM-53) |
| Sow bought by smallholders | ₱8,439 per head | 2000-2001 survey (BM-54) |
| Imported purebred Large White gilt | about ₱150,000 per head landed | DA tender, May 2025, news (BM-55) |

Worked (derived, 2022 prices): feed ₱9,577 plus 11 percent for biologics, repairs and sundries (₱1,053), the sow-feed share (₱1,022) and about ₱800 for tests and vaccines (a placeholder, not sourced) gives about ₱12,450 per gilt sold, before the cost of the 30 percent culled to market weight. Sale at ₱15,000 to ₱30,000 leaves ₱2,550 to ₱17,550 per gilt, or ₱0 to ₱15,000 after charging the culls' shortfall; the same animal sold as a 90 kg finisher at ₱110 grossed ₱9,900 (2022 prices). Bulacan 2014: the three farrow-to-breeder-finisher farms had the highest selling price, ₱22,057 per head averaged over all animals, net ₱5,110 per head and 23 percent profit-to-sales (BM-23). Boar-for-hire in the same survey earned ₱700 per service with a net of ₱72, the lowest of all systems, because AI is displacing natural mating (BM-24); AI costs ₱200 or less at village centres and ₱1,000 to ₱1,500 privately (PC-17, PC-18).

## When it wins

- Buyers can verify the genetics. Contract growers paid 42 percent more per weaner for verified stock (BM-36).
- Repopulation programs, LGUs and cooperatives are buying (INSPIRE, SIRP).
- The breeding-stock premium is wide, as in 2019 to 2020 at about 2x (BM-53).
- You are in a green or light-green ASF zone, because breeding stock moves only with tests and permits (RT-42).
- Your sow cards and litter records prove performance.

## When it loses

- The premium narrows, as in 2021 at 1.26x (BM-53), or buyers dry up.
- Gilts held 2 to 3 extra months eat about ₱4,000 of breeder feed (2022 prices) and then sell as culls at market price.
- A disease case (PRRS, brucellosis) fails the movement tests.
- No accreditation and no records, so buyers pay neighbour prices (BM-54).

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Demand and premium collapse (2.06x in 2019 to 1.26x in 2021; no series since) (BM-53) | Medium | Gilt sold as a 130 kg cull at market price after ₱4,000 of extra feed (GN-56) | Pre-sell to programs, cooperatives and LGUs; keep records buyers trust; sell culls promptly |
| Disease status blocks movement (PRRS, AD, brucellosis tests, CSF vaccination) | Medium | Unsellable as breeders | Vaccination calendar, test before sale, VHC (HB-61, HB-63) |
| Selection failure | Certain in part: 30 percent culls (PC-79) | 30 percent sold as market hogs | Select from litters of 8 or more, 12 or more teats, sound legs |

See [vaccination calendar](/guide/vaccination-calendar) and [transport and shipping permits](/guide/transport-and-shipping-permits).

## Records needed

Individual identification; pedigree (sire and dam, AI batch); birth and weaning weights; teat count; growth to selection; vaccination and test certificates; the dam's litter records (born alive, weaned) to show buyers; a sales record per animal; a BAI accreditation file if pursued.`,
  },
  {
    id: 'strategy-native-or-organic',
    section: 'strategies',
    title: 'Native or organic pigs',
    summary: 'Raise native black pigs or organic-certified pigs for lechon and specialty buyers on by-product feed. A long cycle at low weight, and the premium is stated but not priced by any source.',
    catalog: 8,
    prices: true,
    sources: ['BM-61', 'BM-64', 'BM-65', 'BM-66', 'BM-67', 'GN-09', 'GN-12', 'GN-22', 'GN-31', 'GN-78', 'GN-79', 'PC-08', 'PC-41', 'PC-44', 'PC-51'],
    body: `## What it is

Raise Philippine native pigs (Q-Black, Benguet, ISUbela, Markaduke, Yookah, Sinirangan lines) or organic-certified pigs for the lechon and specialty markets. Native pigs are traditionally known as best for lechon and can be raised without chemical inputs. PCAARRD's industry page says consumers are willing to pay a premium for natural or organic products starting with native swine, but gives no figure (BM-67). The DA's SIRP includes a native and free-range package for 3 nucleus, 10 multiplier and 150 production farms. Organic swine has its own standard, PNS/BAFS 371:2023. See [alternative feeds](/guide/alternative-feeds) and [decision rules](/guide/decision-rules).

The biology drives the economics. Native litters are about 7 or fewer (PC-41), birth weight 0.8 kg (PC-44), weaning at 34 to 60 days at 3 to 5 kg (PC-51), sexual maturity at 5.79 months (PC-08), mature weight 30.4 kg (GN-12). Growth on rice bran and forage is 56 g per day, 78 g with golden apple snail silage (BM-64, GN-22). Feed conversion is 3.95 on commercial feed against 7.86 on 50 percent taro plus kitchen leftovers (GN-31). Roasting weight is 10 to 30 kg live (GN-09), and a carcass of about 40 kg takes 7 to 9 months (BM-65). Native lechon-size pigs weigh less, are older at slaughter and dress out lower than Landrace, Large White and F1 pigs, with heavier heads, stomachs and blood (BM-66).

## Cash cycle

Long. From weaning at 45 to 60 days to a 20 kg roaster at 56 to 78 g per day takes 190 to 300 days; to 30 to 40 kg live, 7 to 9 months or more (BM-64, BM-65). Commercial feed is faster but removes the low-input and organic rationale (GN-31).

## Costs and revenue

Cash feed cost is low when the pigs eat farm by-products and forage: growers get 0.3 to 1 kg per day of mixed rice bran, corn and copra plus forage, sows and boars 1 to 1.5 kg (GN-79). A boar is kept for natural service. Housing is simple. Organic certification and PNS 371 compliance costs, if pursued, are not sourced. The same VHC and slaughter rules apply as for any pig.

Revenue is per head to lechoneros or households by live weight class. No primary source quantifies the native or organic premium per kg or per head (BM-67); this is an open question.

Worked (derived, incomplete by necessity): a native grower eating 0.6 kg per day of a rice bran, corn and copra mix for 250 days consumes 150 kg (BM-64). At the roadmap's cheapest ration price of ₱21 per kg (breeder feed, 2022) that is ₱3,150; rice bran alone is cheaper but no dated rice bran price was sourced. If a 20 kg native roaster fetches the same per-head price as a 20 kg commercial roaster at ₱135 to ₱176 per kg (the Rule 2 break-even range at 2022 feed prices) (BM-61), it grosses ₱2,700 to ₱3,520, which barely covers 150 kg of purchased feed. The strategy works only with by-product feeding at near-zero cash cost or with a documented premium. The app computes native-pig margins only from your own feed cost and per-head price, and flags the long cycle.

## When it wins

- You have forage, rice bran, root crops and kitchen by-products at near-zero cash cost, and respect the swill rules: airport and seaport catering waste is banned, and the industry advises avoiding swill entirely (GN-78).
- A roaster or restaurant pays a per-head premium for native lechon; verify locally.
- You join a DA or PCAARRD native-pig program for breeder access.
- You are in an upland or coconut area where commercial feed is expensive.

## When it loses

- Fed commercial feed at commercial prices: a 30 kg native pig then costs about as much feed per kg as a commercial pig but sells at a fraction of the weight (GN-31).
- Buyers pay commercial per-kg prices with no premium.
- The long cycle ties up pens and exposes the herd to ASF for 8 to 12 months per animal.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| No premium realised (BM-67) | High: no sourced premium | A long cycle at low weight sells at the commercial per-kg price | Use your own entered price only; test the market with a few head; join PCAARRD or SIRP programs |
| Long cycle raises ASF exposure and feed cost if fed commercial feed (GN-22, GN-31) | Medium | 8 to 12 months per animal | By-product feeding, a small herd, biosecurity |

Other risks named: small litters, organic certification cost and market access, movement permits, roasters' seasonality. See [ASF in the Philippines](/guide/asf-in-the-philippines).

## Records needed

Breed or line and source (PCAARRD-registered lines); litter records; feed sources and quantities (organic standard traceability); a no-antibiotic treatment log; sales per head with buyer and size class; a certification file if pursued.`,
  },
  {
    id: 'strategy-value-add',
    section: 'strategies',
    title: 'Value-add: roasting, processing, retailing',
    summary: 'Capture the trader, roaster or retailer margin by slaughtering at an accredited abattoir and selling lechon, processed goods or pork cuts yourself. The margins are large on paper and the legal gates are strict.',
    catalog: 9,
    prices: true,
    sources: ['BM-68', 'BM-69', 'BM-70', 'BM-71', 'BM-72', 'BM-62', 'BM-63', 'BM-102', 'GN-09', 'GN-11', 'PM-13', 'PM-14', 'PM-15', 'PM-16', 'PM-17', 'PM-21', 'RT-64', 'RT-65', 'RT-68'],
    terms: [
      { term: 'Hot meat', meaning: 'Meat from an animal not slaughtered at an accredited or LGU-registered slaughterhouse with ante- and post-mortem inspection. Selling, transporting or distributing it is a crime.' },
      { term: 'Sabit-ulo', tagalog: 'sabit-ulo', meaning: 'The carcass price basis used by viajeros, ₱130 to ₱200 per kg in the DA roadmap (2022).' },
    ],
    body: `## What it is

Capture the margin of the trader, roaster or retailer by slaughtering your own pigs at an accredited facility and roasting, processing (longganisa, tocino, chicharon) or retailing the cuts. The DA roadmap shows why: retailing earned ₱1,440 to ₱4,440 per head against ₱1,515.78 for farrow-to-finish, and viajero trading earned -₱1,540 to +₱3,500 depending on marketing costs and a carcass (sabit-ulo) price of ₱130 to ₱200 per kg (2022 prices) (BM-69). SINAG's chain of March 2025: ₱230 farmgate plus a ₱70 trader margin gives ₱300 per kg carcass, plus a ₱50 retailer margin gives ₱350 for kasim or pigue (BM-68). The roadmap says direct selling of pork cuts by small farmers will be encouraged, but only with NMIS approval. See [slaughter and meat inspection](/guide/slaughter-and-meat-inspection) and [decision rules](/guide/decision-rules).

### Legal gates

1. Any pork sold must come from an animal slaughtered at an accredited or LGU-registered slaughterhouse after ante- and post-mortem inspection. Selling hot meat carries 6 to 12 years and ₱100,000 to ₱1,000,000 (BM-72, RT-68).
2. A meat processing plant or meat outlet is a meat establishment under RA 9296 and must be registered with NMIS.
3. Manufacturing or distributing processed food without an FDA License to Operate is prohibited by RA 9711: 5 to 10 years and ₱500,000 to ₱5,000,000 plus ₱1,000 per day, with no exemption for small or home producers (BM-71).
4. Mayor's and sanitary permits from the LGU.
5. Tax: processed products lose the VAT exemption that live hogs and fresh, roasted or smoked pork keep. A BMBE registration (assets up to ₱3,000,000 excluding land) covers agro-processing and exempts operating income from income tax (RT-64, RT-65). See [tax in plain language](/guide/tax-in-plain-language).

## Cash cycle

Roasting: order to cash in days, on top of the pig's own cycle. Processing: days to weeks for curing and freezing, plus receivables if selling to stores. Retail cuts: same day at the wet market.

## Costs and revenue

Costs: the live pig at own cost, slaughter and inspection fees (LGU schedules vary; not researched), transport, charcoal or LPG, labour, spices and packaging, cold storage, permits (mayor's, sanitary, NMIS registration, FDA LTO) and stall rental. None of the roasting or processing unit costs were found in a primary source; that is an open question.

Revenue units: roasted lechon per head by cooked-weight band or ₱800 to ₱1,600 per kg roasted (PM-21); retail cuts per kg (NCR liempo ₱379.80, kasim ₱326.56, pigue ₱325.07 on 31 August 2026; provincial ₱280 to ₱340) (PM-13, PM-14, PM-15, PM-17); processed goods per kg or per pack, not sourced.

Worked, where possible (derived). Lechon de leche: a 6 to 10 kg live pig (3 to 5 kg cooked) (GN-09, GN-11) retailed at ₱8,000 on a Cebu chain list of 17 December 2025 (BM-62), against a live value of ₱1,036 to ₱1,726 at ₱172.62 per kg (PSA, June 2026) (BM-102), leaves ₱6,300 to ₱7,000 per head before slaughter fee, fuel, labour, permits, delivery and the seller's own margin, none of which are sourced; the December price is also the peak, up 29 to 33 percent at La Loma in 2024 (BM-63). Retail cuts: a 90 kg hog at 78 percent carcass recovery yields 70 kg of carcass (BM-70); on the March 2025 chain the trader and retailer margins together are about ₱9,800 per hog before slaughter fees, stall rent, labour, shrink and unsold cuts (BM-68). The roadmap's own retail net of ₱1,440 to ₱4,440 per head (2022 prices) is the sourced order of magnitude after those costs (BM-69). Processing: no margin source.

## When it wins

- You already sell to households and fiestas and can secure a roaster's permits and an accredited slaughter slot.
- A family member runs a wet-market stall or carinderia.
- Volume is enough to justify the permits, including an FDA LTO for processing.

## When it loses

- Selling roasted or processed pork from home slaughter (hot meat) or unlicensed processing.
- No cold chain; pork spoils faster than other meats.
- Small volumes cannot absorb permit and stall costs.
- Competition from imported pork at ₱239 to ₱304 per kg retail (PM-16).

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Hot meat: home slaughter for sale | High if done without an accredited abattoir | 6 to 12 years and ₱100,000 to ₱1,000,000 (BM-72) | Slaughter at an LGU or NMIS-accredited abattoir; keep the meat inspection certificate |
| Processing without an FDA LTO | High for informal processors | 5 to 10 years and ₱500,000 to ₱5,000,000 (BM-71) | FDA LTO, NMIS registration, BMBE (RT-64); or stay with live sales |
| Spoilage and unsold cuts (no cold chain) | Medium | Shrink and write-offs | Sell whole roasted per order; a freezer; pre-orders |

Other risks named: food safety, working capital in receivables, the change of tax status for processed goods, seasonality of lechon orders.

## Records needed

Slaughter and meat inspection certificates per animal; purchase-to-product traceability (batch numbers); FDA and NMIS registrations; sales invoices; inventory of cuts and processed stock; stall and permit fees; the BMBE certificate.`,
  },
  {
    id: 'strategy-timing',
    section: 'strategies',
    title: 'Timing sales and cull sows',
    summary: 'Choose service dates so batches reach sale weight in the March to June price high, sell inside 80 to 100 kg, and cull sows on the sow card. Worth about ₱1,550 per head between the best and worst months at 2026 prices.',
    catalog: 10,
    prices: true,
    sources: ['BM-73', 'BM-74', 'BM-75', 'BM-76', 'BM-77', 'BM-78', 'BM-79', 'BM-80', 'BM-81', 'BM-102', 'GN-29', 'GN-33', 'GN-41', 'GN-53', 'PC-04', 'PC-17', 'PC-22', 'PC-24', 'PC-63', 'PC-72', 'PC-75', 'PC-78', 'PM-03', 'PM-08', 'PM-20', 'PM-45', 'PM-46', 'RK-17'],
    body: `## What it is

Choose service dates so batches reach sale weight in high-price months, sell market hogs inside the 80 to 100 kg window, and choose when to cull sows. What the PSA Household farmgate series for 2019 to 2025 supports (BM-73, BM-74, BM-75):

| Months | Seasonal index |
|---|---|
| March to June | 1.02 to 1.05 (Establishment series March 1.083) |
| October to November | 0.95 to 0.98 (Establishment series October 0.924) |
| December | 0.99 to 1.02; an uplift in only 3 of 7 years |

The 2025 peak was June at ₱212.12 per kg and the trough November at ₱176.13 (PM-03). Fiesta, Holy Week and graduation effects are not quantified by any primary source; the March to June high is consistent with them. See [price seasonality](/guide/price-seasonality) and [where to find prices](/guide/where-to-find-prices). Rule 6 in [decision rules](/guide/decision-rules) is the arithmetic below.

## Cash cycle

Back-scheduling (derived): a market hog needs 140 to 168 days from birth to 90 kg (GN-33) after 115 days of gestation (PC-24), so serve 255 to 283 days, about 8.5 to 9.5 months, before the target sale date (BM-77). For a June sale, farrow in January and serve in September to October of the previous year. For weaner sales at 45 to 60 days of age, serve 160 to 175 days, about 5.5 months, before the sale date (BM-78).

## Costs and revenue

Value of timing on a 90 kg hog at the June 2026 national price of ₱172.62 per kg (BM-102): +5 percent is +₱777 per head and -5 percent is -₱777, a swing of about ₱1,550 per head between the best and worst months, before any change in feed cost or mortality (BM-76). Selling outside the 80 to 100 kg window costs ₱5 per kg, or ₱350 to ₱500 per head (BM-79). Holding a finished pig one extra week costs about 2.4 to 2.8 kg of feed per day, 17 to 20 kg or ₱400 to ₱480 at 2022 finisher prices, for about 4 to 6 kg of gain, and feed conversion worsens above 3:1 in late finishing (GN-41, GN-29).

### Cull-sow timing

Sows are removed at a mean parity of about 4, with annual culling of 42 percent and deaths of 14 percent, so a 5-sow herd replaces about 3 sows a year (BM-81, PC-72, PC-75). Reasons are old age 35 percent, reproductive disorders 29 percent, low performance 13 percent and lameness 13 percent (PC-78). Budgets treat cull-sow income as salvage value inside breeding-herd depreciation, not as revenue, and no Philippine cull-sow price series exists (BM-80). A sow's weight, 135 to 160 kg at first service and heavier later (PC-04), falls outside the trader window (PM-20). The defensible rule: cull on the sow card (return-to-heat failures, low weaned, lameness) and sell the cull in a March to June month, after the last litter is weaned and the sow has been fed 5 to 7 days to recover condition (GN-53). See [sow culling and replacement](/guide/sow-culling-and-replacement).

## When it wins

- Batches can be planned: AI is available on demand (PC-17) and sows cycle predictably 3 to 7 days after weaning (PC-63).
- You have enough sows to stagger.
- You check price data monthly (PSA OpenSTAT, DA Bantay Presyo).

## When it loses

- Biology slips the schedule: repeat services 5 to 6 percent (PC-22), farrowing rate 75 to 84 percent (RK-17).
- An ASF event or import surge overrides seasonality; in 2025 the September to November fall triggered the ₱210 floor price (PM-08).
- The pig overshoots 100 kg while waiting (PM-20).

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Biology slips the schedule; a policy or import shock overrides the season (PC-22, PM-46) | Medium | A 5 to 8 percent price swing missed; holding cost | AI on demand, stagger sows, hold no pig past 100 kg (PM-20), a monthly price log |

Other risks named: forecast error, disease during the hold, price policy shocks such as an MSRP, a floor price or an import quota expansion (PM-45, PM-46).

## Records needed

A service and expected-farrowing calendar per sow; an expected sale date per batch; a monthly local price log (buyer quote, PSA regional figure); a weight log; culling flags on the sow card.`,
  },
  {
    id: 'strategy-mixed-litter',
    section: 'strategies',
    title: 'The mixed litter',
    summary: 'Sell part of the litter as weaners to pay for the feed of the rest. The most common smallholder configuration; a cash-flow device rather than a margin device.',
    catalog: 11,
    prices: true,
    sources: ['BM-01', 'BM-08', 'BM-35', 'BM-82', 'BM-102', 'GN-33', 'PM-27', 'HB-44', 'HO-02', 'HO-06'],
    body: `## What it is

Keep sows, sell some of each litter as weaners and fatten the rest. The Southern Luzon survey found this the most common configuration among independent smallholders in 2000-2001, at 36 percent (BM-35). It converts the weaner premium into working capital for the grow-out and keeps pen occupancy within a small building. The Plan page shows the cash-neutral split (Rule 3) whenever you price a weaner batch; see [decision rules](/guide/decision-rules) and [projection assumptions](/guide/projection-assumptions).

## Cash cycle

Weaner sales at 30 to 60 days bring cash in early. The retained pigs sell at 140 to 168 days of age (GN-33). Feed for the retained pigs is bought week by week from the weaner proceeds.

## Costs and revenue

Costs are those of [sell weaners](/guide/strategy-sell-weaners) and [grow to market weight](/guide/strategy-grow-to-market) in proportion. The cash need is the grow-out feed for each retained pig: ₱5,162 at 2022 prices, ₱7,544 at July 2026 dealer prices (secondary) and ₱10,206 at September 2026 online prices (BM-08). Revenue is per head for the weaners and per kg liveweight for the finishers.

Decision rule (derived). With n piglets weaned, selling k weaners at price P_w pays for the grow-out feed F_g of the remaining n - k pigs when k x P_w is at least (n - k) x F_g, that is k is at least n x F_g / (P_w + F_g):

| Weaned | Grow-out feed per pig | Weaner price | Sell | Grow |
|---|---|---|---|---|
| 8 | ₱5,162 (2022) | ₱2,500 | 6 | 2 |
| 8 | ₱7,544 (2026 dealer) | ₱3,500 | 6 | 2 |
| 10 | ₱5,162 (2022) | ₱3,500 | 6 | 4 |

Because the grow-out feed is about 1.5 to 3 times the weaner price in every priced case, the self-financing mix is roughly two to three weaners sold per pig grown (BM-82). Growing fewer pigs than that needs outside cash. Growing more is a choice to invest the weaner proceeds, and pays only when the weaner price is below the break-even weaner price of Rule 1.

Worked (derived), litter of 8 weaned, sell 6 and grow 2. At 2022 prices: weaner revenue ₱15,000; litter cost to weaning about ₱20,150 with family labour; grow-out of 2 pigs ₱12,450; finisher revenue ₱18,909 at 90 kg and ₱110 per kg after 4.5 percent mortality; litter net ₱1,309, or ₱4,309 before family labour. At 2026 prices (₱172.62 per kg, PSA June 2026; weaner ₱2,586; dealer feed ₱36.55 per kg, secondary) (BM-102, BM-01): weaner revenue ₱15,516; litter cost to weaning about ₱26,913; grow-out ₱17,738; finisher revenue ₱29,673; net ₱538. The mixed litter is a cash-flow device, not a margin device: it keeps you solvent through the grow-out at the cost of the finisher margin on the pigs sold early.

## When it wins

- Cash and pen space are limited: a finisher needs 0.85 m2 against 0.2 m2 for a weaner (HO-06, HO-02).
- Weaner buyers are available at weaning.
- You keep the best growers: sell the smallest, keep the largest, which also makes the most of the two-tier per-kg weaner price (PM-27).
- The finisher sale can be timed to March to June.

## When it loses

- The weaner price collapses, so the number to sell rises toward the whole litter.
- The retained pigs pick up disease from visiting buyers. Buyers should not enter pens, and visitors who had pig contact need 48 hours of downtime (HB-44).
- Feed is bought in repacked kilos at higher prices because cash arrives in dribs.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Weaner price collapse pushes the number to sell toward the whole litter; biosecurity exposure from frequent buyers (HB-44) | Medium | Grow-out underfunded; disease entry | Recompute the split each litter (Rule 3); buyers stay outside the pens; the 48-hour visitor rule |

The risks of sell weaners and grow to market apply too. See [biosecurity checklist](/guide/biosecurity-checklist).

## Records needed

Per-piglet identification so the sold and retained pigs are tracked separately; a per-litter cash ledger (weaner receipts against feed purchases); a batch closeout for the retained group.`,
  },
  {
    id: 'farrow-to-finish-or-not',
    section: 'strategies',
    title: 'Farrow-to-finish or not',
    summary: 'The three pure systems, farrow-to-wean, farrow-to-finish and wean-to-finish, trade capital and cycle length against margin and price exposure. What the surveys say about which to run.',
    prices: true,
    sources: ['BM-16', 'BM-19', 'BM-20', 'BM-22', 'BM-31', 'BM-32', 'BM-33', 'BM-34', 'BM-35'],
    terms: [
      { term: 'Farrow-to-wean', meaning: 'Keep sows and sell the piglets as weaners.' },
      { term: 'Farrow-to-finish', meaning: 'Keep sows and grow the whole litter to market weight.' },
      { term: 'Wean-to-finish', meaning: 'Buy weaners and fatten them to market weight, with no sows.' },
    ],
    body: `## The three systems

The Southern Luzon survey of 2000-2001 sorted smallholder pig activities into five types: farrow-to-wean (Type 1), farrow-to-finish (Type 2), grow-to-finish with bought weaners (Type 3), farrow-to-wean plus finishing part of the litter (Type 4), and grow-to-finish combined with a sow herd (Type 5). Among independent smallholders 22 percent were Type 1, 36 percent Type 4 and 20 percent Type 5; full-cycle and pure fattening specialists were rare, while 56 percent of cooperative contract growers were pure fatteners (BM-35).

The three pure systems trade capital and cycle length against margin and price exposure.

| System | Cost and capital | Cycle | Margin and exposure |
|---|---|---|---|
| Farrow-to-wean ([sell weaners](/guide/strategy-sell-weaners)) | Least total and cash cost; 27.5 percent of cost is unpaid family labour (BM-31) | Shortest of the sow systems | Small per-head margin, hostage to litter size and the piglet price (BM-16) |
| Farrow-to-finish ([grow to market weight](/guide/strategy-grow-to-market)) | Highest total cost, capital and labour; feed 71.6 percent of cost (BM-32) | Longest commitment: breeding stock, 4 to 10 months to first farrowing plus 6 months to market | Highest net per pig in the roadmap budget and in Santa Maria (BM-19, BM-20) |
| Wean-to-finish ([grow-out only](/guide/strategy-grow-out-only)) | Minimum overhead, no breeding stock, but the most cash-demanding per cycle: weaners 36.7 percent and feed 50.3 percent of cost, 88.5 percent cash (BM-33) | Shortest, 4 to 5 months | Most sensitive to the weaner price and the liveweight price at sale (BM-22) |

## What the surveys add

Independents with at least two sows could match larger producers' profit efficiency, but the smallest producers were profit-inefficient and the 2000-2001 study expected their gradual exit (BM-34). Costing family labour matters: independents earned ₱17.5 per kg of output before family labour and ₱10.0 after it, and the lowest quintile only ₱0.7 after it, in 2000-2001 pesos (BM-34).

The Bulacan 2014 study adds that scale (number of hogs) and feed quality drive profitability within a system, while the type and price of animals sold, feed and the capital for weaners drive it across systems (BM-20, BM-22).

## How to choose

- Little cash and pens for sows only: farrow-to-wean, or [the mixed litter](/guide/strategy-mixed-litter), which is what most smallholders actually ran.
- Cash for 4 to 5 months of feed per pig and a liveweight price above your cost per kg: farrow-to-finish.
- No sows and a verified weaner source: wean-to-finish, bought only when the weaner price is below the break-even weaner price.

The [decision rules](/guide/decision-rules) put numbers on each choice, and [capital and payback](/guide/capital-and-payback) shows what each system needs up front.`,
  },
  {
    id: 'decision-rules',
    section: 'strategies',
    title: 'The seven decision rules',
    summary: 'Sell weaners or grow out, hold to lechon or not, how many weaners to sell, whether a litter pays, how to judge a paiwi offer, when to serve for a target month, and how payback is defined. Every input is editable on the Plan page.',
    prices: true,
    sources: ['BM-01', 'BM-02', 'BM-03', 'BM-05', 'BM-06', 'BM-07', 'BM-08', 'BM-09', 'BM-10', 'BM-11', 'BM-13', 'BM-14', 'BM-15', 'BM-18', 'BM-37', 'BM-38', 'BM-60', 'BM-61', 'BM-73', 'BM-74', 'BM-75', 'BM-79', 'BM-82', 'BM-83', 'BM-84', 'BM-85', 'BM-86', 'BM-87', 'BM-88', 'BM-97', 'BM-98', 'BM-102', 'GN-33', 'GN-34', 'PC-24', 'PC-39', 'PC-54', 'PC-58', 'PM-07', 'RK-34', 'RK-36', 'RK-38', 'RK-61'],
    body: `## How the rules are used

All seven rules are derived by the research from sourced inputs. The Recommend tab applies Rules 1, 2, 3 and 6 with every input shown as an editable field pre-filled with the default, and the farm scenario runs the arithmetic of Rule 4 month by month for a sow herd that sells weaners; see [projection assumptions](/guide/projection-assumptions). Rules 5 and 7 are explained here for you to apply by hand. Never treat a default as a current local quote: enter your own weaner price, liveweight quote and feed bag price.

## The variables

| Symbol | Meaning | Default and basis |
|---|---|---|
| P_w | Local weaner price, per head | ₱2,500 (DA roadmap, 2022); observed ₱2,586 (Cotabato, published April 2026); roadmap text ₱3,000 to ₱4,000 (BM-01) |
| P_lw | Expected liveweight price at the sale date, per kg | Latest PSA Household farmgate ₱172.62 (June 2026) (BM-102) times the seasonal index of the sale month (BM-73, BM-74, BM-75); override with the local trader quote, ₱105 to ₱150 in surplus regions in 2026 (PM-07) |
| W_m | Market weight, kg | 90; keep within 80 to 100 (BM-79) |
| W_w | Weaner weight, kg | 12 (roadmap schedule at 2 months; trade 10 to 15) (BM-02) |
| FCR_g | Feed per kg of gain from W_w to W_m | 2.65 (roadmap, derived); national 3.19 and small farms 3.3 as the poor setting (BM-09) |
| P_f | Weighted feed price over the grow-out, per kg | ₱25.0 (roadmap, 2022 Batangas) (BM-05); ₱36.55 (dealer, 12 July 2026, secondary) (BM-06); ₱49.45 (online listings, September 2026, includes delivery) (BM-07) |
| F_g | Grow-out feed cost per pig = FCR_g x (W_m - W_w) x P_f | ₱5,162; ₱7,544; ₱10,206 at the three feed prices (BM-08) |
| m | Mortality from weaner to sale, fraction | 0.045 wean-to-finish average (RK-36); 0.0918 Philippine growing herd (RK-38); 0.07 as the poor setting |
| C_o | Other cash costs per pig grown = 0.11 x F_g + 487.5 | ₱1,055 at 2022 prices (biologics 3, repairs 3, sundries 5 percent of feed, plus wages ₱87.50 and water and electricity ₱400) (BM-10) |
| d | Weight-window factor | 1.0 inside 80 to 100 kg, otherwise subtract ₱5 per kg from P_lw (BM-79) |
| t | Days from W_w to W_m | 120 to 150 (GN-34) |
| n | Piglets weaned per litter | 8.47 Philippine commercial (PC-54); 7.1 smallholder (PC-39, PC-58); 10 roadmap budget |
| F_s | Sow feed cost per litter including lost days | ₱10,356 at 2022 prices (BM-11) |
| F_p | Piglet feed to 2 months, per piglet | ₱361 at 2022 prices (BM-03) |
| A | Breeding cost per litter | 2 services at ₱200 (village AI) to ₱1,250 (private AI); ₱1,450 at the midpoint (BM-13) |

## Rule 1: sell weaners now or grow out

The break-even weaner price is what a weaner is worth to you if you grow it: the expected sale value after mortality, less the grow-out feed and other costs.

P_w* = (1 - m) x P_lw x d x W_m - F_g - C_o

Grow out if your local weaner price P_w is below P_w*; sell if it is at or above it. Margin from growing per pig = P_w* - P_w. Cash required per pig grown = F_g + C_o over t days. If feed is bought on credit, add a financing charge of r x (F_g + C_o) x t / 365; LIMCOMA gives members 30 days of feed credit (BM-98) and ACPC ANYO lends at 2 percent per year plus a service fee of up to 3.5 percent (BM-97).

Worked defaults (W_m 90, W_w 12, FCR_g 2.65, d 1, m 0.0918):

| Case | P_lw | Feed | P_w* | Against P_w | Decision |
|---|---|---|---|---|---|
| 2022 roadmap | ₱110 | ₱25.0 | ₱2,774 (BM-83) | ₱2,500 | Grow; margin ₱274 per pig after mortality |
| 2026 national price, dealer feed | ₱172.62 | ₱36.55 | ₱5,249 (BM-84) | ₱2,586 | Grow; margin ₱2,663 |
| 2026 national price, online feed | ₱172.62 | ₱49.45 | ₱2,294 (BM-85) | ₱2,586 | Sell |
| 2026 surplus-region quote, dealer feed | ₱120 | ₱36.55 | ₱948 (BM-86) | ₱2,586 | Sell |

Sensitivity: each ₱1 per kg on the feed price moves P_w* by about ₱230 (BM-87); each ₱10 per kg on the liveweight price moves it by about ₱817 (BM-88); each percentage point of mortality moves it by about ₱155 at ₱172.62 per kg. See [strategy: sell weaners](/guide/strategy-sell-weaners) and [strategy: grow to market weight](/guide/strategy-grow-to-market).

## Rule 2: sell the weaner or hold to lechon size

The break-even lechon live price is the weaner's value plus the holding cost, divided by the live weight you expect after nursery losses.

P_L* = (P_w + F_L + C_L) / ((1 - m_n) x W_L)

F_L is the feed from W_w to the lechon weight W_L, about 25 kg of pre-starter and starter from 10 to 25 kg, ₱738 at 2022 prices (BM-60); C_L = 0.11 x F_L; m_n is nursery mortality, 0.02 (RK-34). Hold only if the roaster's per-head offer divided by W_L exceeds P_L*. The defaults give ₱135 to ₱184 per kg live for a 25 kg pig (BM-61). No source gives the lechonero's live price, so the app asks for the offer. See [strategy: grow to roaster size](/guide/strategy-grow-to-roaster).

## Rule 3: the cash-neutral mixed litter

k* = ceiling(n x F_g / (P_w + F_g)) weaners sold, and n - k* grown. With F_g between 1.5 and 3 times P_w, k* is about two thirds of the litter: 6 of 8 in every priced case (BM-82). See [the mixed litter](/guide/strategy-mixed-litter).

## Rule 4: does a farrow-to-wean litter pay

Net per litter = n x P_w - (F_s + n x F_p) x 1.11 - A - U - L, where U is utilities per litter (₱1,000, half of a 10-pig cycle's ₱1,950) (BM-14) and L is family labour (₱3,000 per cycle) (BM-15). At P_w ₱2,500 and 2022 prices with labour costed, the litter breaks even at 8.1 weaned (BM-18). At n = 7 the break-even P_w is ₱2,822 with labour or ₱2,393 cash only; in the app, family labour is a parameter you can set to zero to see the cash-only case.

## Rule 5: judging a paiwi offer (apply by hand)

Grower's cash return per head = s x (P_lw x W_m x (1 - m) - stock - feed - vet) - (utilities + labour + repairs), with s = 0.50 under the cooperative split (BM-37). Add 0.50 x feed as patronage-refund credit where the cooperative distributes one (BM-38). Compare with Rule 1's margin from growing out with own capital: the paiwi grower gives up half the margin in exchange for zero stock and feed capital and shared natural-mortality risk. See [paiwi](/guide/strategy-paiwi).

## Rule 6: timing

Expected P_lw for a sale in month M = the trailing 12-month average x the seasonal index of M (BM-73, BM-74, BM-75). Service date = sale date - (115 + days to W_m) (PC-24, GN-33). Do not hold past 100 kg (BM-79). See [timing sales and cull sows](/guide/strategy-timing).

## Rule 7: capital turnover and payback (apply by hand)

Simple payback in years = initial capital / average annual net cash return. The research uses this definition because neither the DA budget template nor PIDS defines payback; PIDS reports IRR and NPV at 10 percent instead (RK-61). Asset turnover = gross returns per pig / investment. Report payback as not reached when the annual net is zero or negative. See [capital and payback](/guide/capital-and-payback).`,
  },
  {
    id: 'capital-and-payback',
    section: 'strategies',
    title: 'Capital and payback',
    summary: 'What a 1 to 10 sow farm needs up front, in housing, breeding stock and working capital, and how many years the budgets take to pay it back. Working capital, not housing, is the largest item.',
    prices: true,
    sources: ['BM-11', 'BM-13', 'BM-28', 'BM-29', 'BM-48', 'BM-49', 'BM-51', 'BM-56', 'BM-89', 'BM-90', 'BM-91', 'BM-92', 'BM-93', 'BM-94', 'BM-95', 'BM-96', 'BM-97', 'BM-98', 'BM-102', 'HO-02', 'HO-06', 'HO-08', 'HO-12', 'HO-13', 'HO-84', 'HO-109', 'PC-17', 'PC-18', 'PC-80', 'RT-03', 'RT-05', 'RT-31', 'RT-32', 'RK-61'],
    body: `## How the estimate is built

No Philippine primary source gives a current pen construction cost per square metre. The research builds the area from the PAES 401 minimum pen sizes and prices it at the one Philippine anchor found: PIDS's ₱68,000 building for a 40-head fattening operation (2018 prices) (HO-84), which is about ₱2,000 per m2 at 0.85 m2 per place (BM-90). Breeding stock uses the DA roadmap's F1 or parent-stock gilt price of ₱15,000 to ₱30,000, midpoint ₱22,500 (2022) (BM-51). Working capital is the feed and services paid before the first sale, at 2022 roadmap prices. Operating cost and revenue are for a farrow-to-finish farm selling 14 pigs per sow per year, the small-farm benchmark of 13 to 14 (BM-96), at 90 kg and ₱110 per kg (2022). Every line is derived; the table is a template, not a quotation. Bulacan raisers reported start-up capital under ₱50,000 (73 percent in San Jose del Monte) or ₱50,000 to ₱100,000 (43 percent in Santa Maria) in 2014, using cheap housing and household utilities (BM-95), so the PAES-compliant estimate is an upper band for housing. See [construction and equipment costs](/guide/construction-and-equipment-costs) and [pen space by stage](/guide/pen-space-by-stage).

## Per-sow building blocks (derived)

- Housing: 1.2 m2 of gestation space (HO-08), 0.36 m2 of nursery (HO-02), 6.1 m2 of fattening (HO-06) and 0.27 farrowing pens of 7.4 m2 each (HO-13), rounded up to whole pens, plus 25 percent for walkways and the feed store (BM-89).
- Boar: not kept below 10 sows; natural service runs 1 boar to 18 to 25 sows (PC-80), and AI costs ₱200 to ₱1,250 per service (PC-17, PC-18). A 10-sow farm may add a 7.5 m2 boar pen (HO-12); no boar price was sourced.
- Working capital to the first finisher sale: sow feed per cycle ₱10,356 (BM-11), piglet feed for 7 at ₱361 and grow-out feed for 7 at ₱5,162, total ₱49,017 per sow; farrow-to-wean only ₱12,883 (2022 prices) (BM-91).
- Annual operating cost per sow, 14 sold: about ₱118,650 at 2022 prices, against revenue of ₱138,600 and a net of ₱19,950 per sow-year (BM-92).
- The same sow-year re-priced at ₱172.62 per kg (PSA, June 2026) (BM-102): revenue ₱217,501; net ₱48,797 with dealer feed (secondary, July 2026) or -₱7,788 with online feed (September 2026) (BM-93).

## The table

| Farm | Total capital | Annual operating cost (2022) | Annual revenue (2022) | Annual net and simple payback |
|---|---|---|---|---|
| 1 sow, farrow-to-finish, AI: housing 19 m2 ₱38,000; gilt ₱22,500; working capital ₱49,017; AI ₱1,450 (BM-13); permits ₱2,000 (RT-32) | about ₱113,000 | ₱118,650 | ₱138,600 | ₱19,950; 5.7 years (2022); 2.3 years in the 2026 dealer-feed case; not reached at online feed prices |
| 1 sow, farrow-to-wean, AI: housing 11.3 m2 ₱22,500; gilt ₱22,500; working capital ₱12,883; AI ₱1,450; permits ₱2,000 | about ₱61,000 | ₱39,504 (7 weaned per litter, labour included) | ₱35,000 at ₱2,500 (₱49,000 at ₱3,500) | -₱4,504 at ₱2,500 (not reached); ₱9,496 at ₱3,500 (6.4 years); ₱8,088 at 10 weaned and ₱2,500 (7.5 years) |
| 3 sows, farrow-to-finish, AI | about ₱297,000 | ₱355,950 | ₱415,800 | ₱59,850; 5.0 years (2022); ₱146,391 and 2.0 years in the 2026 dealer-feed case |
| 5 sows, farrow-to-finish, AI | about ₱499,000 | ₱593,250 | ₱693,000 | ₱99,750; 5.0 years (2022); ₱243,985 and 2.0 years (2026 dealer feed); stays under the 100-head CNC threshold (HO-109) |
| 10 sows, farrow-to-finish, AI, boar pen optional | about ₱980,000 | ₱1,186,500 | ₱1,386,000 | ₱199,500; 4.9 years (2022); ₱487,970 and 2.0 years (2026 dealer feed) |
| 40-head grow-out, 2 cycles (PIDS model, 2018 prices) | ₱148,000 investment plus working capital | ₱373,612 (including land rent ₱116,000) | ₱424,800 | ₱51,188; IRR 2 percent; simple payback 2.9 years on the building and vehicle (BM-29) |
| 10-head grow-out per cycle (Mlang, Cotabato, published 2026) | working capital about ₱91,000 per cycle; no building cost given | ₱90,907 per cycle | ₱127,809 per cycle | ₱36,902 per cycle; ROI 40.59 percent (BM-28) |
| Integrator contract farm (Monterey, 2009 brochure, secondary) | ₱6.5 to ₱11.4 million on 960 to 1,000 head (BM-49) | company bears stock, feed, medicine | ₱654 to ₱900 per head, 3 cycles per year (BM-48) | about ₱1.9 to ₱2.7 million per year (derived) |

A 10-sow herd with young on hand passes the PSA head-count line for backyard farms (10 or more adults with 22 or more young is commercial) and the AO 7 semi-commercial boundary, and a herd above 100 head needs an ECC (RT-03, RT-05, HO-109). Before expanding, check the local piggery ordinance: LGU tier limits, setbacks of 15 to 500 m and fines apply, and vary by municipality (RT-31). See [farm classification](/guide/farm-classification) and [local rules for small piggeries](/guide/local-rules-for-small-piggeries).

## Payback, defined

Simple payback in years = initial capital / average annual net cash return. Neither the DA budget template nor PIDS defines payback; PIDS reports IRR and NPV at 10 percent instead (RK-61). Payback is reported as not reached when the annual net is zero or negative. This is Rule 7 in [decision rules](/guide/decision-rules); the Plan page's scenario view shows a related figure, the first month the running total returns to zero or above.

## Reading the table

At 2022 prices a PAES-compliant farrow-to-finish farm pays back in about 5 years at any size in the range, because the estimate scales with sows and the roadmap margin per pig is fixed (BM-94). The 2026 result swings from 2 years to never depending on the feed price actually paid, which is why the app takes your local bag price as an input. Working capital, not housing, is the largest item, about 43 percent of the total for farrow-to-finish. That is the quantitative reason the smallest raisers sell weaners or mix the litter, and why credit at 2 percent (ANYO, up to ₱300,000) (BM-97) or a cooperative feed line (BM-98) changes the choice. Replacing purchased gilts with home-raised ones, at about ₱9,577 of feed to 8 months (2022 prices) (BM-56), cuts the breeding-stock line by more than half after the first year.`,
  },
]

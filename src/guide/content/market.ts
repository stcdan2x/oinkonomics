import type { GuideArticle } from '../types'

// Selling and prices (research/philippine-market.md, rows PM-01 to PM-48).
// Every article here quotes pesos, so every one sets prices: true.

export const MARKET: GuideArticle[] = [
  {
    id: 'sale-channels-and-buyers',
    section: 'market',
    title: 'Sale channels and buyers',
    summary: 'Who buys live pigs from a backyard raiser, how each buyer prices and pays, and the pros and cons of each channel.',
    prices: true,
    sources: ['PM-07', 'PM-10', 'PM-11', 'PM-12', 'PM-19', 'PM-20', 'PM-21', 'PM-22', 'PM-26', 'PM-27', 'PM-28', 'PM-29', 'PM-48'],
    terms: [
      { term: 'Long-distance hog trader', tagalog: 'viajero, biyahero', meaning: 'A trader who collects live pigs from farms and ships them to Metro Manila live markets or to city slaughterhouses. The main outlet for a smallholder selling beyond the neighbourhood.' },
      { term: 'Roaster', tagalog: 'lechonero', meaning: 'A business that buys live pigs in specific size classes and sells whole roasted pigs per head.' },
      { term: 'Contract growing', tagalog: 'paiwi', meaning: 'A scheme where a cooperative or integrator supplies the piglets, feed and veterinary inputs, the raiser supplies labour, housing and utilities, the cooperative markets the finished hogs and the profit is shared.' },
      { term: 'Whole carcass price', tagalog: 'sabit-ulo', meaning: 'The price per kg of a whole carcass delivered to the market stall, as used in the DA price cap of March 2025.' },
      { term: 'Picnic shoulder', tagalog: 'kasim', meaning: 'A pork cut named in DA retail price monitoring.' },
      { term: 'Hind leg', tagalog: 'pigue', meaning: 'A pork cut named in DA retail price monitoring.' },
    ],
    body: `## Who buys pigs from a backyard raiser

Smallholders in the Philippines sell live pigs, not meat, and almost every buyer prices per kilogram liveweight. The buyer types below come from a 2000-2001 field survey of 144 pig-raising households in Batangas and Laguna, the only field study found; its structure still matches what 2024 to 2026 news reports describe. Trader payment timing (cash at weighing or deferred) was not found in any primary source, so the "how they pay" column is mostly blank.

| Buyer | How they price | How they pay | Pros | Cons |
|---|---|---|---|---|
| Viajero or biyahero (long-distance trader) | Per kg liveweight, weighed at pickup | Not documented | Collects at the farm; the main outlet beyond the neighbourhood | Small, irregular volumes cut your bargaining power; accused of lowballing in 2019 and of coordinated pricing in 2026 |
| Village agent or local trader | Per kg liveweight for slaughter hogs; per head with a two-tier per-kg scheme for piglets (PM-27) | Not documented | Buys both piglets and slaughter hogs close to home | Deducts ₱5 per kg outside the 80 to 100 kg window (Negros Occidental buyer, October 2025) (PM-19, PM-20) |
| Wet-market vendor or butcher | Per kg liveweight or per kg carcass (sabit-ulo) | Not documented | Buys live or as carcass | Carcass reference of ₱300 per kg (DA cap, March 2025) had 5 to 7 percent compliance (PM-12) |
| Slaughterhouse (LGU or NMIS-accredited) | Per kg liveweight at the slaughterhouse | Not documented | Traders and vendors buy there; a public reference price | You deliver; Bacolod fell to ₱120 per kg (August 2026) (PM-07) |
| Lechonero (roaster) | Buys live by size class; sells roasted per head | Not documented | Wants a lighter pig than a market hog | Sensitive to ASF shipping permits; buys where live hogs are cheapest |
| Direct consumer (fiesta, family event) | Per head, live or roasted | Not documented | Whole-pig sale with no middleman | No primary price data for live per-head sales |
| Cooperative contract growing (paiwi) | Per kg liveweight; the cooperative sells to about 10 Manila buyers and to viajeros | Inputs deducted from sales at cycle end, then profit split 50/50 (PM-29) | Verified stock, feed on credit, vet services and an 11 percent higher liveweight price (PM-28) | Cannot sell without permission; cannot raise own fatteners alongside |
| Neighbour raiser (piglet buyer) | Per head for feeder piglets of about 15 kg (PM-26) | Not documented | The main outlet for smallholder piglets | Buyer cannot verify genetics |

## What the record shows about each buyer

**Viajeros and village agents.** Independent smallholders who sell beyond neighbours and local retailers must rely on them. Because traders cannot verify quality and you sell small volumes at irregular times, the survey found smallholders receive lower prices than they otherwise would. In October 2019 Batangas traders offered ₱70 per kg and settled at ₱80 per kg against a pre-ASF equivalent of about ₱110 per kg (PM-48). In August 2026 a Bacolod raiser asked the city to investigate possible coordinated pricing after slaughterhouse liveweight fell to ₱120 per kg (PM-07).

**Wet-market vendors.** The value chain SINAG described in March 2025 ran ₱230 per kg farmgate liveweight, plus about ₱70 per kg for the trader to reach ₱300 per kg carcass, plus about ₱50 per kg for the retailer to reach ₱350 per kg for kasim and pigue (PM-10, PM-11, PM-12).

**Lechoneros.** Cebu roasters said in October 2024 that they bought from Negros Island, where live hogs cost ₱120 to 140 per kg against ₱180 per kg in Cebu. Roasted lechon sells per head: ₱8,000 to 15,100 on a Cebu chain list (17 December 2025) and ₱10,000 to 20,000 in La Loma, Quezon City (23 December 2025) (PM-21, PM-22). No primary source gives the live price lechoneros pay.

**Cooperatives.** Under the Sorosoro Ibaba scheme in Batangas, contract growers received liveweight prices 11 percent higher than independents (₱63.57 against about ₱57.78 per kg, 2000-2001) (PM-28). See [contract growing](/guide/strategy-contract-growing) and [paiwi](/guide/strategy-paiwi).

**Online marketplaces.** No primary source was found, so this Guide says nothing about them.

Whatever the buyer, the pig needs the right papers to move: see [movement and sale rules](/guide/movement-and-sale-rules). For how each buyer sets a price, see [pricing units](/guide/pricing-units).`,
  },
  {
    id: 'pricing-units',
    section: 'market',
    title: 'Pricing units',
    summary: 'Piglets sell per head, market hogs per kg liveweight, lechon per head or size band. The two-tier piglet convention, the 80 to 100 kg window and what is not documented about scales.',
    prices: true,
    sources: ['PM-01', 'PM-19', 'PM-20', 'PM-21', 'PM-22', 'PM-24', 'PM-25', 'PM-26', 'PM-27'],
    terms: [
      { term: 'Liveweight', meaning: 'The weight of the live animal at the farm or buying station. Almost every Philippine hog channel prices per kg liveweight.' },
      { term: 'Farmgate price', meaning: 'The PSA term for the price the raiser receives. PSA publishes a Household (backyard) series, an Establishment (commercial) series and, from 2025, an Average series.' },
      { term: 'Weaner piglet', tagalog: 'biik', meaning: 'A weaned piglet sold for growing on, quoted per head by age or weight class, such as 30-day or 45-day biik.' },
      { term: 'Roast pig', tagalog: 'lechon', meaning: 'A whole roasted pig, sold per head by size band or per kg of cooked weight.' },
      { term: 'Suckling roast pig', tagalog: 'lechon de leche', meaning: 'The smallest lechon size, about 3 to 5 kg cooked on a Cebu chain list, serving 6 to 12 persons.' },
    ],
    body: `## Three units for three kinds of pig

**Piglets sell per head.** Feeder piglets of about 15 kg go to neighbouring raisers or to village traders (PM-26). The only dated primary figure is old: ₱1,317 per head paid by independent smallholders and ₱1,873 by contract growers for weaners of similar weight (2000-2001 survey) (PM-24). No current piglet price per head is published by PSA or the DA, which is why the app asks you to log the price you are offered.

**Market hogs sell per kg liveweight.** The PSA Household series, the one that reflects backyard raisers, read ₱172.62 per kg liveweight in June 2026 (PM-01). The trader weighs the pig at pickup and pays on that weight.

**Lechon sells per head or by size band.** Roasters buy live pigs in specific size classes and sell the roasted pig per head. A Cebu chain list effective 17 December 2025 ran from ₱8,000 for lechon de leche (3 to 5 kg cooked) to ₱15,100 for a large (14 to 16.9 kg cooked) (PM-22). La Loma, Quezon City, quoted ₱10,000 to 12,000 for the smallest size and ₱1,500 to 1,600 by the kilo on 23 December 2025 (PM-21). No primary source gives the live price per kg or per head that lechoneros pay; the document lists this as an open question.

## The two-tier piglet convention

The standard piglet pricing scheme charged a much higher rate for the first 10 kg than for weight above 10 kg, so smaller piglets cost more per kilogram than heavier ones (PM-27). On a per-kg basis, piglets fetched ₱89.78 per kg against ₱57.78 per kg for slaughter hogs, a 55 percent premium (2000-2001) (PM-25). The document suggests the app treat the piglet price as your own observation, with this two-tier structure as the template.

## The weight window and deductions

A Negros Occidental raisers' association reported in October 2025 that buyers paid ₱150 per kg but deducted a further ₱5 per kg for pigs below 80 kg or above 100 kg (PM-19, PM-20). That is the clearest published statement of the weight window traders reward. A pig held past 100 kg earns less per kg, not more, so judge the target weight before you call the buyer: see [judging target weight](/guide/judging-target-weight) and [grow to market](/guide/strategy-grow-to-market).

## Scales and disputes

Primary sources document lowballing, coordinated-pricing complaints and weight-band deductions, but not who provides the scale, how often weighings are disputed, or whether payment is cash at weighing or deferred. The document lists these as open questions. Until better evidence exists, record the weight you measured and the weight the buyer paid on, so your own records show any gap. See [sale channels and buyers](/guide/sale-channels-and-buyers) for the buyer list.`,
  },
  {
    id: 'price-levels',
    section: 'market',
    title: 'Price levels',
    summary: 'Every dated price observation in the research, newest first: farmgate liveweight, trader quotes, retail pork and lechon.',
    prices: true,
    sources: ['PM-01', 'PM-02', 'PM-03', 'PM-04', 'PM-05', 'PM-06', 'PM-07', 'PM-08', 'PM-09', 'PM-13', 'PM-14', 'PM-15', 'PM-16', 'PM-17', 'PM-18', 'PM-21', 'PM-22', 'PM-24', 'PM-47', 'PM-48'],
    body: `## These are observations, not today's prices

Every row below is a price someone observed on a stated date at a stated place. None of them is a fact about the market today, and none of them is the price you will be offered. Prices differ by region, buyer and week. Use the table to see the level and the spread, then log what you are actually offered on the Plan page. See the [price disclaimer](/guide/price-disclaimer) and [where to find prices](/guide/where-to-find-prices).

Two gaps to know about: no primary source was found for a current weaner price per head, and none for cull sow prices. The only weaner figure is from 2000-2001 (PM-24).

## Farmgate and live hog prices (₱ per kg liveweight)

| Date | Item | Price | Region or source |
|---|---|---|---|
| 2026-08 | Trader quote | ₱110 to 120, occasionally ₱105 | Tboli, South Cotabato (PM-07) |
| 2026-08 | Slaughterhouse liveweight | ₱120 | Bacolod City slaughterhouse (PM-07) |
| 2026-06-01 | Trader quote | ₱170 | Luzon, NatFed |
| 2026-06-01 | Trader quote | ₱150 | Visayas and Mindanao, NatFed (PM-07) |
| 2026-06 | Household series | ₱172.62 | Philippines, PSA (PM-01) |
| 2026-06 | Establishment series | ₱170.52 | Philippines, PSA |
| 2026-06 | Average series | ₱171.76 | Philippines, PSA (PM-02) |
| 2026-06 | Average series | ₱224.10 | CAR (PM-04) |
| 2026-06 | Average series | ₱191.34 | Ilocos (PM-04) |
| 2026-06 | Average series | ₱180.38 | Cagayan Valley |
| 2026-06 | Average series | ₱181.05 | Central Luzon (PM-04) |
| 2026-06 | Average series | ₱172.73 | Calabarzon (PM-04) |
| 2026-06 | Average series | ₱173.98 | Mimaropa |
| 2026-06 | Average series | ₱164.40 | Bicol (PM-04) |
| 2026-06 | Average series | ₱152.75 | Western Visayas (PM-05) |
| 2026-06 | Average series | ₱208.73 | Central Visayas (PM-05) |
| 2026-06 | Average series | ₱188.30 | Eastern Visayas (PM-05) |
| 2026-06 | Average series | ₱145.60 | Zamboanga (PM-06) |
| 2026-06 | Average series | ₱165.27 | Northern Mindanao (PM-06) |
| 2026-06 | Average series | ₱154.49 | Davao (PM-06) |
| 2026-06 | Average series | ₱141.98 | Soccsksargen (PM-06) |
| 2026-06 | Average series | ₱175.76 | Caraga (PM-06) |
| 2026-06 | Average series | ₱190.21 | BARMM (PM-06) |
| 2026-05 | Household series | ₱171.78 | Philippines, PSA (PM-01) |
| 2026-05 | Average series, sparse | ₱200.00 | NCR, not a benchmark |
| 2026-03 | Average series | ₱179.23 | Philippines, PSA |
| 2026-02 | Household series | ₱181.36 | Philippines, PSA (PM-01) |
| 2026-01 | Trader quote | ₱140 to 160 | Tboli, South Cotabato |
| 2025-12 | Average series | ₱187.06 | Philippines, PSA |
| 2025-11-04 | Reported range when the ₱210 floor was set | ₱150 to 180 | Philippines, DA (PM-08) |
| 2025-11 | Household series, trough month | ₱176.13 | Philippines, PSA (PM-03) |
| 2025-10-15 | Trader quote | ₱150, from ₱160 a year earlier | Kabankalan, Negros Occidental |
| 2025-06 | Household series, peak month | ₱212.12 | Philippines, PSA (PM-03) |
| 2025-06 | Average series | ₱214.52 | Philippines, PSA |
| 2025-04-14 | DA-cited farmgate | ₱250 to 255 | Philippines, DA |
| 2025-03-18 | Producer-agreed maximum | ₱230, from ₱260 to 265 | Philippines, SINAG (PM-09) |
| 2025 | Household series, annual | ₱198.30 | Philippines, PSA (PM-03) |
| 2025 | Establishment series, annual | ₱200.00 | Philippines, PSA |
| 2025 | Average series, annual | ₱212.23 | Calabarzon |
| 2025 | Average series, annual | ₱174.72 | Soccsksargen |
| 2024-10-28 | Live hogs | ₱120 to 140 | Negros Island |
| 2024-10-28 | Live hogs | ₱180 | Cebu |
| 2024 | Household series, annual | ₱182.26 | Philippines, PSA |
| 2023 | Household series, annual | ₱167.50 | Philippines, PSA |
| 2022 | Household series, annual | ₱176.06 | Philippines, PSA |
| 2021 | Household series, annual | ₱155.80 | Philippines, PSA |
| 2020 | Household series, annual | ₱111.98 | Philippines, PSA |
| 2019-10-21 | Trader offers during ASF | ₱70 to 80 | Calaca, Batangas (PM-48) |
| 2019, pre-ASF | Equivalent before ASF | about ₱110 | Batangas (PM-48) |
| 2019 | Household series, annual | ₱108.30 | Philippines, PSA |
| 2000-2001 | Smallholder to village traders | ₱58.43 | Lipa and San Pablo, Southern Luzon |
| 2000-2001 | Contract growers to cooperative | ₱63.57 | Sorosoro Ibaba, Batangas |

## Piglets and sows (₱ per head or per kg)

| Date | Item | Price | Region or source |
|---|---|---|---|
| 2000-2001 | Weaner per head, independent smallholder purchase | ₱1,317 | Southern Luzon (PM-24) |
| 2000-2001 | Weaner per head, contract grower purchase | ₱1,873 | Batangas (PM-24) |
| 2000-2001 | Piglet per kg liveweight, sold by smallholders | ₱89.78 | Southern Luzon |
| 2000-2001 | Sow per head, purchase | ₱8,439 | Southern Luzon, independents |
| any | Cull sow per kg | not found in any primary source | open question |

## Retail pork (₱ per kg)

| Date | Item | Price | Region or source |
|---|---|---|---|
| 2026-08-31 | Liempo, local, prevailing | ₱379.80 | NCR wet markets, DA (PM-13) |
| 2026-08-31 | Kasim, local, prevailing | ₱326.56 | NCR wet markets, DA (PM-14) |
| 2026-08-31 | Pigue, local, prevailing | ₱325.07 | NCR wet markets, DA (PM-15) |
| 2026-08-31 | Pork chop, local | ₱328.17 | NCR wet markets, DA |
| 2026-08-31 | Liempo, imported | ₱303.70 | NCR wet markets, DA (PM-16) |
| 2026-08-31 | Kasim, imported | ₱239.62 | NCR wet markets, DA (PM-16) |
| 2026-08-24 to 30 | Liempo, local, weekly average | ₱379.45 | NCR, DA (PM-13) |
| 2026-08-24 to 30 | Kasim, local, weekly average | ₱325.79 | NCR, DA (PM-14) |
| 2026-08 | Pork | ₱280 to 300 | South Cotabato markets (PM-17) |
| 2025-11, early | Liempo | up to ₱480 | NCR |
| 2025-10 | Pork | ₱300 to 340 | southern Negros Occidental (PM-17) |
| 2025-04 | Liempo; kasim and pigue | ₱420 to 440; ₱370 to 380 | NCR |
| 2025-03-18 | Range under the MSRP | ₱230 to 470 | Metro Manila wet markets |
| 2025-03-06 | Pigue; liempo, before the MSRP | ₱380; ₱450 | Metro Manila |
| 2025 | Pork shoulder, PSA annual average | ₱357.21 | Philippines (PM-18) |
| 2021-02-09 | Kasim; liempo, under the 2021 cap | ₱270; ₱300 | NCR (PM-47) |
| 2021-02-05 | Kasim; liempo, before the 2021 cap | ₱350; ₱380 | NCR (PM-47) |

## Lechon, roasted (₱ per head or per kg)

| Date | Item | Price | Region or source |
|---|---|---|---|
| 2025-12-23 | Smallest, about 30 persons | ₱10,000 to 12,000 per head | La Loma, Quezon City (PM-21) |
| 2025-12-23 | Larger sizes | ₱15,000 to 20,000 per head | La Loma, Quezon City (PM-21) |
| 2025-12-23 | By the kilo | ₱1,500 to 1,600 per kg | La Loma, Quezon City (PM-21) |
| 2025-12-17 | Lechon de leche, 3 to 5 kg cooked | ₱8,000 per head | Cebu chain list (PM-22) |
| 2025-12-17 | 8 to 10.9 kg cooked | ₱13,100 per head | Cebu chain list (PM-22) |
| 2025-12-17 | 14 to 16.9 kg cooked | ₱15,100 per head | Cebu chain list (PM-22) |
| 2024-12-20 | Cheapest whole lechon | ₱8,000 per head, from ₱7,000 in October 2024 | Talisay City, Cebu |
| 2024-12-20 | By the kilo | ₱800 per kg | Talisay City, Cebu |
| 2024-12-08 | 6 to 7 kg | ₱10,000 per head, from ₱7,500 | La Loma, Quezon City |
| 2024-12-08 | 8 to 9 kg | ₱11,000 per head, from ₱8,500 | La Loma, Quezon City |
| 2024-12-08 | 10 to 11 kg | ₱13,000 per head, from ₱10,000 | La Loma, Quezon City |

The lechon rows are what the roaster charges the customer, not what the roaster pays you for the live pig. For the month-by-month pattern behind these levels, see [price seasonality](/guide/price-seasonality).`,
  },
  {
    id: 'price-seasonality',
    section: 'market',
    title: 'Price seasonality',
    summary: 'The month-by-month pattern in farmgate prices: a March to June high, an October trough, and what the record does and does not say about fiestas and Christmas.',
    prices: true,
    sources: ['PM-03', 'PM-21', 'PM-23', 'PM-36', 'PM-37', 'PM-38', 'PM-39'],
    body: `## What the PSA series shows

The seasonal indices below were computed by the researcher from the PSA monthly farmgate series: each month divided by that year's annual average. PSA does not publish them. The reliable pattern is a first-half high (March to June, roughly 3 to 8 percent above the annual mean) and an August to November trough (2 to 8 percent below). It is not a December spike.

| Month | Household 2019-2025 | Household 2022-2025 | Establishment 2022-2025 |
|---|---|---|---|
| January | 0.976 | - | - |
| February | 1.004 | 1.022 | - |
| March | 1.021 | 1.038 | 1.083 |
| April | 1.010 | - | - |
| May | 1.029 | 1.032 | - |
| June | 1.035 | 1.048 | 1.052 |
| July | 1.004 | - | - |
| August | 0.984 | - | - |
| September | 0.978 | - | - |
| October | 0.960 | 0.951 | 0.924 |
| November | 0.978 | 0.952 | 0.937 |
| December | 1.020 | 0.992 | 0.970 |

The March to June index runs 1.02 to 1.05 on the Household series (PM-36); the October to November trough runs 0.95 to 0.98 (PM-37); the Establishment series peaks at 1.083 in March and bottoms at 0.924 in October (PM-39). In 2025 the Household series peaked at ₱212.12 per kg liveweight in June and bottomed at ₱176.13 in November (PM-03), and that November low is what triggered the DA's ₱210 per kg floor price.

## Fiesta and graduation season

Fiesta season (April to June in many provinces), Holy Week and graduation season are not quantified in any primary source found. The March to June high is consistent with them, but the series does not attribute causes. Piglet price seasonality is not documented anywhere primary.

## Christmas

The December uplift in farmgate prices is weak and unreliable. The Household December index is 1.020 over 2019-2025 but 0.992 over 2022-2025, and December exceeded September in only three of seven years (PM-38). Fourth-quarter slaughter volume is the year's highest, which means holiday demand is met by supply rather than by a farmgate premium. The documented Christmas effects are downstream, in roasted lechon: La Loma prices rose 29 to 33 percent in early December 2024 and were re-set from 16 to 31 December, and the cheapest Talisay lechon rose 14 percent from October to December 2024 (PM-23). La Loma's smallest lechon was ₱10,000 to 12,000 per head on 23 December 2025 (PM-21). None of that is evidence that a trader will pay you more per kg in December.

## The October trough

October is the weakest month on every series: 0.960 (Household, 2019-2025), 0.951 (Household, 2022-2025) and 0.924 (Establishment, 2022-2025) (PM-37, PM-39). If a batch can reach target weight in May or June instead of October, the index says it earns a few percent more per kg. ASF outbreaks and movement bans override all of this in any month: locked-in areas crash while receiving areas rise.

The app applies this index only when you pick a planned sale month on the Plan page. See [timing](/guide/strategy-timing), [projection assumptions](/guide/projection-assumptions) and [price levels](/guide/price-levels).`,
  },
  {
    id: 'where-to-find-prices',
    section: 'market',
    title: 'Where to find prices',
    summary: 'The official series and local sources a raiser can check: PSA OpenSTAT farmgate tables, the DA Bantay Presyo retail PDFs, import statistics and local quotes.',
    prices: true,
    sources: ['PM-01', 'PM-02', 'PM-07', 'PM-13', 'PM-40', 'PM-42', 'PM-44'],
    body: `## Official sources

- **PSA OpenSTAT farmgate prices.** Monthly farmgate price of hogs for slaughter by province and region. Three tables: the [Household table 0032M4AFN10](https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2M__NFG/0032M4AFN10.px), which reflects backyard raisers and read ₱172.62 per kg liveweight in June 2026 (PM-01); the [Establishment table 0032M4AFN11](https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2M__NFG/0032M4AFN11.px) for commercial farms; and the [Average table 0032M4AFN12](https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2M__NFG/0032M4AFN12.px), from 2025 onwards (PM-02). They update around the first week of the second month after the reference month: June 2026 data were posted on 6 August 2026.
- **PSA Livestock and Poultry Quarterly Bulletin.** Inventory, production and farmgate prices, with regional Special Releases from PSA regional offices. It replaced the Swine Situation Report from the fourth quarter of 2023. See the [PSA livestock and poultry page](https://psa.gov.ph/statistics/lp).
- **PSA OpenSTAT supply context.** The [swine inventory table 0032E4FINS0](https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2E__LP__INV__NEW/0032E4FINS0.px) (8.93 million head on 1 July 2026) (PM-40) and the [production table 0012E4FLPO0](https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2E__LP__PDN/0012E4FLPO0.px) (PM-42).
- **DA Bantay Presyo.** The [DA Price Monitoring page](https://www.da.gov.ph/price-monitoring/) publishes a Daily Price Index (NCR prevailing retail per cut, local and imported) and Weekly Average Retail Prices, both as PDFs, each business day. Local liempo was ₱379.80 per kg on 31 August 2026 (PM-13). These cover NCR only.
- **BAI import statistics.** Reported monthly in the business press; pork imports were 851,760 t in 2025 (PM-44). Useful for understanding why farmgate prices fall.

## Local sources

The prices that matter most are the ones near you, and no official series publishes them.

- The viajero or biyahero quote at the farm.
- The LGU slaughterhouse liveweight price. Bacolod's fell to ₱120 per kg in August 2026 (PM-07).
- The wet-market carcass price.

These are the figures raisers cite in complaints, and the Provincial Price Monitoring Council is the body raisers are referred to when they allege trader manipulation.

## What to do with a price once you find it

Log it on the Plan page's price log with its date and source. The app uses your latest logged observation before any published default, so a fresh local quote replaces the research figures in the recommendation. See the [price disclaimer](/guide/price-disclaimer), [price levels](/guide/price-levels) and [sale channels and buyers](/guide/sale-channels-and-buyers).`,
  },
  {
    id: 'smallholder-economics',
    section: 'market',
    title: 'Smallholder economics',
    summary: 'What it costs to produce a kilogram of pig, the losses raisers reported in 2025 and 2026, the feed share, and why raisers sell piglets, hold or fatten.',
    prices: true,
    sources: ['PM-07', 'PM-08', 'PM-25', 'PM-28', 'PM-29', 'PM-30', 'PM-31', 'PM-32', 'PM-33', 'PM-34', 'PM-35', 'PM-48'],
    body: `## Cost of production per kg liveweight

Every cost figure below is dated, and the spread between them is wide.

- PIDS, using 2017 to 2020 data: ₱148.26 per kg for backyard raisers and ₱112.40 per kg for commercial farms (PM-31). Feed was about 57 percent of operating cost (PM-32).
- DA estimate, November 2025: ₱165 to 180 per kg (PM-30).
- NatFed, June 2026: ₱185 to 205 per kg, up from ₱180 to 200 before a 4 to 6 percent feed price rise tied to the 2026 Middle East conflict (PM-30).
- A South Cotabato farm owner, August 2026: about ₱13,000 to raise an 80 kg hog including piglet, feed, medicines, vaccines and labour, or ₱162 per kg, and at least ₱170 per kg needed to break even (PM-33, PM-34).

Set those against the farmgate prices raisers were actually getting: ₱110 to 120 per kg in South Cotabato and ₱120 per kg at the Bacolod slaughterhouse in August 2026 (PM-07). The DA's ₱210 per kg floor of 4 November 2025 has not appeared in PSA data since (PM-08).

## Losses reported in 2025 and 2026

- At ₱110 per kg an 80 kg hog grosses about ₱8,800, leaving losses of up to ₱4,200 per head (South Cotabato, August 2026) (PM-35).
- At ₱150 per kg, Negros Occidental raisers said they would lose around ₱1,000 per head (October 2025) (PM-35).
- In October 2019 a 100 kg pig fetched ₱7,000 at ₱75 per kg against an investment of about ₱9,000 and a pre-ASF sale value of ₱11,000 (PM-48).

Break-even prices in circulation: ₱170 per kg (South Cotabato raiser, August 2026) (PM-33); ₱180 to 205 per kg (NatFed, June 2026) (PM-30); ₱150 to 180 per kg described as little more than break-even when the floor was set (November 2025).

## Why raisers sell piglets, hold, or fatten

The 2000-2001 survey found fattening was the most cash-demanding activity because weaners and feed are cash costs, and that a weaner producer's profit per kg was high when family labour was not costed but turned negative when it was costed at the legislated wage. Piglets earned 55 percent more per kg than slaughter hogs (₱89.78 against ₱57.78 per kg, 2000-2001) and needed less cash (PM-25). Contract growers got verified stock, feed on credit and an 11 percent higher liveweight price, with inputs deducted from sales at cycle end and the profit split 50/50 (PM-28, PM-29).

When prices fall, raisers delay sales until prices stabilise or cut production: Tboli's hog inventory fell about 75 percent by August 2026. ASF movement restrictions can strand pigs and force distress sales at ₱70 to 80 per kg (Batangas, October 2019) (PM-48).

The app computes your own cost per kg and break-even from your records: see [unit costs and break-even](/guide/unit-costs-and-break-even), [costs and margins](/guide/kpi-costs-and-margins), [sell weaners](/guide/strategy-sell-weaners) and the [decision rules](/guide/decision-rules).`,
  },
  {
    id: 'price-disclaimer',
    section: 'market',
    title: 'Price disclaimer',
    summary: "Every price in this Guide and every price default in the app is a dated observation from a named source, not a fact about today's market.",
    prices: true,
    sources: ['PM-01', 'PM-21', 'PM-22', 'PM-24', 'PM-30', 'PM-36'],
    body: `## Read this before you use any price

Every price in this Guide and every price default in the app is a dated observation from a named source, not a fact about today's market. Prices differ by region, buyer, weight band and week, and they move quickly. In June 2026 the national Household farmgate series read ₱172.62 per kg liveweight (PM-01) while traders in South Cotabato were paying ₱110 to 120 per kg two months later. The only weaner price per head in a primary source is from 2000-2001 (PM-24). The lechon figures are what roasters charge at Christmas (PM-21, PM-22), not what they pay for a live pig. Cost of production figures range from ₱165 to 205 per kg depending on who estimated them and when (PM-30).

Record the prices you are actually offered on the Plan page's price log. The app uses your latest observation before any published default, and the recommendation shows which prices it used.

## How the app uses prices

- **Defaults come from the knowledge base.** Each default carries a source row and a date, and the recommendation page lists every assumption with its row so you can see where a number came from.
- **Your own log comes first.** The latest dated observation you record for an item (piglet per head, liveweight per kg, lechon per head, feed per bag) replaces the default for that item. Everything you have not logged stays at its default.
- **The seasonal index applies only when you pick a sale month.** If you choose a planned sale month, the app scales the liveweight price by the computed monthly index (PM-36). If you leave the month blank, it uses the price as logged.

## What to do

1. Ask two buyers for a quote before you sell, and log both with the date.
2. Log the weaner and lechon prices you hear about, because those have no current official series.
3. Re-check the [price levels](/guide/price-levels) and the sources in [where to find prices](/guide/where-to-find-prices) before you rely on a projection, and read [projection assumptions](/guide/projection-assumptions) to see how each default reaches the result.`,
  },
]

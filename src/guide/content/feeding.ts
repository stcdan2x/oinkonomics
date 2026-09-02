import type { GuideArticle } from '../types'

export const FEEDING: GuideArticle[] = [
  {
    id: 'growth-stages',
    section: 'feeding',
    title: 'Growth stages',
    summary: 'Suckling, weaner (biik), grower and finisher: the age and weight boundaries Philippine feed guides and the PAES 401 standard use, and where market weight sits.',
    body: `## Four stages, keyed on weight

Philippine feed companies name the stages by age. The engineering standard PAES 401 names them by weight. The two only loosely agree, so decide by weight and use age as a check.

### Suckling piglet: birth to weaning

A suckling piglet lives on the sow's milk plus a little booster or creep feed. Commercial farms wean at 21 to 28 days (GN-01), when the piglet weighs 5 to 8 kg (GN-02). Native pigs are weaned much later: 45 days in a trade guide and three to four months in a Cordillera survey (GN-03). See [lactation and weaning](/guide/lactation-and-weaning).

### Weaner (biik): weaning to about 25 kg

A weaner, or biik, has left the sow and eats only feed. Pre-starter feed carries it from 5 to 12 kg up to about day 50 (GN-05). PIC's nursery band runs 5.5 to 28.6 kg and ends by 63 days of age (GN-05, GN-36). Weaners bought for fattening weigh 10 to 15 kg (GN-04). A second-hand report of an ATI webinar puts weaners for sale at 20 to 25 kg and seven to eight weeks; the document marks that figure secondary (GN-04).

### Grower: about 25 to 60 kg

PAES 401 defines a grower as 40 to 65 kg and a fattener as any meat pig from 15 kg. The brand guides feed grower ration at 25 to 60 kg (GN-06). On the B-MEG guide that is roughly day 83 to day 137 (GN-35).

### Finisher: 60 kg to market

PAES 401 defines a finisher as 66 kg and up. B-MEG feeds finisher from 60 to 80 kg and Pilmico from 60 kg to market (GN-07).

## Market weight

The DA roadmap says the average marketable weight is 80 kg, yet national monitoring recorded an average weight sold of 92.13 kg in 2018, and PIDS reports 90 to 100 kg with a 95 kg average. Medium and large farms sell at 100 kg. The document takes 90 kg as the typical Philippine market liveweight (GN-08). Smaller pigs sell for lechon by live weight: de leche at 5 to 9 kg (GN-09) and whole lechon in bands from 14 to 31 kg (GN-10). Native pigs mature at about 30 kg (GN-12). Which unit the buyer pays by is in [pricing units](/guide/pricing-units).

What each stage eats is in [feed phases](/guide/feed-phases). Pen sizes by stage are in [pen space by stage](/guide/pen-space-by-stage).`,
    sources: ['GN-01', 'GN-02', 'GN-03', 'GN-04', 'GN-05', 'GN-06', 'GN-07', 'GN-08', 'GN-09', 'GN-10', 'GN-12', 'GN-35', 'GN-36'],
    terms: [
      { term: 'Weaner', tagalog: 'biik', meaning: 'A piglet that has been weaned from the sow and eats only feed; bought for fattening at 10 to 15 kg.' },
      { term: 'Suckling piglet', meaning: 'A piglet from birth to weaning, living on the sow\'s milk plus a little booster or creep feed.' },
      { term: 'Grower', meaning: 'A pig between weaner and finisher: 40 to 65 kg in PAES 401, 25 to 60 kg on the feed-brand guides.' },
      { term: 'Finisher', tagalog: 'fattener', meaning: 'A meat pig in its last stage before sale: 66 kg and up in PAES 401, 60 kg to market on the feed-brand guides.' },
    ],
  },
  {
    id: 'average-daily-gain',
    section: 'feeding',
    title: 'Average daily gain',
    summary: 'What ADG is, the Philippine national and smallholder figures, the benchmarks under good conditions, and what pulls gain down.',
    body: `## What ADG is

Average daily gain (ADG) is the weight a pig puts on per day: the kilograms gained between two weighings divided by the days between them. The app works it out from the weighings you record; see [growth tracking](/guide/growth-tracking) and [growth KPIs](/guide/kpi-growth).

## Philippine figures

- National average from birth: 0.561 kg per day (2020 baseline), after 0.550 in 2009 and 0.571 in 2018. The roadmap targets 0.850 by 2026 (GN-17).
- ASEAN smallholder benchmark: about 0.550 kg per day. Medium farms reach 0.615 and large farms 0.650 (GN-18).
- The DA roadmap's feed budget assumes 0.650 kg per day, reaching 90 kg at 20 to 24 weeks from birth (GN-19).
- B-MEG's guide implies 0.65 kg per day in the grower phase and 0.80 in the finisher phase (derived from its tables) (GN-20).
- UNAHCO expects 0.68 to 0.77 kg per day up to 110 lb (about 50 kg) and 0.82 to 1.0 after that (GN-21).
- PIC's Philippine finishing scenarios run at 0.864 to 0.890 kg per day over 110 days (GN-16).

## Benchmarks under good conditions (general)

PIC gives a target, an average and an intervention level. Intervention is where PIC says to act.

| Stage | Target (kg/day) | Average | Intervention |
|---|---|---|---|
| Nursery | 0.487 | 0.473 | 0.383 |
| Grow-finish | 0.955 | 0.927 | 0.835 |
| Wean-to-finish | 0.805 | 0.782 | 0.704 |

(GN-13, GN-14, GN-15)

## Backyard conditions

No Philippine primary source states a measured backyard ADG; the document lists this as an open question. The closest anchors are the national average of 0.561 kg per day, a herd-wide figure dominated by smallholders, and the ASEAN smallholder benchmark of about 0.550 (GN-17, GN-18). The roadmap notes that commercial farms wean earlier and finish in fewer fattening days than smallholders (GN-18).

## What lowers it

- Poor feed. Native pigs on rice bran plus forage gained only 0.056 kg per day; adding 15 percent golden apple snail silage lifted that to 0.078 (GN-22). See [alternative feeds](/guide/alternative-feeds).
- Low intake. Daily feed near 4 percent of body weight signals normal appetite (GN-42). A pig eating less than that is gaining less.
- Genetics. Native-pig figures rest on small student and regional studies of uneven quality, the document says, but they sit far below every commercial figure above (GN-22).

A pig gaining 0.55 kg per day instead of 0.80 needs many more days of feed to reach the same weight. That is why ADG drives cost: see [feed conversion and days to weight](/guide/feed-conversion-and-days-to-weight).`,
    sources: ['GN-13', 'GN-14', 'GN-15', 'GN-16', 'GN-17', 'GN-18', 'GN-19', 'GN-20', 'GN-21', 'GN-22', 'GN-42'],
    terms: [{ term: 'Average daily gain (ADG)', meaning: 'Kilograms of liveweight a pig gains per day: the gain between two weighings divided by the days between them.' }],
  },
  {
    id: 'feed-conversion-and-days-to-weight',
    section: 'feeding',
    title: 'Feed conversion and days to weight',
    summary: 'Feed conversion ratio (FCR), the Philippine national and small-farm figures against budgets, how many days a weaner needs to reach market weight, and why FCR sets your feed cost.',
    body: `## What FCR is

Feed conversion ratio (FCR) is the kilograms of feed a pig eats for every kilogram of liveweight it gains. Lower is better.

## Philippine figures

- National average: 3.19 kg feed per kg gain in 2020; the roadmap targets 2.27 by 2026 (GN-27).
- ASEAN small farms: Philippines 3.3, Vietnam 3.0, Malaysia 3.4, Indonesia 3.5. Medium-scale Vietnam 2.7, large-scale 2.4 (GN-28).
- PIC's Philippine finishing scenarios use 2.30 to 2.45 (GN-26).
- The DA roadmap's feed budget of 217.56 kg from two weeks of age to 90 kg works out at 2.42 kg feed per kg liveweight sold (derived) (GN-32, GN-43).
- Native pigs: 3.95 on commercial feed, 7.86 on half taro and half kitchen leftovers (GN-31).

The gap between the national 3.19 and the budget's 2.42 is feed you pay for without selling any extra weight.

## Benchmarks under good conditions (general)

| Stage | Target | Average | Intervention |
|---|---|---|---|
| Nursery | 1.31 | 1.46 | 1.66 |
| Grow-finish | 2.33 | 2.59 | 2.80 |
| Wean-to-finish | 2.13 | 2.37 | 2.56 |

(GN-23, GN-24, GN-25)

FCR worsens as the pig gets heavier. Early growing pigs convert at under 2:1 and finishing pigs at over 3:1. In high-lean genetics it rose from 3.46 at 109 to 113 kg to 4.09 at 122 to 127 kg (GN-29). Cumulative wean-to-finish conversion was 2.59 at 113 kg after 160 days and 2.73 at 127 kg after 176 days (GN-30).

## Days from weaner to market weight

- B-MEG's guide: 5 to 8 kg at day 21 to 35, 25 kg at day 83, 60 kg at day 137 and 80 kg at day 145. That is about 116 days from a 21-day weaning to 60 kg and 124 days to 80 kg (GN-35).
- DA roadmap: 140 to 168 days (20 to 24 weeks) from birth to 90 kg at 0.650 kg per day (GN-33).
- PIDS: four to five months (120 to 150 days) from a 10 to 15 kg weaner to market (GN-34).
- ATI webinar report (secondary): 100 to 120 days from a 20 to 25 kg weaner (GN-04).
- PIC: 22.5 kg by 63 days of age (GN-36), and 160 days on feed to 113 kg at benchmark performance (GN-30).

The app's [growth tracking](/guide/growth-tracking) turns your own weighings into a date to target.

## Why FCR matters for cost

Feed is 65 to 80 percent of the cost of producing a pig (GN-68). The roadmap's feed cost per finisher is ₱5,524 from birth to 90 kg and ₱4,869 from a bought piglet (DA roadmap, 2022 Batangas prices) (GN-67). Every tenth of a point of FCR is feed bought for the same pig. Track it with [cost and margin KPIs](/guide/kpi-costs-and-margins), and see how the app turns feed into a cost per kilogram in [unit costs and break-even](/guide/unit-costs-and-break-even). Current bag prices are in [feed brands and prices](/guide/feed-brands-and-prices).`,
    sources: ['GN-04', 'GN-23', 'GN-24', 'GN-25', 'GN-26', 'GN-27', 'GN-28', 'GN-29', 'GN-30', 'GN-31', 'GN-32', 'GN-33', 'GN-34', 'GN-35', 'GN-36', 'GN-43', 'GN-67', 'GN-68'],
    prices: true,
    terms: [{ term: 'Feed conversion ratio (FCR)', meaning: 'Kilograms of feed eaten per kilogram of liveweight gained. Lower is better; also written feed:gain or F:G.' }],
  },
  {
    id: 'feed-phases',
    section: 'feeding',
    title: 'Feed phases',
    summary: 'Booster, pre-starter, starter, grower and finisher feeds with the age and weight band, daily amount and phase total from the Philippine brand guides and the DA roadmap, plus the sow feeds.',
    body: `## The phase names

Philippine feed brands name the phases booster or creep (Pigrolac "booster", Pilmico "Sprinter", B-MEG "Super Biik Pre-starter"), pre-starter, starter, grower and finisher, with gestating and lactating sow feeds and a breeder or boar conditioner (GN-37). The brands do not agree on the day each phase starts, so match the phase to the pig's weight and use the days as a check. Stage boundaries are in [growth stages](/guide/growth-stages).

## Growing pigs

Where a guide gives only a daily amount and a duration, the phase total is derived (daily x days).

| Phase | Age (days) | Weight (kg) | Daily feed (kg per head) | Phase total (kg per head) | Notes |
|---|---|---|---|---|---|
| Booster / creep | 5-35 (Pigrolac); 10-14 to 7 days after weaning (Pilmico); 14-30 (roadmap) | birth weight to about 7 | 0.06-0.10, up to 0.30 by day 40 | 1.5 (Pilmico); 1.7 (roadmap) | Offered beside the sow (GN-37) |
| Pre-starter | 21-50 (B-MEG); 36-60 (Pigrolac); 30-60 (roadmap) | 5-12 | 0.25-0.50 (B-MEG); 0.50-0.80 (Pigrolac); 0.15-0.55 (roadmap) | 11.25 (B-MEG, derived); 9.46 (roadmap); 10.5 (Pilmico) | (GN-38) |
| Starter | 61-90 (Pigrolac); 60-90 (roadmap) | 12-25 | 1.10-1.30 (Pigrolac); 0.7-1.1 (roadmap); 0.81 (Pilmico, 15-25 kg) | 26.8 (roadmap); 17 (Pilmico) | B-MEG's starter page repeats its grower table, so no B-MEG starter figures exist (GN-39, GN-45) |
| Grower | 91-120 (Pigrolac); 83-137 (B-MEG); 90-150 (roadmap) | 25-60 | 1.90-2.20 (Pigrolac); 2.0-2.2 (B-MEG); 1.1-2.3 (roadmap) | 108-119 (B-MEG, derived); 102.2 (roadmap); 90 (Pilmico) | The biggest phase: about 49 percent of total feed cost (GN-40, GN-46) |
| Finisher | 121-150 (Pigrolac); 121-145 (B-MEG); 150-180 (roadmap) | 60-90 | 2.30-2.50 (Pigrolac); 2.2 (B-MEG); 2.4-2.8 (roadmap); 2.33 (Pilmico) | 55 (B-MEG, derived); 77.4 (roadmap); 70 (Pilmico) | (GN-41) |

As a rule of thumb, a growing pig eats about 4 percent of its body weight per day (GN-42).

## Feed per pig to market

- DA roadmap: 217.56 kg from two weeks of age to 90 kg, which is 4.35 bags of 50 kg; 215.9 kg (4.32 bags) from weaning at one month (GN-43).
- Pilmico: 189 kg from creep to market, but the guide does not state the market weight (GN-44).
- B-MEG: 174 to 185 kg across pre-starter, grower and finisher, with the starter phase missing (GN-45).

The app's feed stock rules are in [stock rules](/guide/stock-rules).

## Sow and boar feeds

| Feed | When | Daily (kg per head) | Total (kg) |
|---|---|---|---|
| Gestating sow | day 1 to about 110 of pregnancy | 1.8-2.5 early and mid pregnancy (GN-47); 2.5-3.5 in late pregnancy (GN-48) | 241 per pregnancy, roadmap schedule (GN-49) |
| Lactating sow | farrowing to weaning, 28-30 days | 4.5 or more (B-MEG); free choice (Pilmico, Pigrolac); 1 to 5 step-up (roadmap) (GN-50) | 132 per lactation, roadmap schedule (GN-52) |
| Dry sow, flushing, gilt developer | weaning to breeding; gilts 5.5 to 8 months | 2.5-3.0 dry; 3.5-4.0 flushing; 2.4-2.5 gilt developer (GN-53) | 40 flushing; 193 gilt development (GN-56) |
| Boar | all year | 2.3-3.0 (GN-57) | |

The general lactation target is higher than the brand guides: 7.9 to 8.8 kg per day for gilts and 8.8 for sows (GN-51). A sow eats about 413 kg per productive cycle, or 468 kg once the lost days between litters are counted (GN-54), and 1,052 kg per year on the roadmap's 2020 baseline (GN-55). A gilt from 5.5 months through her first cycle eats 606 kg (GN-56). The sow calendar these feeds follow is in [gestation and pregnancy check](/guide/gestation-and-pregnancy-check) and [lactation and weaning](/guide/lactation-and-weaning).

> Some Philippine producers feed grower from three months to sale to avoid the diarrhoea that often follows a feed change (GN-40). See [feeding management](/guide/feeding-management).`,
    sources: [
      'GN-37', 'GN-38', 'GN-39', 'GN-40', 'GN-41', 'GN-42', 'GN-43', 'GN-44', 'GN-45', 'GN-46',
      'GN-47', 'GN-48', 'GN-49', 'GN-50', 'GN-51', 'GN-52', 'GN-53', 'GN-54', 'GN-55', 'GN-56', 'GN-57',
    ],
    terms: [
      { term: 'Booster (creep feed)', meaning: 'The first solid feed, offered to suckling piglets beside the sow from about day 5 to 35; Pilmico calls it Sprinter.' },
      { term: 'Pre-starter', meaning: 'The weaner feed for pigs of 5 to 12 kg, roughly day 21 to 60; B-MEG sells it as Super Biik.' },
      { term: 'Starter', meaning: 'The feed for pigs of 12 to 25 kg, roughly day 60 to 90.' },
      { term: 'Grower feed', meaning: 'The feed for pigs of 25 to 60 kg, roughly day 83 to 137; the biggest share of total feed cost.' },
      { term: 'Finisher feed', meaning: 'The feed for pigs from 60 kg to market weight.' },
    ],
  },
  {
    id: 'feed-brands-and-prices',
    section: 'feeding',
    title: 'Feed brands and prices',
    summary: 'The Philippine hog feed brands, every dated feed price observation in the research, what feed is as a share of total cost, and how mill, dealer and online prices differ.',
    body: `## Brands

Brands with published hog lines are B-MEG (San Miguel), Pigrolac Premium and Vital (UNAHCO), Pilmico Elite and Vitarich. Uno+ (MeatPro), Thunderbird and Sarimanok also appear in online listings (GN-63). Only B-MEG, Pigrolac, Pilmico and the DA roadmap publish kilograms per day by phase; see [feed phases](/guide/feed-phases).

## Dated price observations

Every figure below carries the date and basis the research gives it. Read [price disclaimer](/guide/price-disclaimer) before using any of them.

| Item | Price | Basis and date |
|---|---|---|
| Booster / pre-starter | ₱40 / ₱31 per kg | DA roadmap, 2022, current prices in Batangas, company or cooperative feed (GN-58) |
| Starter / grower / grower-finisher | ₱28 / ₱25 / ₱24 per kg | same (GN-59) |
| Gestating and breeder / lactating | ₱21 / ₱25 per kg | same (GN-60) |
| Finishing diet, mixed from ingredients | ₱23.4 to ₱25.4 per kg | PIC Philippine manual, 2022; soybean meal ₱26.7, corn ₱15.9, coconut oil ₱67.7 per kg (GN-61) |
| Feed price rise | +₱1 per kg, +₱50 per bag (2.5 percent) | BusinessMirror, 2 April 2026, quoting the NatFed vice chairman; cost of production about ₱180 per kg liveweight (GN-62) |
| Grower, 50 kg bag | ₱2,430 to ₱2,515 | Lazada and Shopee listings, September 2026: Pigrolac Vital ₱2,430 (Quezon City seller), B-MEG Premium ₱2,515, Uno+ ₱2,380; online prices include margin and delivery (GN-63) |
| Gestating, 50 kg bag | ₱2,420 | B-MEG Premium Super Inahin, online listing, September 2026 (GN-64) |
| Pre-starter, 25 kg bag | ₱2,005 | B-MEG Super Biik, online listing, September 2026 (GN-65) |
| Grower and finisher, 50 kg bag | ₱1,747 to ₱1,910 (₱34.90 to ₱38.20 per kg) | one unnamed retailer surveyed by a content site, 12 July 2026; secondary and unverified (GN-66) |
| Feed per finisher | ₱5,524 birth to 90 kg; ₱4,869 from a bought piglet | DA roadmap, 2022 Batangas prices (GN-67) |

Grower feeds are about 49 percent of the total feed cost of a finisher (GN-46).

## Mill, dealer and online prices

The research reached no dated dealer or mill price list per phase with a named outlet; it lists this as an open question. What it has is three levels:

- Mill or cooperative level: the roadmap's 2022 per-kilogram costs above, which multiply to ₱1,050 to ₱2,000 per 50 kg bag depending on the phase (derived) (GN-58, GN-59, GN-60).
- Dealer level: the single unverified survey of ₱1,747 to ₱1,910 per 50 kg for premium grower and finisher across B-MEG, Vitarich, Pigrolac, Thunderbird and Sarimanok (12 July 2026) (GN-66).
- Online level: ₱2,380 to ₱2,515 per 50 kg, which includes the seller's margin and shipping (September 2026) (GN-63).

Record what you actually paid per bag in the app: [stock rules](/guide/stock-rules) explains how feed purchases become feed cost. Where to look for current prices is in [where to find prices](/guide/where-to-find-prices).

## Feed as a share of total cost

- 65 to 80 percent of production cost in the DA roadmap; 60 to 65 percent of the cost of raising a weaned pig to market in PIC's guide (GN-68).
- In PIDS's 2018-price model, feed was 57.2 percent of operating cost on a 1,408-head commercial fattening farm (GN-69) but only 36.7 percent on a 40-head backyard farm, where land rent at 31 percent was the second-largest item. Feed cost per kg liveweight was about ₱40 backyard against ₱47 commercial (2018 prices) (GN-70).`,
    sources: ['GN-46', 'GN-58', 'GN-59', 'GN-60', 'GN-61', 'GN-62', 'GN-63', 'GN-64', 'GN-65', 'GN-66', 'GN-67', 'GN-68', 'GN-69', 'GN-70'],
    prices: true,
  },
  {
    id: 'alternative-feeds',
    section: 'feeding',
    title: 'Alternative and local feeds',
    summary: 'Rice bran (darak), copra meal, madre de agua, azolla, cassava, ipil-ipil, snail silage and kitchen leftovers: what the trials found and the inclusion limits the research gives.',
    body: `## Local feeds and their limits

Commercial feed is most of the cost of a pig, so local by-products are tempting. The trials below say how far each one can go. Percentages are the share of the whole diet.

- **Rice bran (darak).** In 10 to 15 kg native pigs, rice bran measured 4,137 kcal digestible energy per kg of dry matter, more than ground yellow corn (3,445) or copra meal (2,914) (GN-71). In 28 kg growing-finishing pigs, full-fat or defatted rice bran at 10, 20 or 30 percent did not change daily gain or carcass traits. Full-fat bran improved gain per kg feed; defatted bran reduced it (GN-72). On its own, rice bran plus forage supported only 0.056 kg per day in native pigs (GN-22).
- **Copra meal.** Optimum near 10 percent, maximum about 20 to 25 percent. It has 22.4 percent crude protein but is low in lysine and methionine, so high inclusion needs amino-acid supplements (GN-73).
- **Madre de agua (Trichanthera gigantea).** Leaf meal at 5, 10 or 15 percent gave no difference in gain, feed conversion, feed cost per kg gain or age to 90 kg (GN-74). Fresh leaves on top of mixed feed had no negative effect on growth and were more economical at the finisher stage. Leaves analysed at 15.8 percent crude protein (GN-75).
- **Azolla.** Dried azolla at 10 percent of a grower ration gave the best gain and the lowest FCR (1.23 against 1.41) in a 90-day trial from 9 kg. At 15 to 20 percent the pigs ate more without gaining more (GN-76).
- **Cassava and ipil-ipil.** Cassava meal under 10 percent of the diet because of toxins; ipil-ipil leaf meal under 5 percent because of anti-nutritional factors. The research gives no parameter row for these two limits.
- **Golden apple snail silage.** Added at 15 percent to rice bran, it raised native-pig gain from 8.26 to 11.52 kg in 147 days and improved feed conversion from 5.08 to 3.72 (GN-22).
- **Banana pseudostem, grated coconut, corn bran.** A 90-day native-pig trial found no significant differences; the authors recommend banana pseudostem only chopped and mixed with other ingredients. No parameter row covers this trial.

## Kitchen leftovers and swill

Native pigs on half taro and half kitchen leftovers converted at 7.86 kg feed per kg gain against 3.95 on commercial feed, and ate about 2,253 kg per head over 12 months against 1,259 kg (GN-77). Cheap feed can still cost more.

Swill carries African swine fever. DA Memorandum Order 22 of 2018 bans catering waste and leftovers from airports and seaports as swill nationwide. The Philippine College of Swine Practitioners advises avoiding swill entirely; where it cannot be avoided, heat it to 90 C for 60 minutes with continuous stirring, or 121 C for 10 minutes at 3 bar (GN-78). Swill feeding is among the behaviours reported to have spread ASF across the Philippines. Household kitchen waste is not named in the national order and local ordinances vary; the research lists its legal status as an open question. Read [ASF in the Philippines](/guide/asf-in-the-philippines) and the [biosecurity checklist](/guide/biosecurity-checklist) before feeding any leftovers.

## Native-pig practice

Native-pig raisers feed sows and boars 1 to 1.5 kg per day and growers of two to five months 0.3 to 1 kg per day of mixed rice bran, corn and copra plus forage, tubers and leftovers (GN-79). Cordillera raisers fed boiled sweet potato and farm by-products twice daily. See [native or organic strategy](/guide/strategy-native-or-organic).`,
    sources: ['GN-22', 'GN-71', 'GN-72', 'GN-73', 'GN-74', 'GN-75', 'GN-76', 'GN-77', 'GN-78', 'GN-79'],
    terms: [
      { term: 'Rice bran', tagalog: 'darak', meaning: 'The outer layer milled off rice grain; a high-energy local feed usable up to 30 percent of a grow-finish diet.' },
      { term: 'Madre de agua', meaning: 'Trichanthera gigantea, a tree whose leaves (15.8 percent crude protein) are fed fresh or as leaf meal at 5 to 15 percent of the diet.' },
      { term: 'Swill', meaning: 'Kitchen, catering and food waste fed to pigs; a known route for African swine fever, banned from ports and airports nationwide.' },
    ],
  },
  {
    id: 'water',
    section: 'feeding',
    title: 'Water',
    summary: 'How much water each stage drinks, the water-to-feed ratio, drinker flow rates and how many pigs per drinker the Philippine standard allows.',
    body: `## Water to feed

Pigs drink about 2 to 3 kg of water for every kg of dry feed. The ratio falls with age: 3.3 to 1 at 17 to 26 kg, 2.1 to 2.6 to 1 at 90 to 102 kg on nipple drinkers, and 1.5 to 1.8 to 1 with bowls or wet-dry feeders in late finishing (GN-80). The research records only international figures here; no Philippine source gives water intake by stage, and it lists that as an open question.

## Daily volumes by stage

| Stage | Water per head per day |
|---|---|
| Suckling piglet | about 44 mL at first, rising to about 355 mL by 28-day weaning (Kansas State figure; no parameter row) |
| Newly weaned pig | under 1.9 L (GN-81) |
| Grow-finish pig | over 5.7 L, more in heat (GN-82) |
| Gestating sow | 11 to 23 L (GN-83) |
| Lactating sow | 19 to 38 L; averages of 37.5 L documented (GN-84) |

A lactating sow drinks ten times what a newly weaned pig drinks.

## Drinkers

- Flow rate: 0.5 L per minute in the nursery, 1.0 L per minute in grow-finish, 1.0 to 2.0 for the breeding herd (GN-85).
- Pigs per drinker (PAES 401, Philippine standard): one nipple per 10 nursery pigs and per 12 to 15 growing-finishing pigs; one automatic cup per 20 weaners, per 12 gilts and per 10 sows (GN-86).
- Nipple height (PAES 401): 305 mm for weanlings, 450 to 650 mm for growing-finishing pigs and sows (GN-86).

A fall in daily water use is an early health signal (GN-80). Checking every drinker is on the [daily checklist](/guide/daily-checklist). Supply, tanks and pressure are in [water and electricity](/guide/water-and-electricity), and hot-weather intake in [ventilation and heat stress](/guide/ventilation-and-heat-stress).`,
    sources: ['GN-80', 'GN-81', 'GN-82', 'GN-83', 'GN-84', 'GN-85', 'GN-86'],
  },
  {
    id: 'feeding-management',
    section: 'feeding',
    title: 'Feeding management',
    summary: 'Free-choice versus measured feeding by stage, feeder and trough space, floor space, and how to change feeds without diarrhoea.',
    body: `## Free choice or measured

- **Lactating sows** are fed free choice (ad libitum) from farrowing in all three Philippine brand guides and in PIC's recommendation. Stepping the feed up over the first 5 to 8 days reduces the sow's total lactation intake, so do not hold her back (GN-50). Brand guides say 4.5 kg or more per day; the general target is 7.9 to 8.8 kg. PIC data show piglet gain rising and the wean-to-heat interval falling from 6.3 to 4.3 days as the sow's lactation intake rises from 3.18 to 9.07 kg per day (GN-51). See [lactation and weaning](/guide/lactation-and-weaning).
- **Gestating sows** are restricted to 1.8 to 3.5 kg per day by body condition (GN-47, GN-48). See [gestation and pregnancy check](/guide/gestation-and-pregnancy-check).
- **Growing pigs** on the Philippine brand guides get measured daily amounts by age, as listed in [feed phases](/guide/feed-phases). PIC instead feeds growers free choice from adjusted feeders with 35 to 50 percent of the pan covered (GN-87). Daily intake near 4 percent of body weight signals normal appetite (GN-42).
- **Backyard practice** reported by PIDS is wet feeding with controlled rations and water always available.

## How often

Native-pig raisers in the Cordillera fed boiled sweet potato and farm by-products twice daily. The brand guides give daily totals, not a number of feedings.

## Feeder and trough space

Dry feeders (general): 2.5 cm of feeder length per head in the nursery (15 pigs per 38 cm feeder hole) and 4.7 to 5.0 cm per head in grow-finish (8 pigs per hole). Wet-dry feeders 2.9 to 3.1 cm per head. A single feeder space should be at least 38 cm wide. Feeder capacity 1.1 kg per pig per day in the nursery, 3.2 kg in grow-finish (GN-87).

Trough length (PAES 401, Philippine standard):

| Pig weight (kg) | Trough length per pig (mm) |
|---|---|
| 15-25 | 150 |
| 25-50 | 200 |
| 50-75 | 250 |
| 75-100 | 300 |
| 100-130 | 350 |

The trough should be at least 300 mm wide and 250 mm deep (GN-88).

Floor space (PAES 401): 0.11 m2 per pig up to 10 kg, rising by band to 0.85 m2 at 81 to 100 kg; 1.0 m2 per gilt, 1.2 m2 per gestating sow (GN-89). The full band table is in [pen space by stage](/guide/pen-space-by-stage).

## Changing feeds

Abrupt phase changes are associated with diarrhoea in growers. Some Philippine producers stay on grower feed from three months to sale to avoid it (GN-40). The research gives no other transition rule.

## Hot weather

The research covers heat only through water: grow-finish pigs drink over 5.7 L per day and more in heat (GN-82). Keep drinkers flowing; see [ventilation and heat stress](/guide/ventilation-and-heat-stress). It gives no separate feeding schedule for hot days.`,
    sources: ['GN-40', 'GN-42', 'GN-47', 'GN-48', 'GN-50', 'GN-51', 'GN-79', 'GN-82', 'GN-87', 'GN-88', 'GN-89'],
    terms: [{ term: 'Ad libitum', meaning: 'Free-choice feeding: the pig eats as much as it wants, with feed always in the feeder.' }],
  },
  {
    id: 'judging-target-weight',
    section: 'feeding',
    title: 'Judging target weight',
    summary: 'How to tell when a batch has reached its target: heart-girth tape, weight-for-age checkpoints, appetite, and why sale weight is set by margin rather than feed conversion alone.',
    body: `## Weigh, or measure the heart girth

A scale is best. Without one, a cloth tape around the heart girth, directly behind the front legs, predicts weight well. Average three readings, and do not measure pigs that were recently transported or off feed and water (GN-90).

- Metric formula for smallholder market-age pigs (mean 40 kg): live weight in kg = 1.222 x heart girth in cm - 52.834, with a standard error of 3.7 kg. For younger pigs: 0.807 x girth - 26.931, a looser fit (GN-91).
- Imperial formula from Kansas State, 100 pigs of 50 to 273 lb: weight in lb = 10.1709 x girth in inches - 205.7492, within 10 lb 95 percent of the time; the published table runs from 25 inches (49 lb) to 48 inches (282 lb) at roughly 10 lb per inch (GN-90).

The app estimates weight today and the date to target from your weighings and the batch's daily gain; see [growth tracking](/guide/growth-tracking). Enter a tape estimate as a weighing if you have no scale.

## Weight-for-age checkpoints

Compare the batch against the Philippine brand guides: 5 to 8 kg at 21 to 35 days, 8 to 12 kg at 35 to 50 days (GN-02), 25 kg at about 83 days, 60 kg at about 137 days and 80 kg at about 145 days (GN-35); PIC schedules 22.5 kg by 63 days (GN-36). A batch well behind these is gaining below the [average daily gain](/guide/average-daily-gain) benchmarks.

## Appetite

Daily feed intake near 4 percent of body weight signals normal appetite (GN-42). A fall in daily water use is an early health signal (GN-80).

## When to stop feeding

Feed conversion worsens above 3 to 1 in finishing and rose from 3.46 to 4.09 between 109 and 127 kg, so each extra kilogram costs more feed than the last (GN-29). Removing the heaviest 25 percent of a pen 19 days before sale saved about 7.7 kg of feed per pig (GN-29).

Philippine value-chain data nonetheless show returns improving with weight: a return to cost of -0.7 percent at 80 kg against 19.3 percent at 120 kg (MADECOR 2013, cited in the DA roadmap), because of price and yield (GN-92). So set the target weight by margin, not by feed conversion alone.

## The buyer's window

The roadmap calls 80 kg the average marketable weight and notes that selling at 80 kg was unprofitable in that study. National monitoring recorded an average weight sold of 92.13 kg in 2018, and PIDS reports 90 to 100 kg with a 95 kg average; medium and large farms sell at 100 kg (GN-08). Buyers pay per kg liveweight or per head depending on the channel; see [pricing units](/guide/pricing-units), [price levels](/guide/price-levels) and [timing strategy](/guide/strategy-timing).`,
    sources: ['GN-02', 'GN-08', 'GN-29', 'GN-35', 'GN-36', 'GN-42', 'GN-80', 'GN-90', 'GN-91', 'GN-92'],
    terms: [{ term: 'Heart girth', meaning: 'The circumference of the pig measured with a tape directly behind the front legs; used to estimate live weight without a scale.' }],
  },
]

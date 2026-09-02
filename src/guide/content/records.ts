import type { GuideArticle } from '../types'

export const RECORDS: GuideArticle[] = [
  {
    id: 'standard-records',
    section: 'records',
    title: 'The standard records',
    summary: 'The fourteen records a pig farm keeps, what each one holds, and where each lives in Oinkonomics.',
    body: `## Two kinds of record

Philippine extension advice splits farm records into technical records (the sow's age, farrowing dates, piglet counts) and economic records (the price of meat, of weanlings, of feed), and insists record keeping must be simple and precise. The FAO Farm Business School adds seven business records: production, labour, cash in, cash out, home consumption, profit and loss, and fixed assets. The research assembled the record set below from those sources, from the PigCHAMP sow variables and from the PIC treatment and mortality logs.

## Where each record lives in the app

| Record | What it holds | Where it lives in Oinkonomics |
|---|---|---|
| Sow card | One card per female: entry, every service, returns, pregnancy check, farrowing with the born split, weaning, removal | Herd: animals and events |
| Boar record | Boar id, entry, service log by sow, removal | Herd: animals and events |
| Farrowing record | Sow, parity, date, total born, born alive, stillborn, mummified | Herd: litters |
| Litter record | Fostering, processing dates, pre-weaning deaths, weaning count and weight, piglets sold or transferred | Herd: litters and events |
| Batch closeout | Date in, head in, weight in, feed issued, weighings, deaths, culls, treatments, sales out, days on feed | Herd: batches, events and sales |
| Feed record | Purchases (date, type, kg, price, supplier) and daily or weekly issue by pen | Inventory: items and stock moves; Finance: transactions |
| Treatment log | Date, animal or pen, number treated, drug, dose, withdrawal end date, person, cost | Herd: events |
| Mortality record | Date, animal or pen, class, number, weight, cause, disposal | Herd: events |
| Sales record | Date, class sold, buyer, head, weight, price and unit, value | Herd: sales; Finance: transactions |
| Expense record | Date, category, quantity, unit cost, total, supplier or credit note | Finance: transactions |
| Income record | Date, output, quantity, unit price, total, home consumption | Finance: transactions |
| Inventory and fixed assets | Item, purchase date and price, life in years, salvage value, head count by class, feed and medicine on hand | Herd: animals; Inventory: items and stock moves; Finance: transactions |
| Labour record | Date, activity, people, hours | Finance: transactions (wages paid) |
| Profit and loss | Period income, expenses, profit, depreciation line | Derived from Finance: transactions |
| Price observations | Price of meat, weanlings and feed | Plan: price log |

## The sow card in detail

The commercial sow record is defined by what the benchmark databases compute from it. Every KPI in [breeding KPIs](/guide/kpi-breeding) needs a dated event on the card.

| Field | Required | Why it is there |
|---|---|---|
| Sow id or ear tag | yes | One card per female |
| Entry date into the breeding herd | yes | Gilt non-productive days start counting at entry (RK-05) |
| Service date and sire or AI batch | yes | Total services; the boar record needs the sire |
| Return or repeat date | no | Percent repeat services; the 21-day to 42-day returns ratio, ideal 5:1 (RK-10) |
| Pregnancy check date and result | no | Service-to-conception days |
| Expected farrowing date | derived | Service date plus 114 days, range 109 to 119 (RK-01) |
| Farrowing date and the born split | yes | Total born, born alive, stillborn, mummified |
| Weaning date, pigs weaned, litter weight | yes | Weaning age, pigs weaned per litter, litter weaning weight (RK-02) |
| Wean-to-service interval | derived | Next service minus weaning; 4 to 5 days is normal (RK-03) |
| Removal date and reason | yes | Death or cull; sow death rate and culling rate |
| Cull sale value | no | Salvage value inside breeding-stock depreciation |

The research found no published Philippine sow card, boar card or farrowing sheet online, so the sow card above is reconstructed from the PigCHAMP variable list and the non-productive-day components. No published boar-card template was located either; the boar record is the minimum the KPIs need, with the note that one boar serves 25 to 30 sows by natural mating (RK-60) and is depreciated over 2.5 years (RK-57).

## The growing-pig records

PIC's wean-to-finish manual prints a treatment log and a mortality log per batch with weekly and cumulative totals, and asks for daily water consumption and high and low temperature. The batch closeout needs feed issued and weighings so feed conversion can be computed, and days on feed to the sale weight, which runs 160 to 176 days from weaning to 113 to 127 kg in the general source (RK-39). The grow-finish cull rate target is 0.5 to 2 percent (RK-37).

The treatment log's withdrawal end date is there because a lack of formal medicine recording was a barrier to observing withdrawal periods on smallholder farms. See [withdrawal periods](/guide/withdrawal-periods). The mortality record carries the class (suckling, weaner, grower-finisher, sow, boar) because each stage has its own mortality KPI, and a disposal method for ASF biosecurity; new pigs in quarantine for 14 to 30 days get a daily sick-and-dead entry (RK-63). See [how the app works](/guide/how-the-app-works) for how these records feed the figures the app shows.`,
    sources: ['RK-01', 'RK-02', 'RK-03', 'RK-05', 'RK-10', 'RK-37', 'RK-39', 'RK-57', 'RK-60', 'RK-63'],
  },
  {
    id: 'kpi-breeding',
    section: 'records',
    title: 'Breeding and sow KPIs',
    summary: 'The figures professionals compute from the sow card: pigs weaned per sow per year, litters, non-productive days, farrowing rate, born alive, pre-weaning mortality, culling and replacement.',
    body: `## The definitions

Breeding-herd KPIs are reported per farm per year, or per quarter, with the mean, median and 10th-percentile tails across farms. The research could not locate an explicit formula for farrowing rate or pre-weaning mortality in a primary source; the values are sourced, the formulas are open questions.

| KPI | Formula | Window | Unit |
|---|---|---|---|
| Pigs weaned per mated female per year (PSY) | Reported by PigCHAMP as pigs weaned per mated female per year; default 28.2 (RK-11) | 12 months, also quarterly | pigs |
| Pigs sold per sow per year | Pigs sold / average sows / year, the Philippine headline measure; default 19.05 (RK-12) | 12 months | pigs |
| Litters per sow per year | 365 / (gestation + lactation + NPD per litter); 365 / (114 + 21 + 35) = 2.44 (RK-07) | 12 months | litters |
| Litter index or sow index (PH) | Farrowings per sow per year; 2.27 baseline, 2.35 theoretical (RK-08) | 12 months | litters |
| Non-productive days (NPD) | 365 - ((gestation days + lactation days) x litters per sow per year); target 35 (RK-06) | 12 months | days per sow per year |
| Lost days per cycle (PH form of NPD) | 365 / litter index - days per cycle; example 182.5 - 155 = 27.5 | per cycle | days |
| Farrowing rate | Reported as a percent; explicit formula not located; default 83 (RK-17) | 12 months | percent |
| Percent repeat services | Repeat services / total services x 100; default 6.0 (RK-18) | 12 months | percent |
| Born alive per litter | Total born alive / sows farrowed; default 14.44 general (RK-13), 10.45 litter size PH (RK-14) | 12 months | pigs |
| Total born, stillborn, mummies per litter | Each total / sows farrowed; stillborn 1.08 (RK-15), mummies 0.69 (RK-16) | 12 months | pigs |
| Pre-weaning mortality | Reported as a percent; explicit formula not located; default 14.3 (RK-19) | 12 months | percent |
| Pigs weaned per litter weaned | Total pigs weaned / sows farrowed and weaned; default 12.72 (RK-20) | 12 months | pigs |
| Weaning age | Average age at weaning; default 21 days (RK-02) | 12 months | days |
| Litter weaning weight | Average litter weight at weaning; 64.1 kg at about 21 days (RK-21) | 12 months | kg |
| Wean-to-estrus or wean-to-service interval | Days from weaning to first heat or to service; 4 to 5 normal (RK-03) | per sow | days |
| Gilt entry-to-service interval | Days from entry to first service; 35 or less (RK-05) | per gilt | days |
| Returns ratio | 21-day returns : 42-day returns; ideal 5:1, problem below 3:1 (RK-10) | 12 months | ratio |
| Sow death rate | Sow and gilt deaths as a percent; 12.5 (RK-22) | 12 months | percent |
| Culling rate | Sows and gilts culled as a percent; 42.2 (RK-23) | 12 months | percent |
| Replacement rate | Females entered relative to the herd; may average 50 percent (RK-24) | 12 months | percent |

## What a small raiser should watch

Two figures carry the sow herd. The first is pigs sold (or weaned) per sow per year: it rolls up litters per year, born alive and pre-weaning deaths into one number, and the Pork Information Gateway names it the overall herd efficiency measure. The second is non-productive days: any day a sow or an entered gilt is neither pregnant nor nursing. Each non-productive day costs about 0.074 pigs when litters wean 10 (RK-09), so a sow that returns to heat late or is served late loses piglets before she ever farrows. Watch the wean-to-service interval (RK-03) and the gilt entry-to-service interval (RK-05); both are days you can see on the sow card.

Farrowing rate and pre-weaning mortality tell you where the rest goes. Read them only on enough history: hold at least 10 weeks of weekly data or 12 months of monthly averages before reading a trend (RK-62). See [the sow year and litters](/guide/sow-year-and-litters), [heat and service](/guide/heat-and-service) and [culling and replacement](/guide/sow-culling-and-replacement) for the management side, and [benchmarks](/guide/kpi-benchmarks) for the excellent, average and poor values.`,
    sources: ['RK-02', 'RK-03', 'RK-05', 'RK-06', 'RK-07', 'RK-08', 'RK-09', 'RK-10', 'RK-11', 'RK-12', 'RK-13', 'RK-14', 'RK-15', 'RK-16', 'RK-17', 'RK-18', 'RK-19', 'RK-20', 'RK-21', 'RK-22', 'RK-23', 'RK-24', 'RK-62'],
    terms: [
      { term: 'PSY', meaning: 'Pigs weaned per mated female per year, the commercial headline measure of sow productivity as reported by PigCHAMP.' },
      { term: 'NPD (non-productive days)', meaning: 'Any day a sow, or a gilt once entered into the breeding herd, is neither pregnant nor nursing a litter; 365 minus (gestation plus lactation) times litters per sow per year.' },
      { term: 'Litter index (sow index)', meaning: 'The Philippine name for farrowings per sow per year; the DA roadmap gives a theoretical 2.35.' },
    ],
  },
  {
    id: 'kpi-growth',
    section: 'records',
    title: 'Growth KPIs',
    summary: 'Average daily gain, feed conversion, mortality by stage, days on feed and market weight: formula, window and unit.',
    body: `## The definitions

Grow-finish KPIs are reported by stage (nursery, grow-finish, wean-to-finish) with target, expected and intervention levels. They come from the batch closeout: weights in and out, feed issued, deaths and the sale date.

| KPI | Formula | Window | Unit |
|---|---|---|---|
| Average daily gain (ADG) | (weight out - weight in) / days on feed; PH default 571 g per day (RK-29) | per batch or stage | kg per day |
| Feed conversion (F/G, FCR) | Feed consumed / liveweight gain; PH default 3.19 (RK-33) | per batch or stage | kg per kg |
| Nursery, grow-finish, wean-to-finish mortality | Deaths / pigs placed x 100 by stage; 2.0, 2.5 and 4.5 percent expected (RK-34, RK-35, RK-36) | per batch | percent |
| Cull rate (grow-finish) | Culls / pigs placed x 100; 1.0 expected (RK-37) | per batch | percent |
| Days on feed, days to market | Days from placement to sale at the target weight; 20 to 24 weeks from birth PH (RK-39) | per batch | days |
| Market weight | Average liveweight sold; 90 to 100 kg PH default (RK-40) | per batch | kg |

## Reading them

Stage matters. Nursery pigs (5.5 to 28.6 kg) gain about 0.473 kg a day on 1.46 kg of feed per kg (RK-26, RK-30); grow-finish pigs (27 to 126 kg) gain about 0.927 kg a day on 2.59 (RK-27, RK-31); the whole wean-to-finish run averages 0.782 kg a day on 2.37 (RK-28, RK-32). Those are general commercial targets. The Philippine figures are lower: ADG 500 g on small farms in 2009, 571 g nationally in 2018, with a 2026 target of 850 g (RK-29); FCR 3.3 on small farms in 2009, 3.19 as the 2020 baseline, 2.27 as the 2026 target (RK-33).

Feed efficiency worsens with weight, so FCR must be read against the end weight. The cumulative wean-to-finish feed-to-gain runs from 2.59 at 113 kg to 2.73 at 127 kg (RK-32). Days on feed to a given market weight is the third leg of the same closeout: 160 days to 113 kg, 176 to 127 kg in the general source, 5 to 6 months from birth at 650 g ADG in the DA roadmap (RK-39).

The Philippine mortality figure is one number for the whole growing herd, not split into pre-weaning and post-weaning: 9.18 percent nationally in 2018, 3 to 7 percent by farm size in 2009, 5 percent as the 2026 target (RK-38). The general benchmarks split it by stage.

Market weight decides the return. The roadmap recommends 100 to 110 kg; 80 kg sold by small farms in 2009 was called non-profitable at a return to cost of minus 0.7 percent, against 19.3 percent at 120 kg (RK-40). Carcass recovery runs 75 percent on small farms to 80 on large (RK-41).

See [average daily gain](/guide/average-daily-gain), [feed conversion and days to weight](/guide/feed-conversion-and-days-to-weight), [mortality benchmarks](/guide/mortality-benchmarks) and [judging target weight](/guide/judging-target-weight) for how the app tracks each one.`,
    sources: ['RK-26', 'RK-27', 'RK-28', 'RK-29', 'RK-30', 'RK-31', 'RK-32', 'RK-33', 'RK-34', 'RK-35', 'RK-36', 'RK-37', 'RK-38', 'RK-39', 'RK-40', 'RK-41'],
    terms: [
      { term: 'ADG (average daily gain)', meaning: 'Weight out minus weight in, divided by days on feed, in kg or g per day.' },
      { term: 'FCR (feed conversion ratio, F/G)', meaning: 'Kilograms of feed consumed per kilogram of liveweight gained; worsens as pigs get heavier.' },
    ],
  },
  {
    id: 'kpi-costs-and-margins',
    section: 'records',
    title: 'Cost and margin KPIs',
    summary: 'Feed cost per kg gain, cost per weaner and per finisher, cost per kg liveweight, feed cost share, income over feed cost, gross margin, farm profit, break-even price and yield.',
    body: `## The definitions

AHDB names four KPI families for pork: financial, survivability, productivity and yield, and calls financial performance the most important, because maximising the others becomes unsustainable if production costs exceed product value.

| KPI | Formula | Window | Unit |
|---|---|---|---|
| Feed cost per kg gain | F/G x feed price per kg (PIC); or total feed cost / total kg produced (FAO) | per batch or enterprise | ₱ per kg |
| Feed cost per piglet produced | Sow feed cost per cycle, including lost-day feed, / piglets produced; ₱920.10 (DA roadmap, 2022 prices) (RK-45) | per cycle | ₱ |
| Cost per weaner produced, per finisher produced, per kg liveweight | Total cost / units produced (DA template rows); backyard ₱103.78 per kg liveweight (PIDS, 2018 prices) (RK-47) | per year | ₱ |
| Feed cost share | Feed cost / total production cost x 100; 65 to 80 percent PH (RK-46) | per year | percent |
| Income over feed cost (IOFC) | (price per kg live x weight gain) - (feed cost per kg gain x weight gain) | per pig | ₱ |
| Income over feed and facility cost (IOFFC) | IOFC - (cost per pig space x days in phase) | per pig | ₱ |
| Income over total cost, live (IOTCL) | (price per kg live x market weight) - (feed cost + other costs + feeder pig cost) | per pig | ₱ |
| Income over total cost, carcass (IOTCC) | (price per kg carcass x market weight x percent yield) - (feed + other + feeder pig cost); recovery 78 percent PH (RK-41) | per pig | ₱ |
| Gross margin | Value of production - variable costs | per enterprise per period | ₱ |
| Farm profit | Total gross margin - total fixed costs | per period | ₱ |
| Net farm family income | Farm profit - imputed family labour | per period | ₱ |
| Break-even price | Total variable costs / yield (FAO Farm Business School); total costs per pig sold / weight sold (Kansas State, to cover total costs) | per period | ₱ per kg |
| Break-even yield | Total variable costs / unit price | per period | kg or head |
| Returns over total costs | Gross returns per pig sold - total costs per pig sold | per pig | ₱ |

## What the Philippine sources report

Feed is 65 to 80 percent of production cost depending on the management system (RK-46). PIDS puts cost per kg liveweight at ₱103.78 for a 40-head backyard fattener against ₱78.68 for a 1,408-head commercial farm (table, 2018 prices; the text of the same report quotes ₱107.71 against ₱81.62), feed at 36.9 percent of backyard operating cost (land rent 31 percent) against 57.4 percent commercial, and net return per kg liveweight ₱14.22 backyard against ₱39.32 commercial (RK-47). Which of the two PIDS pairs to adopt is an open question in the research.

The DA roadmap's Batangas-price budgets give cost per kg liveweight of ₱93.16 (farrow-to-finish) to ₱96.87 (finisher and paiwi), a net return of ₱1,515.78 per farrow-to-finish pig at 90 kg and ₱110 per kg, and ₱761 to ₱2,261 per weaner (DA roadmap, 2022 prices) (RK-47, RK-64). Its sow feed cost reaches the piglet as ₱920.10 per piglet produced and ₱1,022.33 per finisher produced (2022 prices) (RK-45).

Two cautions from the sources. Value of production includes pigs eaten at home or kept, not only sales, so gross margin is not the same as cash. And family labour is valued at what hired labour would cost when comparing enterprises, which is why net farm family income sits below farm profit.

The app computes its own versions of cost per kg gained, cost per weaned piglet and break-even; see [unit costs and break-even](/guide/unit-costs-and-break-even) for those formulas, [money rules](/guide/money-rules) for what counts as revenue and expense, and [smallholder economics](/guide/smallholder-economics) for the wider picture.`,
    sources: ['RK-41', 'RK-45', 'RK-46', 'RK-47', 'RK-64'],
    prices: true,
    terms: [
      { term: 'IOFC (income over feed cost)', meaning: 'Sale value of the weight gained minus the feed that produced it: (price per kg live x gain) minus (feed cost per kg gain x gain), per pig.' },
      { term: 'Gross margin', meaning: 'Value of production minus variable costs, for one enterprise over one period; farm profit is the total gross margin minus fixed costs.' },
    ],
  },
  {
    id: 'kpi-capital',
    section: 'records',
    title: 'Capital and return KPIs',
    summary: 'Asset turnover, rate of capital turnover, net return on investment, net cash flow, IRR and NPV, and simple payback: formula, window and unit.',
    body: `## The definitions

These measure the money tied up in the farm against what it earns. They need the fixed asset record (item, purchase date, price, life in years) and the cash book.

| KPI | Formula | Window | Unit |
|---|---|---|---|
| Asset turnover | Gross returns per pig / investment (Kansas State) | per year | ratio |
| Rate of capital turnover | Value of farm production / total capital used (FAO benchmarking guide) | per year | ratio |
| Net return on investment | (returns over total costs + interest on breeding herd + interest on buildings and equipment + interest on operating costs) / investment | per year | percent |
| Net cash flow | Cash inflow - cash outflow per month or quarter | monthly or quarterly | ₱ |
| IRR and NPV | Multi-year cash flows discounted at 10 percent, the PIDS convention (RK-61) | project life | percent, ₱ |
| Simple payback | The DA budget template has a payback period row and a return on investment row but leaves both blank and does not define them; a sourced definition is still an open question | | |

## Reading them

The Kansas State budget charges interest on the breeding herd, on buildings and equipment, and on operating costs, and puts all three back into the numerator of net return on investment. The interest on operating costs is charged on one-half of operating costs (RK-59). Investment there is buildings and equipment plus the breeding herd, depreciated straight-line: buildings over 25 years with 10 percent salvage (RK-54), equipment over 15 years with none (RK-55), sows over 1.8 years (RK-56) and boars over 2.5 (RK-57). Insurance is about 1.0 percent of investment per year (RK-58).

PIDS evaluates the enterprise by IRR and NPV at a 10 percent discount rate (RK-61), and treats building and vehicle as investment cost with everything else as operating cost. On that basis a commercial farm returned an IRR of 139 to 144 percent over 6 years against minus 3 to 2 percent for a backyard farm over 3 years (PIDS, 2018 prices). Backyard housing is depreciated over 3 years in the Philippines, commercial housing over 6 to 10 (RK-54).

Net cash flow is the one figure here that a cash book alone gives you. FAO's guide warns that cash flow is not the same as profitability: a month can be cash-positive while the enterprise loses money once depreciation and family labour are counted. The Pork Information Gateway names return on equity as the financial measure of the herd, alongside pigs marketed per sow per year for efficiency.

The app's ROI, payback and peak capital figures are defined in [capital and payback](/guide/capital-and-payback). See also [projection assumptions](/guide/projection-assumptions) and [money rules](/guide/money-rules).`,
    sources: ['RK-54', 'RK-55', 'RK-56', 'RK-57', 'RK-58', 'RK-59', 'RK-61'],
    prices: true,
  },
  {
    id: 'kpi-benchmarks',
    section: 'records',
    title: 'KPI benchmarks',
    summary: 'Excellent, average and poor values for each KPI, with the context (Philippine or general commercial) and the year of the figure.',
    body: `## How to read the table

"General" rows are commercial-industry figures from North America (PigCHAMP 2025 year-end, 149 farms; 2024, 174 farms) and from PIC's 2019 grow-finish targets. For PigCHAMP rows, excellent is the upper 10th percentile for figures you want high and the lower 10th for figures you want low. "PH" rows come from the DA hog roadmap's 2009 ASEAN comparison by farm size, its 2018 national monitoring and its 2020 baseline with 2026 targets, and from PIDS at 2018 prices. Philippine "mortality" is not split into pre-weaning and post-weaning. Peso figures carry the price year of the source.

| KPI | Excellent | Average | Poor | Context | Year |
|---|---|---|---|---|---|
| Pigs weaned per mated female per year (RK-11) | 36.11 (upper 10) | 28.19 mean, 28.49 median | 20.21 (lower 10) | general | 2025 |
| Pigs weaned per mated female per year | 34.33 | 28.57 | 22.70 | general | 2024 |
| Pigs sold per sow per year (RK-12) | 30 (2026 target); 24 (Thailand integrators 2009) | 19.05 (2018 national); 18.29 (2020 baseline) | 13 to 14 (small farms 2009) | PH | 2009 / 2018 / 2020 |
| Liveborn per female per year | 38.36 | 31.68 | 23.50 | general | 2025 |
| Litters per sow per year (RK-07) | 2.44 (35 NPD) | derived, not sourced | | general | 2011 |
| Sow index or litter index (RK-08) | 2.4 (2026 target); 2.35 theoretical | 2.27 (2020 baseline) | 2.0 (roadmap lost-days example) | PH | 2020 |
| Non-productive days (RK-06) | 35 | | 85 (example of a poor herd) | general | 2011 |
| Farrowing rate (RK-17) | 91.53 | 83.15 | 70.19 | general | 2025 |
| Farrowing rate | 92.04 | 83.81 | 71.81 | general | 2024 |
| Farrowing rate | 82 (large farms 2009); 86 (Vietnam large) | 80.44 (2018 national) | 75 (small farms 2009) | PH | 2009 / 2018 |
| Percent repeat services (RK-18) | 0.93 | 6.00 | 12.75 | general | 2025 |
| Total born per litter | 17.63 | 16.21 | 14.79 | general | 2025 |
| Born alive per litter (RK-13) | 15.92 | 14.44 | 13.07 | general | 2025 |
| Litter size at birth (RK-14) | 10.5 (large 2009) | 10.45 (2018 national) | 8 to 9 (small 2009) | PH | 2009 / 2018 |
| Stillborn per litter (RK-15) | 0.66 | 1.08 | 1.57 | general | 2025 |
| Mummies per litter (RK-16) | 0.25 | 0.69 | 1.57 | general | 2025 |
| Pre-weaning mortality, percent (RK-19) | 9.08 | 14.31 | 20.90 | general | 2025 |
| Pigs weaned per litter weaned (RK-20) | 14.14 | 12.72 | 11.23 | general | 2025 |
| Weaning age, days (RK-02) | 18.73 (lower 10) | 21.14 | 24.31 (upper 10) | general | 2025 |
| Weaning age | 4 to 6 weeks recommended; weaning under 56 days allows 4 to 5 farrowings in 2 years | | | PH | undated (2018 upload) |
| Litter weaning weight, kg, 25 farms (RK-21) | 93.5 | 64.1 | 24.0 | general | 2025 |
| Wean-to-estrus interval, days (RK-03) | 4 to 5 normal | | 6 to 12 (lower fertility) | general | 2011 |
| Wean-to-estrus interval | 3 to 7 days after weaning (PH guidance) | | | PH | undated |
| Gilt entry-to-service, days (RK-05) | 35 or less | | | general | 2011 |
| Sow death rate, percent (RK-22) | 6.80 | 12.52 | 19.80 | general | 2025 |
| Culling rate, percent (RK-23) | 22.40 | 42.20 | 58.00 | general | 2025 |
| Replacement rate, percent (RK-24) | | about 50 | | general | 2012 |
| Nursery ADG, kg per day, 5.5 to 28.6 kg (RK-26) | 0.487 (target) | 0.473 (expected) | 0.383 (intervention) | general | 2019 |
| Grow-finish ADG, kg per day, 27 to 126 kg (RK-27) | 0.955 | 0.927 | 0.835 | general | 2019 |
| Wean-to-finish ADG, kg per day (RK-28) | 0.805 | 0.782 | 0.704 | general | 2019 |
| ADG, g per day (RK-29) | 850 (2026 target); 650 (Thailand and Vietnam large 2009) | 571 (2018 national); 561 from birth (2020 baseline) | 500 (small farms 2009) | PH | 2009 / 2018 / 2020 |
| Nursery FCR (RK-30) | 1.31 | 1.46 | 1.66 | general | 2019 |
| Grow-finish FCR (RK-31) | 2.33 | 2.59 | 2.80 | general | 2019 |
| Wean-to-finish FCR (RK-32) | 2.13 | 2.37 | 2.56 | general | 2019 |
| Cumulative wean-to-finish F/G to 113 to 127 kg | 2.59 (113 kg) | 2.63 to 2.68 | 2.73 (127 kg) | general | 2012 |
| FCR, kg feed per kg gain (RK-33) | 2.27 (2026 target); 2.8 (large 2009) | 3.19 (2020 baseline); 3.0 (medium 2009) | 3.3 (small 2009) | PH | 2009 / 2020 |
| Nursery mortality, percent (RK-34) | 1.5 | 2.0 | 3.0 | general | 2019 |
| Grow-finish mortality, percent (RK-35) | 2.0 | 2.5 | 4.0 | general | 2019 |
| Wean-to-finish mortality, percent (RK-36) | 3.5 | 4.5 | 7.0 | general | 2019 |
| Grow-finish cull rate, percent (RK-37) | 0.5 | 1.0 | 2.0 | general | 2019 |
| Mortality, percent, whole growing herd, not split (RK-38) | 5 (2026 target); 3 to 5 (small 2009) | 9.18 (2018 national); 9.10 (2020 baseline) | 20 (Malaysia 2009 comparison) | PH | 2009 / 2018 / 2020 |
| Total herd mortality, percent of population | 2.5 (2026 target) | 3.3 (2020 baseline) | | PH | 2020 |
| Days on feed, wean to market (RK-39) | 160 (to 113 kg) | 165 to 170 | 176 (to 127 kg) | general | 2012 |
| Days to market | 20 to 24 weeks (5 to 6 months) from birth at 650 g ADG | | | PH | 2022 |
| Market weight sold, kg (RK-40) | 100 to 110 (roadmap recommendation); 92 (large 2009) | 92.13 (2018 national) | 80 (small 2009, non-profitable at minus 0.7 percent return to cost) | PH | 2009 / 2018 |
| Market weight | at least 80 kg; 90 to 100 kg finishing | | | PH | undated |
| Carcass recovery, percent (RK-41) | 80 (large) | 78 (medium) | 75 (small) | PH | 2009 |
| Feed cost share of production cost, percent (RK-46) | 65 | 65 to 80 | 80 | PH | 2022 |
| Feed share of operating cost, percent | | 57.4 (commercial, 1,408 head) | 36.9 (backyard 40 head; land rent 31 percent) | PH | 2018 prices |
| Cost per kg liveweight (RK-47) | ₱78.68 (commercial) | ₱93.16 to ₱96.87 (DA Batangas budgets) | ₱103.78 (backyard) | PH | 2018 / 2022 |
| Net return per kg liveweight | ₱39.32 (commercial) | | ₱14.22 (backyard) | PH | 2018 prices |
| Net return per finisher, 90 kg at ₱110 per kg | ₱1,515.78 (farrow-to-finish) | ₱1,181.57 (finisher, paiwi) | | PH | 2022 |
| Net return per weaner (RK-64) | ₱2,261 | ₱1,261 (roadmap text); ₱761 (Table 13) | | PH | 2022 |
| Return to cost by slaughter weight | 19.3 percent at 120 kg | | minus 0.7 percent at 80 kg | PH | 2013 study cited 2022 |
| IRR of enterprise | 139 to 144 percent (commercial, 6-year) | | minus 3 to 2 percent (backyard, 3-year) | PH | 2018 prices |

## Gaps the research names

The commercial litters-per-sow-per-year benchmark rests on one worked example (2.44 at 35 NPD), because the PigCHAMP tables fetched do not print it. No Philippine pre-weaning mortality, weaning weight or wean-to-service benchmark was found. The PSA cost-and-returns pages could not be fetched, so the Philippine cost benchmarks come from DA and PIDS documents. Read your own figures against the closest context, and only on enough history: 10 weeks of weekly data or 12 months of monthly averages (RK-62).

The definitions behind each row are in [breeding KPIs](/guide/kpi-breeding), [growth KPIs](/guide/kpi-growth), [cost and margin KPIs](/guide/kpi-costs-and-margins) and [capital KPIs](/guide/kpi-capital).`,
    sources: ['RK-02', 'RK-03', 'RK-05', 'RK-06', 'RK-07', 'RK-08', 'RK-11', 'RK-12', 'RK-13', 'RK-14', 'RK-15', 'RK-16', 'RK-17', 'RK-18', 'RK-19', 'RK-20', 'RK-21', 'RK-22', 'RK-23', 'RK-24', 'RK-26', 'RK-27', 'RK-28', 'RK-29', 'RK-30', 'RK-31', 'RK-32', 'RK-33', 'RK-34', 'RK-35', 'RK-36', 'RK-37', 'RK-38', 'RK-39', 'RK-40', 'RK-41', 'RK-46', 'RK-47', 'RK-62', 'RK-64'],
    prices: true,
  },
  {
    id: 'cost-allocation-conventions',
    section: 'records',
    title: 'Cost allocation conventions',
    summary: 'How enterprise budgets spread shared costs over pigs: per pig sold, per kg gain, per head-day, and the Philippine percentage rules.',
    body: `## Per pig sold

Enterprise budgets allocate whole-farm items on a per-pig-sold basis. The Kansas State farrow-to-finish budget charges labour as full-time salaries divided by pigs sold per year, building and equipment depreciation and interest per pig sold, insurance at about 1.0 percent of investment per pig sold (RK-58), repairs at 2.5 percent of total investment (RK-49), professional fees as business and miscellaneous costs allocated to the swine enterprise, and interest on operating costs on one-half of operating costs (RK-59).

Breeding-herd cost reaches the piglet the same way. Depreciation = (purchase price - cull value) / years of useful life, computed with a gilt price of USD 221, a cull value of USD 140, a sow life of 1.8 years (RK-56) and a boar life of 2.5 years (RK-57) (Kansas State budget, 2006), then divided over pigs sold. Cull-sow income is treated as salvage value inside depreciation rather than as an increase in returns.

## Per litter, the Philippine way

The DA roadmap charges sow cost to piglets per litter. Sow feed per cycle is 413 kg, ₱9,201 (RK-43), plus lost-day feed of 27.5 lost days x 2 kg per day at a 2.0 litter index, giving a feed cost per piglet produced of ₱920.10 and per finisher produced of ₱1,022.33 (DA roadmap, 2022 prices) (RK-45). Its budget template then converts everything to cost per weaner produced, per finisher produced, per sow and per kg liveweight.

The roadmap's percentage conventions for the smaller lines:

| Cost line | Convention |
|---|---|
| Biologics and medicines | 3 percent of feed cost (RK-48) |
| Repairs and maintenance | 3 percent of feed cost (RK-49) |
| Sundries | 5 percent of feed cost (RK-50) |
| Labour | ₱350 per day for 4 hours per day (DA roadmap, 2022) (RK-51) |
| Water and electricity | ₱100 per month (DA roadmap, 2022) (RK-52) |

## Per kg gain and per head-day

Per-kg-gain allocation is the convention for feed: feed cost per kg gain = F/G x feed price, or total feed cost / total kg produced. Per head-day is what PIC's facility term uses: cost per pig space x days in the phase. Penn State's small-herd inputs give a labour base for a head-day or per-sow split: 16 hours a week for a 20-sow farrow-to-finish unit, 11 for farrow-to-feeder, 5 for a 100-head finisher, about 500 hours a year per 20-sow unit (RK-53).

## What FAO says a smallholder should do

Most smallholder costs are variable. Fixed costs shared across enterprises (a store room, equipment) would be difficult to divide, and portions can be allocated only with good information, so smallholders most often need not worry about allocating fixed costs between enterprises. Family labour should nevertheless be valued at what hired labour would cost when comparing enterprises.

The app's own rule for spreading shared costs over pigs is in [cost allocation](/guide/cost-allocation); the head-days it uses are defined in [money rules](/guide/money-rules), and the resulting unit costs in [unit costs and break-even](/guide/unit-costs-and-break-even).`,
    sources: ['RK-43', 'RK-45', 'RK-48', 'RK-49', 'RK-50', 'RK-51', 'RK-52', 'RK-53', 'RK-56', 'RK-57', 'RK-58', 'RK-59'],
    prices: true,
  },
  {
    id: 'farm-accounting-conventions',
    section: 'records',
    title: 'Farm accounting conventions',
    summary: 'The simple rules farm enterprise budgets use: cash book versus profit, capital versus operating cost, straight-line depreciation, family labour, and what counts as fixed and variable.',
    body: `## Cash versus profit

FAO's extension economics guide separates cash flow (money in from sales, money out for purchases, netted monthly or quarterly) from profit (value of production, including produce consumed at home or stored, less variable and fixed costs), and warns that cash flow is not the same as profitability. The FAO Farm Business School record set is effectively a cash-basis book: a cash inflow record and a cash outflow record, with a home-consumption record and a period profit-and-loss record layered on top. That is the practical smallholder pattern: cash book first, then a profit statement at period end that adds home consumption and inventory change.

## Capital versus operating

The DA budget separates cash cost (feeds, animal, biologics, wages, water and electricity, breeding, repairs, sundries) from non-cash cost, which is depreciation of building and equipment, and reports total cost, cost per kg liveweight, net return, return on investment and payback period. PIDS treats building and vehicle as investment cost and everything else as operating cost, and evaluates the enterprise by IRR and NPV at a 10 percent discount rate (RK-61). FAO's smallholder booklet lists start-up (capital) costs as housing, equipment, fencing and breeding stock, and production costs as labour, feed, water, veterinary and medicines, plus marketing costs (transport, market fees).

## Fixed and variable

Gross margin is value of production less variable costs; farm profit is total gross margin less total fixed costs; net farm family income is farm profit less the imputed cost of family labour. Most smallholder costs are variable. Family labour is not a cash cost, but it is valued at what hired labour would cost when comparing enterprises.

## Depreciation and useful lives

Straight-line: (purchase price - salvage) / years. The conventions the sources use:

| Asset | Life | Salvage | Source |
|---|---|---|---|
| Buildings | 25 years (RK-54) | 10 percent | Kansas State, 2006 |
| Backyard pig housing, Philippines | 3 years (RK-54) | | PIDS |
| Commercial pig housing, Philippines | 6 years (text: 6 to 10) (RK-54) | | PIDS |
| Equipment | 15 years (RK-55) | none | Kansas State, 2006 |
| Sows | 1.8 years (RK-56) | cull value | Kansas State, 2006 |
| Boars | 2.5 years (RK-57) | | Kansas State, 2006 |

The Farm Business School fixed-asset record stores item, date of purchase, purchase price and life in years, which is all a straight-line schedule needs.

## Valuing the herd

Cull-sow value is the salvage value of the breeding animal. PIDS values fattener stock at purchase cost. No primary source in the research states a rule for valuing growing pigs on hand at period end; that is an open question.

## What goes in the statements

The Farm Business School profit and loss is income (sales, home consumption, other) less expenses (inputs and materials, operations). The Kansas State budget is the fuller enterprise version: gross returns per pig sold (market hogs plus cull breeding stock), less death loss, feed by ration, veterinary and medicine, utilities and fuel, marketing, labour, breeding-herd depreciation, semen, interest on the breeding herd, repairs, insurance, professional fees, building and equipment depreciation and interest, and interest on operating capital; then returns over total costs, break-even price, feed cost per unit sold, asset turnover and net return on investment. The cash-flow budget adds timing by month or quarter.

The app follows the cash-book pattern. Its rules for what counts as revenue, expense, cash and profit are in [money rules](/guide/money-rules); the derived figures are in [unit costs and break-even](/guide/unit-costs-and-break-even) and [capital and payback](/guide/capital-and-payback).`,
    sources: ['RK-54', 'RK-55', 'RK-56', 'RK-57', 'RK-61'],
  },
  {
    id: 'what-smallholders-record',
    section: 'records',
    title: 'What smallholders actually record',
    summary: 'What the studies found small raisers write down, why it matters, and the minimum set of records worth keeping.',
    body: `## The gap

In San Simon, Pampanga, a participatory study of smallholder pig producers found that limited record keeping meant farmers were unable to assess the productivity and profitability of their pig farming enterprises. The agreed response was a record-keeping workshop with a small group of innovative farmers to develop a useful and usable tool. FAO's benchmarking guide reports the same gap generally: farmers do not record data in sufficient detail to allow meaningful comparisons, and they begin keeping records once a benchmarking group shows the value.

The studies also show what the missing records cost:

- On Kenyan smallholder pig farms, a lack of formal medicine recording was a barrier to honouring antibiotic withdrawal periods. See [withdrawal periods](/guide/withdrawal-periods).
- Among Kenyan smallholder dairy farmers, decisions made from records significantly affected output, but farmers' education was not sufficient for making complex computations. That points to the app doing the arithmetic.
- A 2026 South African study found most smallholders kept informal records but few kept formal financial records. Record keeping was driven by education, extension access, credit, farm size, group membership and financial training, and keeping records raised income significantly.

## What programmes actually issue

The forms that smallholder programmes hand out are short. FAO's ASF smallholder guideline makes daily morbidity and mortality the one health record every farm should keep, and asks for it daily during the 14 to 30 day quarantine of new pigs (RK-63). The DA Cagayan Valley manual keeps its only printed form to sales: date, number of head, age, total weight, value, remarks. The Farm Business School forms are one-line-per-event tables with date, item, quantity, unit price, total and comments, with a note to record credit purchases so people cannot cheat you.

## The minimum set

Taken together, the minimum viable set that smallholder programmes issue is:

1. A sow card per breeder.
2. A cash inflow (sales) sheet.
3. A cash outflow (purchases) sheet.
4. A daily sick-and-dead tally.

Everything else is derived. From those four the app can compute litters per year, pigs weaned and sold per sow, mortality, cost per pig and profit, provided the entries are dated and complete. Read trends only on enough history: at least 10 weeks of weekly data or 12 months of monthly averages (RK-62).

In Oinkonomics the sow card is the animal and its events, the two cash sheets are Finance transactions, and the sick-and-dead tally is the death and treatment events. See [how the app works](/guide/how-the-app-works), [the standard records](/guide/standard-records) and the [daily checklist](/guide/daily-checklist).`,
    sources: ['RK-62', 'RK-63'],
  },
]

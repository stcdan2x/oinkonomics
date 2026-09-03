import type { GuideArticle } from '../types'

// How Oinkonomics works: the rules fixed in TASK 001 section 4 (P3 to P7),
// written for the raiser. Every figure the app shows is defined here.
export const APP: GuideArticle[] = [
  {
    id: 'how-the-app-works',
    section: 'start',
    title: 'How Oinkonomics works',
    summary: 'What the app records, where each record lives, and how the numbers on every page are built from those records.',
    body: `## One farm, five sections

Oinkonomics keeps the records of one piggery on this phone or computer and works without a signal. Every page reads the same records, so a sale recorded in the Herd section also appears in the ledger, the reports and the dashboard.

| Section | What you record there | What it shows |
|---|---|---|
| Herd | Sows, gilts and boars one by one; litters from service to weaning; batches of growing pigs with weighings, treatments, deaths and sales | Stage of every sow, the breeding calendar, estimated weights, withdrawal dates |
| Finance | Every peso in and out: expenses, revenue, capital purchases, loans, drawings | Income statement, cash flow, cost and profit per batch, unit costs |
| Inventory | Feed, medicine and supplies: purchases, daily feed use, losses | Stock on hand, low-stock and expiry alerts, feed days left |
| Plan | The prices you are offered, scenarios for a farm you are thinking of running | The recommendation for a batch, break-even prices, side-by-side scenarios |
| Guide | Nothing: it is this reference | The production cycle, feeding, health, housing, markets, strategies, records, permits and tax |

## Records, not opinions

How to use each screen, in the order the farm work happens, is in the [Using the app](/guide/getting-started) section. Every number the app shows comes from a record you entered and a rule written in this Guide. The rules are fixed and explained in the articles of this section: [the breeding calendar](/guide/breeding-calendar), [growth tracking](/guide/growth-tracking), [money rules](/guide/money-rules), [cost allocation](/guide/cost-allocation), [unit costs and break-even](/guide/unit-costs-and-break-even), [stock rules](/guide/stock-rules), [projection assumptions](/guide/projection-assumptions) and [dashboard rules](/guide/dashboard-rules).

## Sources and prices

Where the app uses a figure that is not yours (gestation length, feed conversion, a default price) it comes from the research behind this Guide, and each article lists the source rows it relied on. Published prices are dated observations, never facts about today: read the [price disclaimer](/guide/price-disclaimer) and log your own prices on the Plan page.

## Deleting

Deleting a record hides it and marks it deleted; the app keeps the marker so a later backup or sync can carry the deletion across devices. A sale, a purchase move or a farrowing that other records depend on cannot be deleted from the list; correct the record instead.`,
    sources: [],
  },
  {
    id: 'breeding-calendar',
    section: 'start',
    title: 'The breeding calendar',
    summary: 'How the app turns a service date into the heat check, pregnancy check, farrowing, weaning, rebreeding and piglet-care dates, and how it names the stage of a sow.',
    body: `## From one date, every other date

When you record a service, the app computes the milestones from the service date with the defaults below. Each default has a source row and can be checked against the [production cycle](/guide/milestone-timeline) articles.

| Milestone | Rule | Default |
|---|---|---|
| Heat check (did she return to heat?) | service + 21 days, window 18 to 24 | 21 days (PC-26, PC-09) |
| Pregnancy check | service + 28 days | 28 days (PC-27) |
| Farrowing due | service + gestation | 115 days (PC-24) |
| Weaning due | farrowing + weaning age | 28 days (PC-46, PC-47) |
| Rebreed (watch for heat) | weaning + wean-to-service interval | 5 days (PC-63) |
| Iron shot | day 3 to 14 of age | (HB-70, HB-69) |
| Castrate by | day 3 to 7 of age | (PC-90) |
| Start creep feed | day 14 of age | (PC-62) |

## The sow's stage

The stage shown on a sow's card follows her latest litter:

- **Open**: no open litter; she can be served.
- **Served**: served fewer than 21 days ago.
- **Heat check due**: day 21 to 28 after service; watch for a return to heat.
- **Pregnant**: past day 28 and more than 7 days from the due date.
- **Due soon**: within 7 days of the due date.
- **Overdue**: past the due date with no farrowing recorded (the dashboard flags these).
- **Lactating**: farrowed, not yet weaned.
- **Weaned**: weaned; the next item is the rebreed date.

A litter stays open from service to weaning unless you close it as not pregnant or aborted.

## The calendar

The Calendar tab lists every upcoming milestone for every open litter in date order, and the piglet-care items (iron, castration, creep feed) once the litter has farrowed. The dashboard shows the same items for the next 7 days as alerts. Record what happens on the litter page (farrowing with born alive, stillborn and mummified; weaning with the number weaned) and the calendar moves on. See [heat and service](/guide/heat-and-service) and [farrowing](/guide/farrowing) for what to do at each step.`,
    sources: ['PC-26', 'PC-09', 'PC-27', 'PC-24', 'PC-46', 'PC-47', 'PC-63', 'HB-70', 'HB-69', 'PC-90', 'PC-62'],
  },
  {
    id: 'growth-tracking',
    section: 'start',
    title: 'Growth tracking: weighings, ADG and withdrawal',
    summary: 'How the batch page turns your weighings into average daily gain, the estimated weight today, the date a target weight is reached, and the earliest sale date after a treatment.',
    body: `## Weighings

A batch is a group of pigs raised together: a weaned litter becomes a batch at weaning, or you create one for pigs you bought. Record the average weight of the batch on a date (weigh a few pigs and average them, or use a heart-girth tape: see [judging target weight](/guide/judging-target-weight)). One weighing is a snapshot; two or more let the app measure growth.

## Average daily gain (ADG)

ADG = (latest average weight - first average weight) / days between the two weighings, in kg per day. It uses the first and the latest weighing of the batch. The research benchmark for the grow-out stage is 0.65 kg per day (GN-19, GN-20); see [average daily gain](/guide/average-daily-gain) for what pulls it down.

## Estimated weight today and the date to a target

Estimated weight today = latest average weight + ADG x days since that weighing. The batch page shows the day the batch reaches 90 kg, the typical market liveweight (GN-08), at the current ADG; "not growing" appears when the ADG is zero or negative. The dashboard uses the same estimate to flag a batch as [ready to sell](/guide/dashboard-rules).

## Head count

Deaths and removals reduce the head count on the date you record them, and each is kept as an event, so the dashboard can count deaths in a period and the costing can count head-days. Sales reduce the head count through the sale form.

## Sale allowed from (withdrawal)

Every treatment recorded on a batch or an animal carries a withdrawal period: the days that must pass after the last dose before the pig may be slaughtered for food. The app fills the days from its product table (Philippine label, US label or extension figure, shown next to the field) or takes the days you type from the label. Earliest sale date = last dose date + withdrawal days. The batch page shows "Sale allowed from" with the latest of these dates, and the sale form refuses a sale before it unless you tick that you understand the risk. See [withdrawal periods](/guide/withdrawal-periods) for the table and why it matters.

## Pre-sale segregation

Pigs for sale should be separated 15 days before transport (HB-43); the calendar does not schedule this, so plan it from the ready date.`,
    sources: ['GN-19', 'GN-20', 'GN-08', 'HB-43'],
    kpis: ['adg', 'estimatedWeight', 'saleAllowedFrom'],
  },
  {
    id: 'money-rules',
    section: 'start',
    title: 'Money rules: kinds, categories, income statement and cash flow',
    summary: 'What each transaction kind means, which ones count as profit and which only move cash, and how the Reports tab builds the income statement and the cash flow.',
    body: `## Every peso has a kind and a category

The ledger records every transaction with a date, an amount, a kind and a category.

| Kind | Meaning | Categories |
|---|---|---|
| Expense | Operating cost of running the farm | Feed, medicine and vaccines, boar or AI service, labour, water, electricity, transport, permits and fees, pen repair, equipment, stock purchase (animals), other |
| Revenue | Money the farm earns | Hog sales, breeding service fees, manure and by-products, other income |
| Capital | A purchase that lasts for years: pen construction, equipment, breeding stock | Pen construction, equipment, stock purchase, other |
| Drawing | Money the owner takes out | Owner drawing |
| Loan | Loan money received | Loan received |
| Loan payment | A repayment | Loan repayment |

Capital versus operating is the kind, not the category: a feeder bought to last is capital; the same peso spent on feed is an expense. Stock purchases made from the Inventory section land in the ledger automatically, marked Stock, and cannot be deleted from the ledger (delete the purchase move instead). Sales recorded in the Herd section land as hog-sales revenue the same way. There is nothing tax-related anywhere in the app; for tax see [tax in plain language](/guide/tax-in-plain-language).

## Income statement

The income statement over a period counts only expenses and revenue: **revenue** by category, **expenses** by category, and **net income** = revenue - expenses, which the dashboard calls profit. Capital purchases, loans, repayments and drawings are left out, because they are not the cost of producing pigs.

## Cash flow

The cash flow over the same period counts every kind: operating in (revenue), operating out (expenses), capital purchases, loans received, loan repayments and owner drawings. **Net cash** = everything in - everything out for the period. The opening balance is the sum of every transaction before the period, and the closing balance = opening + net cash. The ledger starts at zero, so the closing balance is the cash the farm should hold if every peso went through the ledger; the dashboard's [cash on hand](/guide/dashboard-rules) is that closing balance.

## Cash basis

Everything is recorded on the date it was paid or received. Feed bought this month is this month's expense even if the pigs eat it next month; the batch costing handles the timing differently, see [cost allocation](/guide/cost-allocation). The standard farm conventions behind this are in [farm accounting conventions](/guide/farm-accounting-conventions).`,
    sources: [],
    kpis: ['revenue', 'expenses', 'netIncome', 'netCash', 'cashOnHand'],
  },
  {
    id: 'cost-allocation',
    section: 'start',
    title: 'Cost allocation: how a batch gets its costs',
    summary: 'Direct costs, shared costs split by head-days, the piglet transfer value for litter-born batches, and how stock use reaches a batch, giving the profit per batch on the Finance page.',
    body: `## Three kinds of cost reach a batch

The Costing card on a batch page and the Batches tab of Finance show the total cost of each batch as the sum of three parts.

1. **Direct costs**: expenses you linked to the batch when you recorded them (a feed purchase for that batch, a vet visit), plus the stock the batch used (below).
2. **Allocated shared costs**: expenses with no batch or animal link, shared out by head-days.
3. **Piglet transfer value**: for a batch weaned from your own sows, what the piglets cost to produce.

Bought batches carry their purchase price as a direct cost instead of a piglet value.

## Head-days

A head-day is one pig for one day. The app counts the head-days of every batch from its start date, following the deaths, removals and sales you recorded, and counts one breeding-herd unit for the sows, gilts and boars: each breeder counts from its purchase or birth date until the date it was culled, sold or died.

## Sharing by month

Shared costs are split one calendar month at a time: each shared expense in a month is divided among the batches alive that month and the breeding herd in proportion to their head-days in that month. A batch that lived 10 days of the month carries a tenth of what one that lived all month carries, per head. Costs that fall in a month with no head-days stay unallocated and the Finance page says so.

## Piglet transfer value

For a litter-born batch, piglet value = head at start x cost per weaned piglet, where the cost per weaned piglet is the breeding herd's cost (its direct costs plus its share of the shared costs) over the batch's start month and the four months before it, divided by the piglets weaned in those months. It is 0 when no breeding-herd cost exists yet. This charges the sow's feed and upkeep to the pigs she produced.

## Stock used

A feed or medicine purchase is an expense on the day you pay, but it reaches a batch only when you record the use: every consumption or loss move is valued at the item's unit cost at that moment (the moving weighted average kept by the [stock rules](/guide/stock-rules)). A move linked to a batch is a direct cost of that batch; a move with no batch link joins the shared pool of its month. Stock bought but not yet used is charged to nobody yet, so a batch is not blamed for the bags still in the store. The ledger itself stays on the cash basis of the [money rules](/guide/money-rules).

## Batch profit

Batch profit = revenue from the batch's sales - (direct + allocated + piglet value). The standard conventions this follows are in [cost allocation conventions](/guide/cost-allocation-conventions).`,
    sources: [],
    kpis: ['headDays', 'allocatedCost', 'pigletValue', 'batchProfit'],
  },
  {
    id: 'unit-costs-and-break-even',
    section: 'start',
    title: 'Unit costs, break-even, ROI and payback',
    summary: 'The formulas behind cost per kg gained, cost per kg sold, cost per weaned piglet, the break-even prices, ROI and the payback date.',
    body: `## Per batch

| Figure | Formula | Where |
|---|---|---|
| Cost per kg gained | (direct + allocated cost) / ((latest average weight - first average weight) x current head count); needs two weighings | Dashboard chart |
| Cost per kg sold | total batch cost / kg sold, once the batch has sales by weight | Costing card |
| Break-even per head | total batch cost / head sold, or / current head count while unsold | Costing card |
| Break-even per kg | total batch cost / kg sold, or / (current head x 90 kg) while unsold (GN-08) | Costing card |

Break-even is the sale price that recovers the whole cost of the batch; anything above it is profit. While the batch is unsold the app assumes every pig reaches the 90 kg market weight, so the figure falls as the pigs get heavier than that and rises if they are sold lighter. Cost per kg gained reads slightly high for a batch with deaths between the weighings, because the gain is multiplied by the head count today.

## Breeding herd

Cost per weaned piglet = breeding-herd cost in the period / piglets weaned in the period, from the Reports tab's unit-costs card. The herd cost is the breeders' direct costs plus their share of the shared costs over the months of the period. Compare it with the weaner price you can get: it is the floor under [selling weaners](/guide/strategy-sell-weaners).

## ROI and payback

ROI = net income of the period / capital spent up to the period end (both from the ledger). Payback: the app walks the ledger in date order, adding revenue and subtracting expenses on one side and adding capital purchases on the other; the first day the operating total catches up with the capital spent is the payback date, shown as "Capital paid back". Loans and drawings do not count. If a later capital purchase or loss puts the operating total back below the capital, the card shows "not yet" again. The standard definitions are in [capital KPIs](/guide/kpi-capital) and [cost and margin KPIs](/guide/kpi-costs-and-margins).`,
    sources: ['GN-08'],
    kpis: ['costPerKgGain', 'costPerKgSold', 'costPerWeanedPiglet', 'breakEvenPerKg', 'breakEvenPerHead', 'roi', 'payback'],
  },
  {
    id: 'stock-rules',
    section: 'start',
    title: 'Stock rules: on hand, purchases, unit cost, alerts and feed days',
    summary: 'How the Inventory section keeps quantities, links a purchase to the ledger, values stock at a moving average, raises alerts and estimates the days of feed left.',
    body: `## Items and moves

An item is anything you keep in stock: a feed by phase, a medicine, a vaccine, a supplement, a supply, a piece of equipment. Its quantity on hand is always the sum of its moves: purchases and adjustments in, consumption and losses out. Every move is dated and stock never goes below zero; a move that would take it negative is refused.

## A purchase writes two records at once

Recording a purchase (item, quantity, total paid) creates the expense in the ledger under the category that matches the item (feed; medicine and vaccines for medicine, vaccine and supplement; other for supplies; equipment for equipment) and the purchase move, linked to each other. The ledger row is marked Stock and cannot be deleted there; deleting the purchase move removes both.

## Unit cost

The item's unit cost is a moving weighted average: after a purchase, unit cost = (value on hand before + total paid) / (quantity before + quantity bought). Each consumption or loss move records the unit cost at that moment, and that is the value the [costing](/guide/cost-allocation) charges to the batch or to the shared pool.

## Feed in bags or kg

Give a feed item its kg per bag and the daily feed page lets you enter kg or bags; the app converts. The daily feed page remembers your last batch, item and quantity so a routine entry is two taps.

## Alerts

- **Low stock**: quantity on hand at or below the item's reorder level.
- **Expiring**: the expiry date is within 30 days and stock is on hand.
- **Expired**: the expiry date has passed and stock is on hand.

Alerts show on the Inventory page and the dashboard, in that order of urgency.

## Feed days remaining

For each feed item with usage: average daily consumption over the last 14 days (or since the first consumption when younger than that) and days remaining = on hand / that average. The dashboard's feed-days tile shows the smallest figure among your feed items, so it is the day you next run out of something. It stays blank until you have recorded feed use. What to buy and when is in [feed phases](/guide/feed-phases) and [feed brands and prices](/guide/feed-brands-and-prices).`,
    sources: [],
    kpis: ['feedDaysRemaining'],
  },
  {
    id: 'projection-assumptions',
    section: 'start',
    title: 'Projection and recommendation assumptions',
    summary: 'The arithmetic behind the Plan page: the per-pig model, the ranking of strategies, the break-even prices, the sensitivity table and the farm scenarios with their peak capital and payback month.',
    body: `## Every number is a parameter you can change

The engine never uses a hidden figure. Each input (feed conversion, daily gain, mortality, feed price, weaner price, liveweight price, weaning age and so on) is a parameter with a value, a unit and a source row from the research, and the Recommend and Scenario pages let you edit each one before running. Your own price log comes first: the latest observation of each price replaces the default, and the page says how many it applied. Read the [price disclaimer](/guide/price-disclaimer).

## Per pig, from today

For a batch of a given head count and weight today, each strategy (sell as weaners, grow to roaster size, grow to market weight) is priced like this:

- Grow-out feed = FCR x (target kg - current kg) x feed price per kg. Defaults: FCR 2.65 (BM-09), feed price ₱36.55 per kg (dealer quote, July 2026, secondary: BM-06).
- Other cash cost = 11 percent of feed (biologics 3, repairs 3, sundries 5 percent: RK-48, RK-49, RK-50) plus ₱487.50 per pig for wages, water and electricity (DA roadmap finisher column, 2022 prices: BM-10).
- Head sold = head x (1 - mortality to sale); nursery 2 percent (RK-34), wean-to-finish 4.5 percent (RK-36).
- Revenue = head sold x price: per head for weaners (default ₱2,500, DA roadmap 2022: BM-01) and roasters; per kg x weight for market hogs (default ₱172.62 per kg, PSA farmgate June 2026: BM-102), less ₱5 per kg when the target is outside the 80 to 100 kg window (PM-19, PM-20).
- Margin = revenue - feed - other - the value of the pigs today (the weaner price: the money you give up by not selling now). Margin per day = margin / days to sale. Cash required = feed + other.

Targets: weaner 12 kg or 60 days of age (BM-02), roaster 25 kg or day 83 (BM-59, GN-35), market 90 kg or day 154 (GN-08, GN-33). Days to sale come from the ADG (GN-19).

## Ranking and the break-even prices

Strategies are ranked by total expected margin, ties to the shorter cycle, and the explanation lists every assumption with its value, unit and source. The page also shows the [decision rules](/guide/decision-rules) applied to your numbers:

- **Break-even weaner price** (Rule 1): the weaner price at which growing out and selling now earn the same; above it, sell; below it, grow. For pigs heavier than a weaner it is shown as the break-even sell-now price at their weight today.
- **Break-even lechon live price** (Rule 2): the price per live kg a roaster must pay for holding to lechon size to beat selling the weaner. No source prices live lechon pigs, so the default is the market liveweight price with no premium; enter the roaster's offer.
- **Cash-neutral split** (Rule 3): how many weaners of the litter to sell so their money pays the feed of the rest.

## If prices move

The sensitivity table repeats the margins with the sale price 10 and 20 percent lower and the feed price 10 percent higher, so you can see which strategy survives a bad month. A planned sale month applies the seasonal index of that month to the liveweight price (Rule 6); the index is 1.0 for months with no sourced figure.

## Farm scenarios

A scenario is N sows on one strategy from a start date for 12 to 36 months with a startup cost in the first month. Each sow is served on day 0 and again every 365 / litters-per-year days (default 2.0: BM-11); farrows after 115 days (PC-24); weans the default 8.47 piglets (PC-54); the pigs sell at day 60, 83 or 154 of age by strategy. Costs land on the day they occur: breeding cost at service (BM-13), sow feed daily (GN-54), piglet feed from day 14 to sale or day 60 (BM-03), grow-out feed daily, other cash cost with the feed, utilities (BM-14) and family labour (BM-15, non-cash, set it to 0 to leave it out) per litter at farrowing. The table shows, per month, sows, pigs on hand, revenue, expenses, net and the running total. **Peak capital** is the lowest point of the running total: the most cash the plan needs before it turns. **Payback month** is the first month the running total returns to zero or above; "not reached" means it did not within the horizon. The full strategy economics are in the [strategies](/guide/strategy-grow-to-market) section.`,
    sources: ['BM-09', 'BM-06', 'RK-48', 'RK-49', 'RK-50', 'BM-10', 'RK-34', 'RK-36', 'BM-01', 'BM-102', 'PM-19', 'PM-20', 'BM-02', 'BM-59', 'GN-35', 'GN-08', 'GN-33', 'GN-19', 'BM-11', 'PC-24', 'PC-54', 'BM-13', 'GN-54', 'BM-03', 'BM-14', 'BM-15'],
    kpis: ['marginPerHead', 'cashRequired', 'breakEvenWeanerPrice', 'breakEvenLechonPrice', 'cashNeutralSplit', 'peakCapital', 'paybackMonth'],
    prices: true,
  },
  {
    id: 'dashboard-rules',
    section: 'start',
    title: 'Dashboard rules: what each tile, alert and chart counts',
    summary: 'The exact rule behind pigs on farm, sows due, batches ready, cash on hand, the period figures, deaths, the alerts and the four charts.',
    body: `## The period

The picker at the top (this month, last month, this quarter, this year, all time, custom) sets the period for revenue, expenses, profit, deaths, cash on hand and the charts. Herd, stock and alert figures are always as of today.

## Tiles

| Tile | Rule |
|---|---|
| Pigs on farm | Active sows, gilts and boars from the animal records, plus piglets, growers and finishers from the batch head counts, plus any individual pig of those roles that is not in a batch (a pig inside a batch is counted once) |
| Sows due | Open litters not yet farrowed whose due date falls within the next 14 days, plus the overdue ones, flagged in red |
| Batches ready to sell | A batch reaches its strategy's target: weaner 12 kg or 60 days of age, roaster 25 kg or 83 days, market hog 90 kg or 154 days. By weight when the estimated weight today (latest weighing plus ADG, or the latest weighing alone) reaches the target kg; by age, when there is no weighing, when the days on farm reach the target age less the 28-day weaning age. Undecided batches are never ready |
| Cash on hand | The cash-flow closing balance from the first ledger entry to the end of the period, every kind counted (see [money rules](/guide/money-rules)) |
| Revenue, Expenses, Profit | The income statement over the period |
| Feed days left | The smallest days-remaining figure among the feed items with usage (see [stock rules](/guide/stock-rules)) |
| Deaths | Batch deaths (head removed as deaths) plus animal deaths recorded in the period |

## Alerts, in order

1. Overdue farrowings.
2. Stock: expired, then low stock, then expiring within 30 days.
3. Batches ready to sell.
4. Breeding milestones due in the next 7 days (heat check, pregnancy check, farrowing, weaning, rebreed, iron, castration, creep feed).

Each alert links to the litter, item or batch behind it.

## Charts

- **Revenue, expenses and profit by month** over the period's months.
- **Herd count at month end**: breeders alive on that date (from birth date, or always when none is recorded, until the date they left) stacked with the batch head on that date.
- **Cost per kg gained per batch**: see [unit costs](/guide/unit-costs-and-break-even); a batch needs two weighings and some cost.
- **Liveweight price log**: your own price observations for liveweight per kg, every source, by date.

The chart months are clamped to the months that hold records (from the farm start or the first transaction to this month), so "all time" shows your farm's history and nothing before it.`,
    sources: ['BM-02', 'BM-59', 'GN-35', 'GN-08', 'GN-33', 'PC-46'],
    kpis: ['pigsOnFarm', 'sowsDue', 'batchesReady', 'deaths'],
  },
]

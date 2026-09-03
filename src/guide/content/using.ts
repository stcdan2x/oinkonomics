import type { GuideArticle } from '../types'

// Using the app: the user manual (TASK 002). Task-oriented, screen by screen,
// in the order the farm work happens. Bold is reserved for labels that exist
// in the app (a test checks every one against the page and component source);
// the rules behind the numbers live in the "How Oinkonomics works" articles.
export const USING: GuideArticle[] = [
  {
    id: 'getting-started',
    section: 'using',
    title: 'Getting started',
    summary: 'Install the app on the phone and the desktop, set up the farm profile, find your way around the tabs, and enter the farm in the right order in the first week.',
    body: `## Install it

Oinkonomics is a web app that installs like a phone app. Open [stcdan2x.github.io/oinkonomics](https://stcdan2x.github.io/oinkonomics/) in Chrome on the phone, then use the browser menu's Install or Add to Home screen entry; on an iPhone use Share, then Add to Home Screen. On a desktop, Chrome shows an install icon at the right end of the address bar. Once installed it opens full screen from its own icon, and it keeps working with no signal: every record is stored on the device itself, and the pages you have opened once are kept for offline use.

> One install holds one farm. The phone and the desktop each keep their own copy of the records until you connect them through Google Drive, see [back up and sync](/guide/back-up-and-sync).

## The farm profile

The first screen asks for three things: **Farm name**, **Location** (optional) and **Records start from**, the date your records in the app begin. Amounts are in pesos throughout. Tap **Start**. You can change the profile later from **Settings** with **Edit farm profile**.

## Finding your way around

On the phone, five tabs sit along the bottom: **Home** (the Dashboard), **Herd**, **Money** (Finance), **Stock** (Inventory) and **Plan**. The **Guide** and **Settings** buttons sit in the top bar. On a wider screen the same seven entries form a sidebar on the left with their full names: **Dashboard**, **Herd**, **Finance**, **Inventory**, **Plan**, **Guide**, **Settings**.

| Tab | What you do there | Manual article |
|---|---|---|
| Dashboard | Read the farm at a glance: pigs on farm, sows due, batches ready, cash, profit, feed days, deaths, and the alerts that need attention today | [what to record each day, week and month](/guide/what-to-record-when) |
| Herd | Sows, gilts and boars; litters [from service to weaning](/guide/from-service-to-weaning); batches of growing pigs; the breeding calendar; sales | [set up your herd](/guide/set-up-your-herd), [from service to weaning](/guide/from-service-to-weaning), [manage a batch](/guide/manage-a-batch), [sell pigs](/guide/sell-pigs) |
| Finance | Every peso in and out, the reports, the cost and profit of each batch | [record money](/guide/record-money), [keep the books](/guide/keep-the-books), [read the reports](/guide/read-the-reports) |
| Inventory | Feed, medicine and supplies: what is on hand, what was bought, what was fed | [keep feed and supplies in stock](/guide/keep-stock) |
| Plan | Sell now or grow out, the prices you are offered, scenarios for a farm you are thinking of running | [sell now or grow out](/guide/sell-now-or-grow-out) |
| Guide | This reference | [how Oinkonomics works](/guide/how-the-app-works) |
| Settings | The farm profile, backup files, Google Drive sync | [back up and sync](/guide/back-up-and-sync) |

Most forms and cards carry a small book link. It opens the Guide article that explains that screen's rules, so the reason behind a number is one tap away from the number.

## The first week: enter the farm in this order

Each step builds on the one before it, so the app can compute stages, costs and alerts from day one.

1. **Settings**: check the farm profile, and note that **Records start from** is the date your ledger begins.
2. **Herd**: add every sow, gilt and boar with **Add animal**, with the tag or name you use in the pen and the birth date if you know it. See [set up your herd](/guide/set-up-your-herd).
3. **Herd**: for each sow that is already served or pregnant, open her card and use **Record service** with the real service date, so her farrowing date and stage are right. See [from service to weaning](/guide/from-service-to-weaning).
4. **Herd**: for growing pigs already on the farm, open the batches tab and use **Create** to make a batch with its head count, stage and start date. Weigh them once so the app has a starting weight. See [manage a batch](/guide/manage-a-batch).
5. **Inventory**: **Add item** for each feed, medicine and supply you keep, with its unit cost, then set what is on the shelf today with **Adjust or record loss** on each item (a count, not a purchase, so no expense is written for money spent before your records began). From now on every purchase goes through **Buy stock**. See [keep feed and supplies in stock](/guide/keep-stock).
6. **Finance**: record the opening cash and any loan, dated the start date, so the dashboard's cash on hand matches the cash box. See [keep the books](/guide/keep-the-books).
7. **Settings**: **Export file** once everything is in, and connect Google Drive if a second device will share the records.

From then on the daily routine is short: feed, deaths and treatments as they happen, weighings and stock on a weekly rhythm, and the money caught up at month end. The routine is laid out in [what to record each day, week and month](/guide/what-to-record-when).`,
    sources: [],
  },
  {
    id: 'set-up-your-herd',
    section: 'using',
    title: 'Set up your herd',
    summary: 'Add every sow, gilt and boar as its own card, decide when a grower needs one, and create a batch for pigs that are already growing on the farm.',
    body: `## Who gets a card

The **Herd** tab has five sub-tabs: **Breeders**, **Litters**, **Batches**, **Calendar** and **Sales**. Breeding animals are recorded one by one, because the app follows each sow through her services, litters and weanings. Growing pigs are recorded as batches: a group that is fed, weighed, treated and sold together. Give a grower its own card only when one pig genuinely needs its own record, for example a gilt you are keeping back to breed.

## Add a sow, gilt or boar

1. Open **Herd**, stay on **Breeders**, tap **Add animal**.
2. **Tag or name**: the ear tag or the name you use in the pen. This is how the animal appears everywhere else, so keep it short and unique.
3. **Role**: **Sow**, **Gilt** or **Boar**; the **Sex** follows the role. The other roles (**Piglet**, **Grower**, **Finisher**) are for the single pig that needs its own card.
4. **Breed** and **Birth date** are optional, but the birth date lets you judge a gilt's age at first service and a sow's age at culling.
5. **Source**: **Bought** or **Born here**.
6. **Notes** for anything else, then **Save**. The card opens straight away.

A gilt stays a gilt on her card after her first litter; the app treats sows and gilts the same way for services and litters.

## What the card shows

Each breeder card carries the animal's stage and its next date, computed from the latest litter: a sow that has just been served shows **Served** and her heat-check date, a pregnant sow shows **Pregnant** and her farrowing date, a nursing sow shows **Lactating** and her weaning date. The **Breeders** list shows the same badge and date for every animal, so it is the quickest view of what is due. The stages are explained in [the breeding calendar](/guide/breeding-calendar).

## Create a batch for pigs already on the farm

Weaned litters become batches on their own (see [from service to weaning](/guide/from-service-to-weaning)). For pigs that were bought in, or that were already growing when you started the app:

1. Open **Herd**, then **Batches**, then **New batch**.
2. **Batch name**: something you will recognise in lists, for example the month and the source.
3. **Stage**: **Piglets / weaners**, **Growers** or **Finishers**.
4. **Head count** and **Start date**: the number of pigs today and the day they arrived or the day your records start.
5. **Plan**: what you intend to do with them: **Sell as weaners (biik)**, **Grow to roaster (lechon) size**, **Grow to market weight**, or **Undecided** if you will let the Plan page advise you. The book link under the field opens the strategy's own article.
6. **Create**.

The batch appears in the list with its head count, stage, start date and plan, and its latest average weight once you have weighed it. Weigh a new batch once on its first day so the growth figures have a starting point; see [manage a batch](/guide/manage-a-batch).

> A bought-in batch has a purchase price. Record it in Finance as an expense in the category **Stock purchase (animals)**, applied to that batch, so the batch's costing starts from what you paid; see [record money](/guide/record-money).`,
    sources: [],
  },
  {
    id: 'from-service-to-weaning',
    section: 'using',
    title: 'From service to weaning',
    summary: 'Record a service, follow the litter through the calendar, close a litter that did not hold, record the farrowing and the weaning, and turn the weaned piglets into a batch.',
    body: `## Record the service

Open the sow's card from **Breeders** and tap **Record service** (the button shows only while she has no open litter). Enter the **Service date**, pick the **Boar** from your own boars or leave **AI or outside boar** and describe it in **AI / boar note**, then **Save**. The form shows the expected farrowing date as you type (service plus 115 days).

This creates an open litter, listed under **Litters** in **Open litters**, and moves the sow to **Served**. From here on the sow's card, the litter page and the calendar all show the same dates.

## The calendar

**Herd**, then **Calendar**, lists every milestone of every open litter: what is **Overdue** and what falls in the **Next 30 days**. Each line opens the litter. The dates come from research defaults: the heat check at day 21 after service (**Heat check (return to heat?)**), the **Pregnancy check** at day 28, **Farrowing due** at day 115, **Weaning due** 28 days after farrowing, and **Rebreed (watch for heat)** 5 days after weaning. For a litter that has farrowed the piglet care dates are added: **Iron shot** at days 3 and 14, **Castrate by today** at day 7 and **Start creep feed** at day 14. The reasoning behind each date is in [the breeding calendar](/guide/breeding-calendar).

The sow's stage badge moves with the dates: **Served**, then **Heat check due** around day 21, **Pregnant** once the pregnancy check date has passed, **Due soon** in the last days before farrowing, **Overdue** after the due date, **Lactating** after farrowing and **Weaned** after weaning until the next service.

## A litter that did not hold

If she returns to heat, or the pregnancy check is negative, or she aborts, open the litter and tap **Not pregnant / aborted**. Choose the **Outcome** (**Returned to heat / not pregnant** or **Aborted**), the date and a note, then **Close litter**. The sow goes back to **Open** and you can record the next service. The litter stays on her card as a closed litter, so repeat returns show up in her history.

## Record the farrowing

When she farrows, open the litter (from her card, from **Litters** or from the calendar). The **Record farrowing** card asks for the **Farrowing date**, **Born alive**, **Stillborn** and **Mummified**. Tap **Save farrowing**.

The card now shows the litter's **Piglet care schedule** with each date, marked past once it has gone by, and the sow shows **Lactating** with her weaning date. A wrong date or count is corrected on the litter page with **Edit farrowing**, and a farrowing recorded on the wrong litter is taken back with **Undo farrowing**, both until the litter is weaned; see [fix mistakes](/guide/fix-mistakes). The farrowing-week checklist is one tap away on the card: [farrowing week checklist](/guide/farrowing-week-checklist).

## Record the weaning

Around day 28 the litter page shows **Record weaning**. Enter the **Weaning date** and **Piglets weaned** (the form starts from the number born alive, so reduce it by the piglets lost) and tap **Save weaning**. The sow moves to **Weaned** with her rebreed date; watch her for heat and record the next service from her card. Deaths between farrowing and weaning are simply the difference between born alive and weaned; you do not record them one by one.

## Turn the litter into a batch

After weaning the litter page offers **Start a batch from this litter**. Choose the **Plan for this batch** (the book link under the field opens the strategy's article; **Undecided** links to the decision rules) and an optional **Batch name**, then **Create batch**. The weaned count becomes the head count and the weaning date the start date. The batch opens at once; the piglets' share of the breeding herd's cost travels with them, see [cost allocation](/guide/cost-allocation).

Every service, farrowing and weaning is also listed under **History** at the bottom of the sow's card and the litter page.`,
    sources: [],
  },
  {
    id: 'manage-a-batch',
    section: 'using',
    title: 'Manage a batch',
    summary: 'Weigh the batch, record feed and treatments, log deaths and removals, read the growth and withdrawal figures, and see what the batch has cost so far.',
    body: `## The batch page

Open **Herd**, **Batches**, then the batch. The top card shows the **Plan**, **Head count**, **Days on farm**, **Last weighing**, **ADG** (average daily gain), **Estimated today**, the date the batch should reach market weight, and **Sale allowed from**. Below it sit the action buttons, then the **Stock used**, **Costing**, **Weights** and **History** cards.

## Weigh

Tap **Weigh**. Enter the **Date**, the **Average kg** of the pigs you weighed and, optionally, **Pigs weighed** (how many you put on the scale), then **Save**. A weighing is the average of the batch, not one pig; weighing a sample of five or six is fine as long as they are typical.

After two weighings the page shows the **ADG** in grams per day, the **Estimated today** weight (the last average carried forward at that rate) and the date the batch should reach 90 kg, the market weight the app assumes. One weighing every two weeks keeps these figures honest. What counts as a good gain, and how the estimate is computed, is in [growth tracking](/guide/growth-tracking) and [judging target weight](/guide/judging-target-weight).

## Feed and expenses

**Record feed** opens the daily feed entry with this batch already selected: what was fed today comes out of stock and is costed to the batch. **Record expense** opens the transaction form with the batch already selected, for money spent on this batch alone (a vet visit, transport). Both are described in [keep feed and supplies in stock](/guide/keep-stock) and [record money](/guide/record-money).

## Treatments, vaccinations and deworming

Tap **Health event** (the card is titled **Health event (whole batch)** because one entry covers every pig in the batch). Choose the **Type**: **Treatment (medicine)**, **Deworming**, **Vaccination** or **Iron shot**. Pick the **Product** from the list of products with known withdrawal periods, or **Other (type the name)** and fill in **Product name**. Enter the **Date given** and the **Withdrawal days**: the list fills this in for known products, and for anything else copy it from the product label (0 if the label states none). The form shows the earliest sale date after this dose. **Dose** is optional. If the product is an item you keep in **Inventory** (a medicine, vaccine or supplement), choose it under **From stock** and enter the **Quantity used** in the item's unit: the stock goes down and the cost lands on the batch, at the item's unit cost of that day. The two fields appear only when such an item exists. **Note** is optional. **Save**. The same form on an animal's card draws the stock for that animal; for a sow, gilt or boar the cost goes to the breeding herd.

The batch's **Sale allowed from** date is the latest withdrawal end among all its treatments; while it is in the future the page marks the batch as in withdrawal, and the sale form will refuse a sale before that date unless you accept responsibility. Read [withdrawal periods](/guide/withdrawal-periods) before treating pigs that are close to sale.

## Deaths and removals

Tap **Deaths / removals**. Choose the **Reason**: **Died**, **Culled** (destroyed or removed, not sold) or **Moved out** (transferred to another batch or off the farm without a sale). Enter the **Head**, the **Date** and a **Note** such as the cause, then **Record**. The head count drops and the event goes into **History**; deaths also count on the dashboard and against the mortality benchmarks, see [mortality benchmarks](/guide/mortality-benchmarks). Pigs that leave by sale are handled by the sale form, see [sell pigs](/guide/sell-pigs).

## What the batch has cost

The **Stock used** card lists the feed fed to the batch and the medicine its health events drew from stock, at the cost the stock was bought for, with a **Total at cost** line. The **Costing** card adds everything up: the direct expenses by category, the batch's share of shared farm costs (split by head-days across everything alive that month), the value of the piglets at the start for a batch that came from a litter, then **Total cost**, **Revenue** and **Profit**, with the break-even price per head and per kg. Until the batch is sold the break-even assumes 90 kg per pig. How the sharing works is in [cost allocation](/guide/cost-allocation); how to read the break-even is in [unit costs, break-even, ROI and payback](/guide/unit-costs-and-break-even).

> Feed is the largest cost of a batch and it only reaches the costing through the daily feed entry. A batch with no feed recorded looks cheaper than it is.`,
    sources: [],
  },
  {
    id: 'sell-pigs',
    section: 'using',
    title: 'Sell pigs',
    summary: 'Record a sale from a batch or a breeder card, by head or by live weight, and see what the sale changes in the herd, the ledger and the costing.',
    body: `## Sell from a batch

Open the batch and tap **Sell**. In **Sell from this batch**:

1. **Sale date** and **Head**: how many of the batch are going (the field shows how many you have).
2. Choose how the price was agreed: **Price per head**, or **Price per kg liveweight**. For a per-kg sale enter the **Total live weight (kg)** of all the pigs sold together, as weighed at the sale, and the **Price per kg**. The total updates as you type; check it against the buyer's payment.
3. **Buyer type**: **Viajero (trader)**, **Lechonero / roaster**, **Market / slaughterhouse**, **Direct to consumer** or **Other**, and the **Buyer name** if you want to find this buyer again. Who buys what, and at which price basis, is in [sale channels and buyers](/guide/sale-channels-and-buyers).
4. **Record sale**.

If the batch is still inside a withdrawal period the form shows a red notice with the product and the date, and the sale is refused unless you tick the acknowledgement. Selling before the withdrawal date is a food-safety violation; the date exists to protect the buyer and your licence, see [withdrawal periods](/guide/withdrawal-periods).

## Sell a sow, gilt or boar

Open the animal's card and tap **Sell**. The form is the same with **Head** fixed at one, and it starts on the per-kg price because cull sows are usually sold by weight. The animal's status changes to sold, with the date, and the card leaves the **Breeders** list.

A breeder that dies or is culled without a sale is recorded with **Cull / died** on the card: choose **What happened** (**Culled (removed, not sold here)** or **Died**), the date and a **Reason**, then **Confirm**.

## What a sale changes

One sale writes several records at once, so you never enter it twice:

- The batch's head count drops by the pigs sold, and a sale event goes into its **History**; a sold-out batch stays in the costing with its lifetime result.
- The ledger gets one revenue entry in the category **Hog sales** for the total, dated the sale date, linked to the batch or animal, with a note naming the buyer. It shows in **Ledger** marked as coming from a sale; it has no edit or delete of its own and goes when the sale is undone.
- The batch's **Costing** now shows **Revenue** and **Profit**, the cost per kg sold and the break-even at the real weight sold.
- The dashboard's revenue, profit and cash on hand move with it.

Every sale is listed under **Herd**, **Sales**, with the date, head, total, buyer and batch. A wrong sale is taken back from its row with **Undo sale** and then **Confirm undo**: the pigs return to the batch or the animal becomes active again, and the revenue entry goes; then sell again with the right figures. See [fix mistakes](/guide/fix-mistakes).

## Log the price too

The sale records what you were paid. The Plan page keeps a separate log of the prices you are offered, sold or not, which the recommendation uses; take thirty seconds to add the price you got, see [sell now or grow out](/guide/sell-now-or-grow-out).`,
    sources: [],
  },
  {
    id: 'record-money',
    section: 'using',
    title: 'Record money',
    summary: 'The transaction form field by field, every kind of entry with its categories, the entries the app writes for you, and the ledger where they all meet.',
    body: `## Where money is recorded

Every peso that moves is one entry in the ledger: **Finance**, then **Ledger**, then **Record a transaction**. Three things are recorded elsewhere and reach the ledger by themselves, so never type them a second time:

- A pig sale, recorded from the batch or the animal card ([sell pigs](/guide/sell-pigs)), arrives as revenue in **Hog sales**.
- A purchase of feed, medicine, vaccines or supplies, recorded with **Buy stock** in Inventory ([keep feed and supplies in stock](/guide/keep-stock)), arrives as an expense in the matching category, marked **Stock**.
- Feed and medicine used are not ledger entries at all: the money left when the stock was bought. Their use reaches the batch costing through the daily feed entry and the health event's **From stock** field instead.

Everything else, from the electricity bill to the loan from a relative, goes through the form.

## The form

| Field | What to enter |
|---|---|
| **Kind** | What sort of money this is: **Expense**, **Revenue**, **Capital purchase**, **Drawing**, **Loan in**, **Loan payment** or **Owner's capital in**. The kind decides whether the entry counts as profit or only as cash, see [keep the books](/guide/keep-the-books). |
| **Category** | The list changes with the kind (below). |
| **Date** | The day the money was paid or received, not the day the feed was used or the invoice arrived. |
| **Amount (₱)** | Always a positive number; the kind says which way it went. |
| **Applies to** | **Shared (whole farm)** for costs that serve everything, or one batch or one breeder from the **Batches** and **Breeders** lists. Shared costs are split across every batch and the breeding herd by head-days; a cost applied to a batch lands on that batch alone, see [cost allocation](/guide/cost-allocation). |
| **Note (optional)** | Supplier, receipt number, what exactly. This is your receipt trail: the ledger shows it under the entry. |

Then **Save**. Opening the form from a batch page (**Record expense**) or from an animal card pre-selects that batch or animal in **Applies to**.

## Kinds and categories, with examples

| Kind | Categories | Examples |
|---|---|---|
| **Expense** (operating cost; counts against profit) | **Feed**, **Medicine and vaccines**, **Boar or AI service**, **Labour**, **Water**, **Electricity**, **Transport**, **Permits and fees**, **Pen construction and repair**, **Equipment**, **Stock purchase (animals)**, **Other** | The AI fee for a service (apply to the sow); the helper's wage (shared); the tricycle to the market (apply to the batch sold); a bag of nails to patch a pen; weaners bought to fatten and sell (apply to their batch) |
| **Revenue** (income; counts toward profit) | **Hog sales**, **Breeding service fees**, **Manure and by-products**, **Other income** | A neighbour paying for your boar's service; manure sold to a vegetable grower. Hog sales normally come from the sale form, not from here. |
| **Capital purchase** (an asset that lasts years; cash out, not against profit) | **Pen construction and repair**, **Equipment**, **Stock purchase (animals)**, **Other** | Building a new pen; a weighing scale; a gilt or a boar bought to breed. The same categories exist under Expense: the kind, not the category, says whether it is capital. |
| **Drawing** (money the owner takes out) | **Owner drawing** | Cash taken for the household. |
| **Loan in** (money borrowed; cash in, not income) | **Loan received** | A loan from a cooperative or a relative. |
| **Loan payment** (repaying it; cash out, not an expense) | **Loan repayment** | Each instalment. Interest that is charged separately is an **Expense** in **Other**. |
| **Owner's capital in** (your own money put into the farm; cash in, not income) | **Owner contribution** | The cash you start the farm with; more of your own money added later to buy feed or build a pen. Taking it back out is a **Drawing**. |

## The ledger

**Ledger** lists the entries of the chosen period (the period buttons and dates at the top, see [read the reports](/guide/read-the-reports)), newest first, each with its category, its kind, the batch or animal it applies to, and the note. Money out shows as a negative amount, money in as positive. The three figures above the list, **Revenue**, **Expenses** and **Net**, count operating entries only; capital purchases, drawings, loans and the owner's capital in are listed but left out of those totals.

An entry that came from a sale or from a stock purchase says so under its amount and has no delete button: correct it at its source, see [fix mistakes](/guide/fix-mistakes). Any other entry can be changed with **Edit**, which opens the transaction form filled in (what the entry applies to stays as it was), or removed with **Delete** and then **Confirm delete**.

> Keep the paper. The app records the amount, the date and your note; the receipt itself, the buyer's name and the weighing slip stay in a folder, dated, because that is what a permit inspection or a tax question will ask for. See [keep the books](/guide/keep-the-books).`,
    sources: [],
  },
  {
    id: 'keep-the-books',
    section: 'using',
    title: 'Keep the books',
    summary: 'The accounting behind the ledger: cash basis, profit versus cash, starting the ledger, the month-end routine, how stock and shared costs reach a batch without double counting, and what to keep on paper.',
    body: `## Cash basis, one date rule

Oinkonomics keeps the books on a cash basis: every entry sits on the day the money changed hands. Feed bought on the 28th is that month's expense even if the pigs eat it next month; a sale is revenue on the day you were paid, not the day the pigs left. This is the simplest set of books a small farm can keep consistently, and it is what the app's reports assume. The conventions behind it are in [farm accounting conventions](/guide/farm-accounting-conventions).

## Profit and cash are two different questions

Each kind of entry answers one or both:

| Kind | In the income statement (profit)? | In the cash flow? |
|---|---|---|
| Expense | yes, as a cost | yes, out |
| Revenue | yes, as income | yes, in |
| Capital purchase | no | yes, out |
| Drawing | no | yes, out |
| Loan in | no | yes, in |
| Loan payment | no | yes, out |
| Owner's capital in | no | yes, in |

So **Net income** on the reports is what the farm earned from raising pigs in the period, and **Closing balance** is what should be in the cash box if every peso went through the ledger. A month can show a profit and an empty cash box (you built a pen, or drew the money out), or a loss and a full one (a loan came in). Read both, see [read the reports](/guide/read-the-reports) and [money rules](/guide/money-rules).

## Starting the ledger

The ledger starts at zero on the day of your first entry, and **Cash on hand** on the dashboard is simply every entry added up. You have two honest ways to begin:

- Track the cash box. On your start date record the money you put into the farm as **Owner's capital in** (category **Owner contribution**), and a real loan as **Loan in**. From then on **Cash on hand** should match the cash box. Money you take out, your own or what the farm earned, is a **Drawing**; a loan instalment is a **Loan payment**. None of these touches profit.
- Track only what the farm generates. Record nothing at the start. **Cash on hand** then means the net cash the farm has produced since your start date, positive or negative, and the cash box is your own affair.

Pick one and stay with it. Pens, equipment and breeding stock you already owned on the start date are not entered: the app measures return on the capital spent from the start date on.

## Month end

Set aside a quarter of an hour at the end of each month:

1. Catch up the entries. Walk through the receipts folder and the phone messages: every payment in and out is in **Ledger** with its date. Sales and stock purchases are already there.
2. Reconcile the cash. Compare **Cash on hand** with the cash box (if you track it). A gap is an entry you forgot; find it rather than forcing it. If it cannot be found, record it once as **Other** (expense) or **Other income** with the note "unexplained difference" so the books tie out and the gap stays visible.
3. Read the two reports for **Last month**: the income statement for what the farm earned, the cash flow for where the money went. Then the Batches tab for the cost and profit of each batch.
4. Check the unit costs: cost per weaned piglet, ROI and the payback line, see [unit costs, break-even, ROI and payback](/guide/unit-costs-and-break-even).
5. Export a backup from **Settings** (**Export file**) and keep it with the month's papers, see [back up and sync](/guide/back-up-and-sync).

## Where a batch's cost comes from, without double counting

A batch's **Costing** adds three things: expenses applied to the batch directly, its head-day share of the shared expenses of each month it was alive, and, for a batch weaned on the farm, the value of its piglets at weaning (their share of the breeding herd's cost). Feed and medicine are special: the purchase is an expense on the day it was paid, but the costing ignores that purchase and counts the stock as it is used, at the cost it was bought for, against the batch it was fed to. The two never both count, and the reports and the costing agree over the life of the farm. The full rules are in [cost allocation](/guide/cost-allocation).

Two consequences for the bookkeeper: feed that was never recorded as fed makes every batch look cheaper than it was, and a shared expense in a month with no batch and no breeder on farm is allocated nowhere (the Batches tab says so when it happens).

## Paper the app does not replace

The ledger is your cash book. Keep beside it, dated and in order: official receipts and invoices from suppliers; the buyer's name, the weighing slip and the amount for every sale; permits, registrations and vaccination papers; and the monthly backup file. Which registrations and taxes apply to a small piggery, and which records they expect, is set out in [permits and registrations](/guide/permits-and-registrations), [tax in plain language](/guide/tax-in-plain-language) and [standard records](/guide/standard-records).`,
    sources: [],
  },
  {
    id: 'read-the-reports',
    section: 'using',
    title: 'Read the reports',
    summary: 'The period buttons, the income statement, the cash flow, the unit costs card, the batch costs tab, and what to look at every month.',
    body: `## Pick the period

**Finance**, **Ledger** and **Reports** share a period: **This month**, **Last month**, **This quarter**, **This year**, **All time**, or any two dates in the boxes below the buttons. The period stays in the page address, so it survives switching tabs and reloading. The dashboard's money tiles use the same period control. The **Batches** tab has no period: a batch spans months, so its figures are lifetime figures.

## Income statement

**Reports** opens with the **Income statement**: **Revenue** by category, **Total revenue**, **Expenses** by category (largest first), **Total expenses** and **Net income**. Only expense and revenue entries are in it, so this is the operating result: what the pigs earned in the period after what it cost to raise them. The dashboard's **Profit** tile is this number. A negative net income in a month with no sales is normal for a farm that sells in batches; judge the year, or judge each batch on the **Batches** tab.

## Cash flow

The **Cash flow** card follows the money: **Opening balance** (every entry before the period added up), **Operating in (revenue)**, **Operating out (expenses)**, **Capital purchases**, **Loans received**, **Loan repayments**, **Owner's capital in**, **Owner drawings**, then **Net cash this period** and **Closing balance**. The closing balance is the dashboard's **Cash on hand**. If it does not match the cash box, an entry is missing, see [keep the books](/guide/keep-the-books).

## Unit costs and capital

The **Unit costs and capital** card below the cash flow gives the figures a lender or a buyer of the farm would ask for: the breeding herd's cost over the months touching the period, **Piglets weaned**, **Cost per weaned piglet**, the capital spent to the period end, **ROI (net income / capital)** and **Capital paid back**, the day the farm's cumulative operating income first covered all the capital spent, or "not yet". How each is defined, and what a good figure looks like, is in [unit costs, break-even, ROI and payback](/guide/unit-costs-and-break-even) and [KPI costs and margins](/guide/kpi-costs-and-margins).

## Batch costs

The **Batches** tab shows one card per batch, sold out or not, with **Open** to jump to the batch: direct costs by category, the allocated share of shared costs with the head-days it was based on, the piglets' starting value for a home-bred batch, **Total cost**, **Revenue**, **Profit**, and the cost per kg sold and break-even per head and per kg. For a batch still on the farm the break-even assumes 90 kg per pig at sale. This is where "did that batch pay?" is answered, and where a plan can be checked against what happened, see [cost allocation](/guide/cost-allocation).

## What to look at each month

1. **Net income** for **Last month** and for **This year**: is the farm earning?
2. **Closing balance** against the cash box: are the books complete?
3. **Profit** per batch on **Batches**, and the break-even per kg against the price you are being offered: is the next sale worth waiting for? The Plan page turns that into a recommendation, see [sell now or grow out](/guide/sell-now-or-grow-out).
4. **Cost per weaned piglet** and **ROI**: are the sows and the capital pulling their weight?

The dashboard shows the headline figures for the same period, see [dashboard rules](/guide/dashboard-rules) for what each tile counts.`,
    sources: [],
  },
  {
    id: 'keep-stock',
    section: 'using',
    title: 'Keep feed and supplies in stock',
    summary: 'Set up the items you keep, record what you buy and what you feed each day, correct the count when it differs, and read the low-stock, expiry and feed-days alerts.',
    body: `## Items first, then stock

**Inventory** lists what you keep on the farm: feed, medicine, vaccines, supplements, supplies and equipment, each as an item with a quantity on hand. Stock only changes through moves: a purchase, a day's feeding, a count correction or a loss. That is why the item form itself has no quantity field.

1. **Inventory**, then **Add item**.
2. **Name** as it is on the sack or the bottle. **Category**: **Feed**, **Medicine**, **Vaccines**, **Supplements**, **Supplies** or **Equipment**.
3. **Unit**: what you buy and count in (bag, kg, vial, bottle, piece). For feed sold by the bag, fill **Kg per unit (optional)** (50 for a standard sack) so you can record feeding in kilos and the app converts.
4. **Reorder level**: the app alerts when the quantity on hand is at or below it. A level of 0 alerts only when the item runs out.
5. **Unit cost (₱, optional)**: what one unit costs today. Purchases update it automatically, so it matters mainly for stock you already had when you started.
6. **Expiry date (optional)** for medicines and vaccines, then **Save**.

For stock that was already on the shelf when you started, open the item, tap **Adjust or record loss**, choose **Physical count differs (set the new count)** and enter what you counted. That sets the quantity without writing an expense for money spent before your records began.

## Buying

**Inventory**, then **Buy stock** (or **Buy** on the item's page): the **Item**, the **Date**, the **Quantity** in the item's unit, the **Total paid (₱)** for the whole purchase, and a **Note (optional)** for the supplier and receipt number. **Save** does two things at once: the stock goes up, and an expense for the total appears in the ledger, dated the purchase, in the category that matches the item (feed under **Feed**, medicine, vaccines and supplements under **Medicine and vaccines**, equipment under **Equipment**, supplies under **Other**). Never enter the same purchase on the transaction form as well. The item's unit cost becomes the weighted average of what was on hand and what you just paid, which is the cost the feed will be charged at when it is fed.

## Feeding, every day

**Inventory**, then **Daily feed** (or **Record feed** on the batch page, which pre-selects the batch). Choose **Fed to**: a batch, or **Breeding herd / general** for the sows, gilts and boars. Choose the **Feed** (the field shows how much is on hand), tap a preset or type the **Quantity**, in bags or in kg if the item has a kg per unit, check the **Date**, and **Record feed**. The page remembers the last batch, feed and quantity on this device, so the usual entry is three taps. The **Fed today** list below shows what has been recorded today with a **Delete** for a slip.

Each entry takes the feed out of stock and charges it, at the unit cost of that moment, to the batch it was fed to; feed for the breeding herd becomes part of the herd's cost and reaches the piglets at weaning. Feed recorded here is the biggest single line in every batch's costing, see [manage a batch](/guide/manage-a-batch) and [cost allocation](/guide/cost-allocation). Medicines, vaccines and supplements leave stock through the health event on the batch or the animal, not here: choose the item under **From stock** and enter the **Quantity used**, see [manage a batch](/guide/manage-a-batch). The cost reaches the batch the same way, at the unit cost of that moment; for a sow, gilt or boar it becomes part of the breeding herd's cost. A vial that was used up without a health event is a **Loss** or a count adjustment.

## Counting, losses and the item page

Open an item to see **On hand**, **Reorder level**, **Unit cost**, **Value on hand** and **Expiry**, the **Edit item** button for the fields above, and the list of every move: **Purchase**, **Used**, **Adjustment** and **Loss**, each with its date, the batch it went to, and the value at cost. When the sack count on the floor differs from the app, tap **Adjust or record loss**, choose **Physical count differs (set the new count)** and enter what you counted; for feed that spoiled, spilled or expired choose **Loss: spoiled, spilled or expired** and the amount. A move that was a mistake can be removed with **Delete** and **Confirm delete**; removing a purchase also removes its ledger entry, so the ledger and the stock stay in step. A move a health event drew from stock cannot be deleted here (the app refuses and says so): correct it from the event's row in the batch's or animal's **History** (**Edit** the quantity, or **Undo** the event), which keeps the record and the stock together.

## Alerts and feed days

The **Alerts** card at the top of **Inventory** (and the dashboard's alerts) lists items at or below their reorder level, items expiring within thirty days, and expired items still on hand. Every feed item shows "about N days left": the quantity on hand divided by the average fed per day over the last fourteen days (or since the first feeding, if that is more recent). The dashboard's **Feed days left** tile is the shortest of those, so it tells you which feed to buy next. The rules are in [stock rules](/guide/stock-rules); feed amounts by stage are in [feed phases](/guide/feed-phases).`,
    sources: [],
  },
  {
    id: 'back-up-and-sync',
    section: 'using',
    title: 'Back up and sync',
    summary: 'Export and import a backup file, connect the farm to Google Drive so the phone and the desktop stay in step, handle the hourly reconnect, add a second device, and know what deletes your records.',
    body: `## Where your records live

Everything you enter is stored inside the browser on this device, not on a server. That is why the app works without a signal, and it is also why the records need protecting: clearing the site's data in the browser, uninstalling the app, resetting the phone or losing it removes them. Two tools cover this, both under **Settings**: a backup file you keep yourself, and Google Drive sync.

## The backup file

In **Settings**, the **Backup** card has **Export file** and **Import file**. **Export file** writes one file named with the date, holding every record, into the phone's downloads. Keep a copy somewhere else: the farm's Google Drive, an email to yourself, a memory card. Do it at month end at least, see [keep the books](/guide/keep-the-books).

**Import file** reads such a file back in and merges it: a record from the file is written only when it is missing here or newer than the copy here, and deletions carry over. Nothing newer on this device is ever overwritten, and importing the same file twice changes nothing. The message under the buttons says how many records were restored. This is also the way to move the farm to a new phone if you do not use Google Drive: export on the old one, import on the new one.

## Google Drive sync

With sync connected, the phone and the desktop keep the same records through a private folder in the farm's own Google Drive: no server, no account with anyone else, and nothing visible in your Drive file list. Use one Google account for the farm on every device.

1. **Settings**, then **Connect Google Drive** in the **Google Drive sync** card.
2. Google asks you to sign in and to allow the app its own app folder. Allow it. The app cannot see anything else in the Drive.
3. The first sync uploads this device's records. The card now shows **Last synced** and **Changes waiting** (records changed here since the last sync).

From then on the app syncs on its own: when it opens, every five minutes while open, when you come back to it, and when the connection returns. Records changed offline wait and go on the next sync. **Sync now** forces one at any time.

Google sign-in lasts one hour. After that a banner appears at the top of every page, "Sync paused: Google sign-in expired", with a **Reconnect** button; the card shows the same with **Reconnect and sync**. One tap, and usually no password, restores it. Nothing is lost while it waits: your changes stay on the device and are sent after the reconnect. **Disconnect** stops syncing on this device and forgets the sign-in; the records stay on the device and the file stays in the Drive.

## A second device

1. Open the app on the new device and enter the farm profile: type the farm name exactly as on the first device.
2. **Settings**, **Connect Google Drive**, sign in with the same Google account.
3. The first sync pulls every record from the Drive and merges it with what the new device holds.

Records are matched one by one, and where both devices hold the same record the newer copy wins. The farm profile you just typed is newer than the one in the Drive, so it replaces it on both devices after the first sync; if it differs, correct it once with **Edit farm profile** on either device. After that, work on either device and the other follows within minutes.

> Both devices must be able to reach Google for the records to meet. A phone that stays offline keeps its own changes safely, sends them when it is back online, and receives the other device's changes at the same time.

## What deletes your records

- Clearing the browser's site data or storage for this app, on that device. Export first.
- Uninstalling the app on a phone usually clears its data too.
- Deleting the app's folder from the Google Drive removes the shared copy; each device still has its own until it syncs and uploads again.

With sync on and a monthly export in a safe place, losing a phone costs you nothing but the phone.`,
    sources: [],
  },
  {
    id: 'fix-mistakes',
    section: 'using',
    title: 'Fix mistakes',
    summary: 'What can be edited, what can be deleted, what cannot be undone, and the honest way to correct each kind of wrong entry.',
    body: `## The rule

The app is a record book, so every entry stays visible until you correct it, and a correction is made at the record itself. A few things are edited in place. Most wrong entries are undone, which reverses everything they changed, and then entered again. A record created by mistake is deleted. An undo or a delete hides the record and marks it deleted; the mark travels to your other device on the next sync, so the record does not come back.

> Sync before you correct the same record on two devices. The newer change wins on the next sync, so an edit made on the phone after a delete made on the laptop would bring the record back.

## What can be edited

| Record | Where | What can change |
|---|---|---|
| The farm profile | **Settings**, **Edit farm profile** | Everything on it. |
| An inventory item | **Edit item** on the item page | Name, category, unit, kg per unit, reorder level, unit cost, expiry. The quantity is never edited directly; use a count adjustment. |
| A weighing | The batch's **History**, **Edit** on the row | Date, average kg, pigs weighed. The growth figures follow. |
| A treatment, vaccination, deworming or iron shot | The **History** of the batch or animal, **Edit** on the row | Date, product, withdrawal days, dose, note, and the item and quantity drawn from stock. The withdrawal date and the sale block follow; a changed quantity puts the old draw back and takes the new one at today's unit cost, and clearing **From stock** puts it all back. |
| A farrowing | The litter page, **Edit farrowing**, until the litter is weaned | Date, born alive, stillborn, mummified. The care schedule follows. |
| A weaning | The litter page, **Edit weaning**, until a batch is made from the litter | Date and piglets weaned. |
| A ledger entry you typed | **Finance**, **Ledger**, **Edit** on the entry | Kind, category, date, amount, note. What it applies to stays. Entries that came from a sale or a stock purchase have no edit; see below. |

## What can be undone

Each undo takes two taps, the action and then its confirmation, and reverses what the record did.

| Wrong record | Where | What comes back |
|---|---|---|
| A sale | **Herd**, **Sales**, **Undo sale**, then **Confirm undo** | The pigs return to the batch, a sold animal is active again, the revenue entry and the sale events go. Sell again with the right figures. |
| A death, cull or move-out on a batch | The batch's **History**, **Undo**, then **Confirm undo** | The head count goes back up; the mortality figure and the cost allocation follow. |
| A breeder marked culled or died | The animal card, **Reactivate** (or **Undo** on the row in its **History**) | The animal is active again with no status date. A sold breeder comes back through the sale's undo. |
| A weighing or a health event | Its row in **History**, **Undo**, then **Confirm undo** | The record goes; the growth figures and the withdrawal date follow, and medicine the event drew from stock goes back on hand. |
| A farrowing | The litter page, **Undo farrowing**, then confirm, until the litter is weaned | The litter is pregnant again, with its expected date and the farrowing event gone. |
| A weaning | The litter page, **Undo weaning**, then confirm, until a batch is made from it | The litter is lactating again. To change a weaning after the batch exists, delete the batch first (possible while nothing was sold from it). |
| A litter closed as not pregnant or aborted | The litter page, **Reopen litter**, then confirm | The litter is open again with the original service date. Refused while the sow has another open litter. |

## What can be deleted

| Record | Where | What happens |
|---|---|---|
| A ledger entry you typed | **Finance**, **Ledger**: **Delete**, then **Confirm delete** | The entry is gone from the reports and the costing. |
| A stock move: a purchase, a feeding, an adjustment or a loss | The item's page: **Delete**, then **Confirm delete**; today's feedings also on **Daily feed** | The quantity on hand is recounted from the remaining moves. Deleting a purchase also deletes its ledger entry, so the money and the stock agree. A move a health event drew from stock is refused here: **Edit** or **Undo** the event instead. |
| A logged price | **Plan**, **Prices**: delete, then confirm | The recommendation falls back to the next latest price or the default. |
| A scenario | Its page: **Delete scenario**, then **Tap again to delete** | Removed from the side-by-side table. |
| An animal created by mistake | The animal card, **Delete animal**, then **Confirm delete** | The animal and its events go. Refused, with the reason shown, while the animal has a litter, a sale or a purchase entry in the ledger: undo or delete those first, or keep the animal and mark it culled. |
| A batch created by mistake | The batch page, **Delete batch**, then **Confirm delete** | The batch, its weighings and its events go. Refused while a sale names the batch: undo the sale first. A litter the batch was made from can be given a new batch. |

## What is corrected by a new entry

| Wrong record | Correction |
|---|---|
| A stock purchase entered with the wrong figures | Delete the purchase move on the item's page (this also removes the ledger entry) and buy again with the right figures. |
| A service with the wrong date or boar | There is no edit for a service. While the litter has no farrowing, close it with **Not pregnant / aborted** and a note saying so, then record the service again from the sow's card with the right details. |
| A sale with only the buyer's name wrong | Undo the sale and sell again, or leave it and put the right name in the revenue entry's note through the sale's undo and re-entry. The buyer is part of the sale, not of the ledger entry. |

## Keep the note honest

Every correction that leaves a record behind takes a note. Write what really happened ("entered 12 head, sold 10") rather than a bare "correction", because the note is what you, or the person checking the books, will read a year later. Corrections that change money should also be checked on the reports for the month, see [read the reports](/guide/read-the-reports).`,
    sources: [],
  },
  {
    id: 'what-to-record-when',
    section: 'using',
    title: 'What to record each day, week and month',
    summary: 'The app routine: the few entries that must be made as they happen, the weekly checks, the month-end close, and how to read the dashboard as the summary of it all.',
    body: `## As it happens

Some entries lose their meaning if they wait, because other figures are computed from their dates:

- A service, a farrowing and a weaning, on the day, from the sow's card or the litter page ([from service to weaning](/guide/from-service-to-weaning)).
- A death or removal, with the cause ([manage a batch](/guide/manage-a-batch)).
- A treatment, vaccination or deworming, with the withdrawal days: the sale block depends on the date given ([manage a batch](/guide/manage-a-batch)).
- A sale, before the buyer's truck is out of the gate ([sell pigs](/guide/sell-pigs)).

## Every day

- Feed: one entry per feed per batch, and one for the breeding herd, with **Daily feed** ([keep feed and supplies in stock](/guide/keep-stock)). Three taps, and it is the entry that makes every cost figure right.
- A glance at the dashboard's alerts: an overdue farrowing, a feed at its reorder level, an expiring medicine, a batch at market weight, and this week's breeding milestones.

## Every week

- Weigh each growing batch (every week in the finishing weeks, every two weeks earlier) with **Weigh** on the batch page.
- Open **Herd**, **Calendar**: what is due in the **Next 30 days**, anything **Overdue**.
- Count the feed sacks and compare with **On hand**; fix a difference with **Adjust or record loss**.
- Enter the week's purchases and payments that are not already there: stock with **Buy stock**, everything else with **Record a transaction** ([record money](/guide/record-money)).
- Log a price you heard or were offered on **Plan**, **Prices** ([sell now or grow out](/guide/sell-now-or-grow-out)).

## Every month

- Close the month: catch up the ledger, reconcile **Cash on hand**, read the income statement and the cash flow, check each batch's profit and the unit costs ([keep the books](/guide/keep-the-books), [read the reports](/guide/read-the-reports)).
- For a batch nearing market weight, run the recommendation with the current offer before deciding when to sell.
- **Export file** in **Settings** and keep the file with the month's papers ([back up and sync](/guide/back-up-and-sync)).

## The dashboard is the summary

The dashboard shows the farm for the chosen period (the same period control as Finance):

| Tile | What it counts |
|---|---|
| **Pigs on farm** | Every active breeder plus the head of every batch, by stage. |
| Sows due | Open litters with a farrowing date in the next fourteen days, red when one is overdue. |
| **Batches ready to sell** | Batches whose estimated weight has reached market weight, or that have reached the age for it without a weighing. |
| **Cash on hand** | The ledger's closing balance to the period end. |
| **Revenue**, **Expenses**, **Profit** | The period's operating figures, the same as the income statement. |
| **Feed days left** | The shortest days-left figure among the feeds, from the last fourteen days' use. |
| **Deaths** | Deaths recorded in the period, breeders and batches. |

Below the tiles, the alerts in order of urgency (overdue farrowings, then stock, then batches ready, then the coming week's milestones), then four charts: revenue, expenses and profit by month; the herd count at each month end; the cost per kg gained per batch; and the liveweight prices you have logged. Every rule behind a tile, an alert or a chart is in [dashboard rules](/guide/dashboard-rules).`,
    sources: [],
  },
  {
    id: 'sell-now-or-grow-out',
    section: 'using',
    title: 'Sell now or grow out',
    summary: 'Ask the Plan page whether to sell a batch now or grow it on, feed it your own prices, read the recommendation and the price-swing table, and project a whole farm month by month with scenarios.',
    body: `## The question the Plan page answers

For pigs of a given weight, is it better to sell them now or to feed them on to roaster or market weight? **Plan** has three tabs: **Recommend** answers that for one batch, **Prices** keeps the prices the answer depends on, and **Scenarios** projects a farm of N sows on one strategy over one to three years. The reasoning is in [decision rules](/guide/decision-rules).

## Recommend

1. In **Pigs**, pick the **Batch**: its head count and its estimated weight today fill in. Or leave **Not from a batch** and type any **Head** and **Average weight now** to ask about pigs you are offered or thinking of buying.
2. In **Prices**, check the price fields: the weaner price per head, the market price per kg liveweight, the lechon price per kg live, and the feed prices. The badge says whether they come from your price log or from the knowledge defaults; the latest logged price of each kind is used, and you can overtype any figure for this run. Set the **Planned sale month** to apply the seasonal price index to the liveweight price, or leave **No adjustment**. The growth and mortality assumptions can be opened and edited below the prices.
3. Read the **Recommendation**: the strategies that apply to pigs of this weight, ranked by margin over selling now. Selling as weaners is the yardstick; each grow-out line says the weight and date it sells at, the revenue after expected mortality, the feed and other cash it needs first, and the margin per head and per day of waiting. Under the list: the **Break-even weaner price** (the weaner price at which growing on stops paying), the **Break-even lechon live price** where roasters apply, and for a weaner-weight batch the **Cash-neutral split**: how many to sell now so that their money feeds the rest.
4. **If prices move** repeats the margins with the sale price down 10% and 20% and the feed price up 10%. A recommendation that turns negative in the first column is a thin one.
5. **Assumptions** lists every figure the answer used, with its source row, so you can see what to argue with.

The app recommends; you decide. A trader's offer today, the state of the pens and the cash you need next week all weigh in, and the assumptions are averages; see [projection and recommendation assumptions](/guide/projection-assumptions).

## Prices

Every published price in the Guide is a dated observation, not today's market, see [price disclaimer](/guide/price-disclaimer). The recommendation gets better the moment you log your own. On **Prices**, in **Log a price**: the **Date**, the **Item** (weaner per head, market hog per kg liveweight, lechon-size pig per head, grower feed per 50 kg bag), the **Price (₱)**, the **Source** (**My own sale or purchase**, **Heard from a trader or neighbour** or **Published (PSA, DA, news)**), and optionally the **Market or buyer (optional)** and a note. **Save price**. The log below lists every observation; the newest of each item is what the recommendation uses, and the liveweight prices are charted on the dashboard. A wrong entry has a delete button that asks for a second tap. Log every sale you make and every offer you hear: two entries a month build a local price history no publication has.

## Scenarios

A scenario projects a farm you are thinking of running, not the one in your records. **Scenarios**, then **New scenario**: a **Name**, the number of **Sows**, the **Strategy** (weaners, roasters or market weight), the **Start date** (the day the sows are served), the horizon in **Months** (12 to 36), the **Startup cost (₱)** paid in the first month (pens, gilts, permits), and the assumptions (prices, piglets weaned per litter, litters per sow per year, mortality, labour per litter), pre-filled from the research and editable. **Save and project**.

The scenario page shows **Revenue**, **Expenses**, **Net**, the **Peak capital needed** (the deepest the cumulative cash goes before sales catch up) and the **Payback month** (when cumulative net first covers the startup cost), then the **Month by month** table of pigs on hand, revenue, expenses, net and cumulative, and the list of assumptions with their sources. Save two or three scenarios with different sow numbers or strategies and the **Scenarios** tab lays them **Side by side**. **Delete scenario** removes one after a second tap.

A scenario is a plan; the batch costing on the Finance page is what happened. Comparing the two after a year is the most useful thing the Plan page does, see [capital and payback](/guide/capital-and-payback).`,
    sources: [],
  },
]

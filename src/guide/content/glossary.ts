import type { GuideArticle } from '../types'

// The glossary article: the app's own vocabulary and the trade words the
// research documents define. Other articles contribute terms of their own;
// the Guide page collects them all.
export const GLOSSARY: GuideArticle[] = [
  {
    id: 'glossary',
    section: 'glossary',
    title: 'Glossary',
    summary: 'The words the app uses and the trade and Tagalog words you will meet when buying, selling and reading about pigs.',
    body: `## How to read the tables in the app

The app is in English; the Tagalog and trade words below are the ones the research documents use, with their meaning. Every article in the Guide can add terms of its own, and the Guide page lists them all together under this article.

## Animals

| Term | Tagalog or trade word | Meaning |
|---|---|---|
| Sow | | A female pig that has farrowed at least once |
| Gilt | | A young female pig not yet farrowed; becomes a sow at her first litter |
| Boar | | An uncastrated male kept for breeding |
| Piglet | | A pig from birth to weaning |
| Weaner | biik | A weaned piglet, sold in the trade at about 10 to 15 kg |
| Grower | | A pig from the weaner stage to about 50 to 60 kg |
| Finisher | | A pig in its last stage before market weight |
| Litter | | The piglets born to one sow at one farrowing; in the app, the record from service to weaning |
| Batch | | A group of pigs raised and costed together; a weaned litter becomes one |

## Trade

| Term | Tagalog or trade word | Meaning |
|---|---|---|
| Trader | viajero | A middleman who buys live pigs at the farm and sells to markets or slaughterhouses |
| Roaster | lechonero | A buyer who roasts whole pigs; buys per head by size |
| Roast pig | lechon | A whole roasted pig; lechon de leche is a small suckling-size one |
| Share-farming | paiwi | An arrangement where one party owns the pigs and another raises them for a share of the proceeds |
| Boar hire | pakasta | Hiring a boar for natural service |
| Rice bran | darak | A local feed by-product |

## App figures

| Term | Meaning |
|---|---|
| ADG | Average daily gain: kg gained per day between two weighings |
| FCR | Feed conversion ratio: kg of feed per kg of live weight gained |
| Head-day | One pig for one day; the unit used to share costs between batches |
| Withdrawal period | The days after a treatment before the pig may be slaughtered for food |
| Capital | A purchase that lasts for years (pens, equipment, breeding stock), kept out of the income statement |
| Net income | Revenue less expenses for a period; the dashboard calls it profit |
| Net cash | Every peso in less every peso out for a period, capital and loans included |
| Break-even price | The sale price that recovers the whole cost of a batch |
| Payback | The day or month the operating result has covered the capital spent |
| Peak capital | The most cash a scenario needs before it turns |

The rules behind the app figures are in [how Oinkonomics works](/guide/how-the-app-works).`,
    sources: [],
    terms: [
      { term: 'Weaner', tagalog: 'biik', meaning: 'A weaned piglet, sold in the trade at about 10 to 15 kg' },
      { term: 'Trader', tagalog: 'viajero', meaning: 'A middleman who buys live pigs at the farm and sells to markets or slaughterhouses' },
      { term: 'Roaster', tagalog: 'lechonero', meaning: 'A buyer who roasts whole pigs; buys per head by size' },
      { term: 'Roast pig', tagalog: 'lechon', meaning: 'A whole roasted pig; lechon de leche is a small suckling-size one' },
      { term: 'Share-farming', tagalog: 'paiwi', meaning: 'One party owns the pigs and another raises them for a share of the proceeds' },
      { term: 'Boar hire', tagalog: 'pakasta', meaning: 'Hiring a boar for natural service' },
      { term: 'Rice bran', tagalog: 'darak', meaning: 'A local feed by-product' },
      { term: 'Sow', meaning: 'A female pig that has farrowed at least once' },
      { term: 'Gilt', meaning: 'A young female pig not yet farrowed' },
      { term: 'Boar', meaning: 'An uncastrated male kept for breeding' },
      { term: 'Litter', meaning: 'The piglets born to one sow at one farrowing; in the app, the record from service to weaning' },
      { term: 'Batch', meaning: 'A group of pigs raised and costed together' },
      { term: 'ADG', meaning: 'Average daily gain: kg gained per day between two weighings' },
      { term: 'FCR', meaning: 'Feed conversion ratio: kg of feed per kg of live weight gained' },
      { term: 'Head-day', meaning: 'One pig for one day; the unit used to share costs between batches' },
      { term: 'Withdrawal period', meaning: 'The days after a treatment before the pig may be slaughtered for food' },
      { term: 'Break-even price', meaning: 'The sale price that recovers the whole cost of a batch' },
      { term: 'Peak capital', meaning: 'The most cash a scenario needs before it turns' },
    ],
  },
]

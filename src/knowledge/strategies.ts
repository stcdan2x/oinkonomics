import type { StrategyId } from '../types'

// Strategy catalog, condensed from research/business-models-and-strategies.md
// "Strategy catalog" (the `catalog` number is that section's entry; sources are
// research/parameters.md row ids). The Guide (P8) carries the full text.
export interface StrategyInfo {
  name: string
  catalog: number | null
  description: string
  cashCycle: string
  wins: string
  loses: string
  risks: string
  sources: string[]
}

export const STRATEGY_INFO: Record<StrategyId, StrategyInfo> = {
  sellWeaners: {
    name: 'Sell weaners (biik)',
    catalog: 1,
    description: 'Sell the litter at or soon after weaning, at about 10 to 15 kg, before the piglets need starter and grower feed.',
    cashCycle: 'Cash 30 to 60 days after farrowing; 145 to 175 days from service. The shortest cycle and the least cash cost of the sow-based strategies.',
    wins: 'Weaner price at or above the break-even weaner price, a litter of 9 or more weaned, little cash for grower feed, or restocking demand after ASF culls.',
    loses: 'Piglet buyers are scarce or pay below the break-even, pre-weaning mortality runs at 16 percent or worse, or a movement ban stops piglet trade.',
    risks: 'Piglet price season, crushing losses, ASF bans; ASF cash assistance pays nothing for suckling piglets.',
    sources: ['BM-01', 'BM-02', 'BM-16', 'BM-17', 'BM-18', 'PC-54', 'PC-58', 'PC-59', 'PM-27'],
  },
  growToRoaster: {
    name: 'Grow to roaster (lechon) size',
    catalog: 2,
    description: 'Keep the pigs to the live weights lechoneros buy (whole lechon 14 to 31 kg live) and sell per head to a roaster or a fiesta host.',
    cashCycle: 'Sale at about 75 to 95 days of age for 20 to 25 kg live; 25 to 40 days beyond the weaner stage.',
    wins: 'A roaster or caterer orders per head in advance at a price above the break-even lechon price, starter feed is on hand and piglet prices are weak.',
    loses: 'No roaster order, so the pig sells per kg at the market-hog price and the extra feed earns less than the weaner premium; an ASF restriction closes the lechon trade.',
    risks: 'Buyer default on per-head orders, feed-change scours, size overshoot past the ordered band. No primary source prices live lechon pigs.',
    sources: ['BM-59', 'BM-60', 'BM-61', 'BM-62', 'BM-63', 'GN-09', 'GN-10', 'GN-35', 'RK-34'],
  },
  growToMarket: {
    name: 'Grow to market weight',
    catalog: 3,
    description: 'Grow the pigs to 80 to 100 kg and sell live per kg to a viajero, a meat vendor or the slaughterhouse. The same arithmetic applies to bought weaners (catalog 4).',
    cashCycle: 'Sale at 140 to 168 days of age (120 to 150 days from a 10 to 15 kg weaner). The longest cycle; feed is paid week by week before any revenue.',
    wins: 'Liveweight price above cost per kg, feed bought at mill or cooperative prices, weaner price below the break-even weaner price, pigs sold inside the 80 to 100 kg window.',
    loses: 'Prices fall below cost (losses of 1,000 to 4,200 per head were reported in 2025 to 2026), an ASF lockdown traps finished pigs, feed prices spike or growth stalls.',
    risks: 'Price, feed price, ASF, mortality, trader lowballing; the highest cash exposure per cycle.',
    sources: ['BM-04', 'BM-08', 'BM-09', 'BM-10', 'BM-19', 'BM-27', 'BM-28', 'BM-83', 'BM-84', 'GN-33', 'GN-34', 'PM-01', 'PM-19', 'PM-20', 'PM-35', 'RK-36'],
  },
  undecided: {
    name: 'Undecided',
    catalog: null,
    description: 'No strategy chosen yet; the Plan page compares the three above for this batch.',
    cashCycle: '',
    wins: '',
    loses: '',
    risks: '',
    sources: [],
  },
}

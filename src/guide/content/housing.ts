import type { GuideArticle } from '../types'

// Housing and daily routine, compiled from research/housing-and-operations.md
// (row prefix HO- in research/parameters.md).

export const HOUSING: GuideArticle[] = [
  {
    id: 'site-and-building',
    section: 'housing',
    title: 'Site and building',
    summary: 'Where to put the pig house, which way to face it, and the roof, walls, floors, partitions and walkways the Philippine standard asks for.',
    body: `## Choosing the site

The Philippine swine housing standard (PAES 401:2001) asks for a well-drained site with free air movement. It should be reachable by a service road and close to water and electric lines. Place the house so the prevailing wind does not carry smell to your own home or your neighbours. The site must also fit the local land-use plan. Distance rules from houses and water are set by your municipality: see [Local rules for small piggeries](/guide/local-rules-for-small-piggeries).

## Orientation

Build the long side of the house running east to west (HO-36). The sun then travels along the ridge instead of across it, and the roof shades the pens for most of the day. FAO's tropical guide says a roof with 3 m or more under the eaves gives better shade than a low one (HO-30).

## Roof, walls and ceiling

- Roof: corrugated GI sheets or another durable material, with at least 1 m of overhang for shade and rain (HO-31). Fit gutters so rainwater drains away from the pens. A Bulacan survey found shed roofs common in one town and monitor roofs (an open ridge that lets hot air out) in another.
- Sidewalls: at least 1 m high, of durable material (HO-32).
- Ceiling: optional, at least 2.4 m high if fitted (HO-30).

## Floors

Pour concrete on well-compacted gravel, skid resistant but not rough enough to injure feet. Slope solid floors 2 to 4 percent toward a gutter and away from the feed trough (HO-28). FAO gives 80 to 100 mm of concrete on a consolidated gravel base, mix 1:2:4 or 1:3:5 (HO-29). Wood floors are not recommended: they rot and stay wet.

Slatted floors are allowed. Concrete slats are preferred for pigs over 30 kg, including pregnant sows. Slat width and gap change with the size of the pig (HO-24 to HO-27):

| Pigs | Slat width | Gap |
|---|---|---|
| Farrowing pens and piglets to 30 kg | 18 to 25 mm | 8 to 9 mm |
| Weaners 5 to 30 kg | 18 to 25 mm | 10 to 14 mm |
| Finishers 30 to 100 kg | 60 to 100 mm | 10 to 20 mm |
| Sows, boars, pigs over 100 kg | 80 to 125 mm | 10 to 25 mm |

## Partitions, gates and walkways

- Partition heights: 0.70 m for pigs under 25 kg, 0.90 m for 25 to 100 kg, 1.00 m for sows, 1.20 m for boars (HO-33). Solid or slotted, with slots of 160 to 210 mm.
- Gates: 0.6 m wide and 0.9 to 1.0 m high, 0.75 m for weanlings, made of 10 mm bars or 30 mm pipe on a GI frame (HO-34).
- Walkways: at least 1.5 m for the main walkway and 1.0 m for secondary ones (HO-35).

## Feed store and lighting

Keep feed in a ventilated, mesh-screened room sized for two weeks' supply (HO-70). Lighting should give 150 lux in breeding, gestation and farrowing areas, 100 lux in the nursery, 50 lux in grow-finish pens and 200 lux where you inspect pigs (HO-68). Light must be available at night. Bulb counts are in [Water and electricity](/guide/water-and-electricity). Pen sizes by stage are in [Pen space by stage](/guide/pen-space-by-stage).`,
    sources: ['HO-24', 'HO-25', 'HO-26', 'HO-27', 'HO-28', 'HO-29', 'HO-30', 'HO-31', 'HO-32', 'HO-33', 'HO-34', 'HO-35', 'HO-36', 'HO-68', 'HO-70'],
    terms: [
      { term: 'Monitor roof', meaning: 'A roof with an open ridge along the top that lets hot air escape from the pig house.' },
      { term: 'Slatted floor', meaning: 'A floor of concrete, plastic or metal bars with gaps between them so manure and urine fall through to a pit or drain below.' },
    ],
  },
  {
    id: 'pen-space-by-stage',
    section: 'housing',
    title: 'Pen space by stage',
    summary: 'The Philippine minimum floor space per pig at each stage, how many pigs to put in a pen, and the trough and drinker space they need.',
    body: `## Why space matters

Crowded pigs grow slower. US research puts the space for maximum growth at 0.0336 times body weight in kg to the power 0.67, which is about 0.72 m2 at 100 kg. Every 3 percent less space costs about 1 percent of daily gain (HO-23). The Philippine minimums below are legal floors, not targets. Add 20 to 30 percent where the pen has a separate dunging area (HO-01), and about 20 percent more when the house is above 25 °C (HO-66).

## Pen space table

Floor space is the PAES 401:2001 minimum, which is the same in DA Administrative Order 41. Row ids point to the research parameter table behind this Guide.

| Stage | Floor space per head (PH minimum) | Heads per pen | Feeder space | Drinkers | Source |
|---|---|---|---|---|---|
| Farrowing sow and litter, own pen | 7.40 m2 (DA Cagayan Valley guide 4.5 to 6.0) | 1 sow and litter | own trough, at least 300 mm wide | 1 nipple or cup for the sow plus a piglet drinker | HO-13, HO-38 |
| Farrowing, multi-suckling group | 5.60 m2 per sow and litter | 2 to 4 sows | as above, per sow | 1 cup per 10 sows | HO-14, HO-41 |
| Nursery or weaner, to 20 kg | 0.11 m2 to 10 kg; 0.20 m2 at 11 to 20 kg (FAO 0.25 to 0.35) | 10 to 25, same size together | 150 mm of trough per head at 15 to 25 kg; 4 pigs per feeder hole | 1 nipple per 10 or 1 cup per 20; nipple at 305 mm | HO-01, HO-02, HO-37, HO-39, HO-41, HO-42 |
| Grower 21 to 60 kg | 0.35 m2 at 21 to 40 kg; 0.50 m2 at 41 to 60 kg | up to 25; groups of 9 to 12 grow better | 200 mm at 25 to 50 kg, 250 mm at 50 to 75 kg; 3 per feeder hole | 1 nipple per 12 to 15, at 450 to 650 mm, spaced 450 mm | HO-03, HO-04, HO-20, HO-37, HO-40, HO-42, HO-43 |
| Finisher 61 to 100 kg | 0.70 m2 at 61 to 80 kg; 0.85 m2 at 81 to 100 kg (DA CV 0.84 to 1.11) | up to 25 | 300 mm at 75 to 100 kg, 350 mm at 100 to 130 kg | 1 nipple per 12 to 15, spaced 600 to 900 mm | HO-05, HO-06, HO-20, HO-37, HO-40, HO-43 |
| Gilts up to mating | 1.00 m2 | 6 to 12 | 350 mm per head over 100 kg | 1 cup per 12 gilts or 1 nipple per 12 to 15 | HO-07, HO-37, HO-41 |
| Pregnant sows, group | 1.20 m2 (dry sows 1.80 m2) | 6 to 12 | 350 mm per sow so all eat at once | 1 cup per 10 sows or 1 nipple per 12 to 15 | HO-08, HO-10, HO-41 |
| Pregnant sow, stall | 0.66 m x 1.8 m (AO 41: 0.6 m x 2.0 m) | 1 | own trough | 1 per stall | HO-09 |
| Adult pigs in groups | 2.50 m2 | group | 350 mm per head | 1 cup per 10 | HO-11 |
| Boar | 7.50 m2, shortest side 2.5 m | 1 | own trough | 1 nipple or cup | HO-12 |

Worked examples from the standard: a 1.5 m x 4.8 m pen (7.2 m2) holds 20 growers at 0.36 m2 each (HO-21) or 10 finishers at 0.72 m2 each (HO-22). Keep growers and finishers in separate pens of not more than 25 head (HO-20).

## Feeder space

Give every pig its trough length by weight: 150 mm at 15 to 25 kg, 200 mm at 25 to 50 kg, 250 mm at 50 to 75 kg, 300 mm at 75 to 100 kg and 350 mm at 100 to 130 kg (HO-37). The trough should be at least 300 mm wide and 250 mm deep (HO-38). If you feed by hand rather than ad libitum, there must be room for every pig to eat at the same time. Water troughs need the same length as feed troughs, but do not put waterers beside the feed trough.

## Drinker space

One nipple serves 10 nursery pigs (HO-39) or 12 to 15 growing and finishing pigs (HO-40). A cup or bowl serves 20 weaners, 12 gilts or 10 sows (HO-41). Set nipples at 305 mm for weanlings and 450 to 650 mm for sows and grow-finish pigs (HO-42), spaced 300 mm in the nursery, 450 mm for growers and 600 to 900 mm for finishers and sows (HO-43). Flow rates and daily water needs are in [Water and electricity](/guide/water-and-electricity). Farrowing pen details are in [Farrowing pen](/guide/farrowing-pen). How to use the weight bands when moving pigs is in [Growth stages](/guide/growth-stages).`,
    sources: ['HO-01', 'HO-02', 'HO-03', 'HO-04', 'HO-05', 'HO-06', 'HO-07', 'HO-08', 'HO-09', 'HO-10', 'HO-11', 'HO-12', 'HO-13', 'HO-14', 'HO-20', 'HO-21', 'HO-22', 'HO-23', 'HO-37', 'HO-38', 'HO-39', 'HO-40', 'HO-41', 'HO-42', 'HO-43', 'HO-66'],
    terms: [
      { term: 'Dunging area', meaning: 'The part of a pen set aside for manure and urine, kept separate from where the pigs lie. Pens with one need 20 to 30 percent more floor space.' },
      { term: 'Nipple drinker', meaning: 'A metal valve the pig bites or pushes to release water. Set at the height of the smallest pig in the pen.' },
    ],
  },
  {
    id: 'farrowing-pen',
    section: 'housing',
    title: 'Farrowing pen',
    summary: 'Crate sizes, the creep area for piglets and its temperature, guard rails for pens without a crate, and how long a sow may stay confined.',
    body: `## The crate

PAES 401:2001 says farrowing pens shall have crates to stop the sow crushing her piglets. The minimum crate is 1.80 m long (HO-15) and 0.60 m wide (HO-16), with a stall height of 1.00 m (HO-18). A creep area 0.50 m wide on each side gives a pen footprint of 1.5 m x 1.8 m (HO-17). The whole pen is 7.40 m2 minimum in the standard; the DA Cagayan Valley guide allows 4.46 to 5.95 m2 (HO-13).

DA Administrative Order 41 sizes the crate to the sow. At 120 kg the total length is 2.10 m (1.60 m lying area, 0.20 m rump rail, 0.30 m trough); at 180 kg it is 2.35 m (HO-15). Width is 0.80 to 0.90 m at floor level and 0.50 m from 200 mm to 1,000 mm above the floor (HO-16). The bottom rail sits 180 to 200 mm above the floor.

Floor slats in the farrowing pen must be narrow: 18 to 25 mm wide with gaps of only 8 to 9 mm so piglet feet do not fall through (HO-24).

## Pen without a crate

If you rear the litter in a pen without a crate, fit guard rails 250 mm out from the wall and 250 mm above the floor (HO-19). The sow cannot then pin a piglet against the wall when she lies down.

## The creep area

Piglets need more warmth than the sow. Hold the creep at 27 to 35 °C for the first 3 days (HO-57); AO 41 says 32 °C for up to three weeks. Give artificial heat for at least the first 7 to 14 days (HO-58). A 100 W bulb over the piglet box is usually enough, changed to 50 W after 14 days (HO-59). Hang the lamp 762 mm above the floor, or 152 mm above the sow's back (HO-60). Piglets piled on each other are cold; piglets spread out are comfortable.

## How long the sow stays

AO 41 strongly recommends not keeping a sow in a farrowing crate for more than one month at a time, and not more than 6 weeks in stalls and crates combined (HO-106). Plan the pen for 38 to 45 days per litter: 7 days to settle in before farrowing, 28 to 35 days of lactation and 3 days to clean and disinfect (HO-71). After cleaning, leave the room empty 5 to 7 days (HO-97).

Pens needed = sows x litters per sow per year x occupancy days / 365 x 1.1 (HO-74). Check that farrowings do not overlap in the [Breeding calendar](/guide/breeding-calendar). What happens in the pen is in [Farrowing](/guide/farrowing) and the [Farrowing week checklist](/guide/farrowing-week-checklist); a dated crate price is in [Construction and equipment costs](/guide/construction-and-equipment-costs).`,
    sources: ['HO-13', 'HO-15', 'HO-16', 'HO-17', 'HO-18', 'HO-19', 'HO-24', 'HO-57', 'HO-58', 'HO-59', 'HO-60', 'HO-71', 'HO-74', 'HO-97', 'HO-106'],
    terms: [
      { term: 'Farrowing crate', meaning: 'A metal frame in the farrowing pen that limits how the sow can move, so she cannot roll onto or crush her piglets.' },
      { term: 'Creep area', meaning: 'The heated space beside the farrowing crate where piglets can lie away from the sow. Kept at 27 to 35 °C in the first days.' },
      { term: 'Guard rail', meaning: 'A bar fixed 250 mm from the wall and 250 mm above the floor in a farrowing pen without a crate, so piglets are not pinned against the wall.' },
    ],
  },
  {
    id: 'ventilation-and-heat-stress',
    section: 'housing',
    title: 'Ventilation and heat stress',
    summary: 'The temperatures pigs can take, how to move air through the house, and the showers, sprinklers and feeding changes that keep pigs growing in the hot months.',
    body: `## Temperature limits

PAES 401:2001 sets a maximum still-air temperature of 30 °C for sows, boars, weaners, growers and finishers, and 35 °C for newborn piglets (HO-56). AO 41 gives comfort ranges of 15 to 30 °C for adults and 27 to 35 °C for newborns.

Research puts the real upper limits lower than that. A lactating sow starts to suffer above 21 °C, with comfort ending at 18 °C (HO-61). A pregnant sow's limit is 26 °C and an empty sow's 29 °C (HO-62). A finisher over 60 kg is stressed above 25 °C, a 30 kg grower above 28 °C, a 20 kg piglet above 30 °C and an 8 kg piglet above 35 °C (HO-63). Big pigs and milking sows feel the heat first; small piglets need warmth. Most Philippine days sit above these limits, so cooling is routine.

## Signs of heat stress

The clearest sign in the research document is lost appetite. In one study, lactating sows ate 4.9 kg a day at 20 °C and only 2.8 kg a day at 30 °C (HO-61). A sow that eats less milks less, and the litter grows slower. Heat-stressed pigs also need more space: AO 41 asks for about 20 percent more floor area above 25 °C (HO-66).

## Ventilation

Use natural ventilation first. Put ridge or chimney outlets on the downwind side and inlets (vent doors, curtains) along the long sides. A high eave and a wide overhang keep the sun off the pens: see [Site and building](/guide/site-and-building). If you add fans, the minimum rates are 0.28 m3 per minute for a farrowing unit or for breeding and pregnant sows, 0.08 for the nursery and 0.12 for grow-finish (HO-67), with fans on the side opposite the prevailing wind.

## Cooling

- Showers or sprinklers: the standard puts water spray nozzles about 1.8 m above the floor, pointing straight down and covering the pen width (HO-64). A measured protocol on fattening pigs in summer ran low-intensity showers for 2 minutes every 30 minutes from 12:00 to 19:00, about 15 showers and 4 L of water per pig a day, and raised hot carcass weight by 4.72 percent (HO-65). Use large droplets on the pig, not a fine mist.
- Sprinkle water on pregnant sows when the weather is too hot (DA Cagayan Valley guide).
- Give at least twice as much water on hot days (HO-54) and check that every drinker flows.
- Feed in the cool hours, early morning and evening.
- Lower the stocking density in the hot months (HO-66).

FAO mentions wallows, but no source giving wallow size or water use was found; that is an open question. Cooling water is on top of drinking water: see [Water and electricity](/guide/water-and-electricity) and [Water](/guide/water).`,
    sources: ['HO-54', 'HO-56', 'HO-61', 'HO-62', 'HO-63', 'HO-64', 'HO-65', 'HO-66', 'HO-67'],
    terms: [{ term: 'Heat stress', meaning: 'When a pig is hotter than its upper temperature limit. It eats less, grows slower and, in a lactating sow, gives less milk.' }],
  },
  {
    id: 'construction-and-equipment-costs',
    section: 'housing',
    title: 'Construction and equipment costs',
    summary: 'The dated Philippine cost observations for pig housing, start-up capital, a farrowing crate and utilities, and what the research could not find.',
    body: `## What is known

No Philippine primary source gives a current cost per square metre for pig pens. The research document lists these dated observations instead. Each carries its date; do not read them as today's prices.

| Item | Amount | Basis |
|---|---|---|
| Backyard fattening unit, 40 head per cycle, building and vehicle | ₱148,000 | PIDS Discussion Paper 2022-19, at 2018 prices (HO-84) |
| Commercial fattening farm, 1,408 head, building and vehicle | ₱3,450,000 | same source, 2018 prices (HO-85) |
| Start-up capital, backyard raisers in Bulacan | under ₱50,000 for 73 percent in San Jose del Monte; ₱50,000 to 100,000 for 43 percent in Santa Maria | survey year 2014 (HO-86) |
| Fabricated farrowing pen (cast-iron sow floor, plastic piglet mat, stainless feeder, two piglet drinkers) | ₱135,000 | one supplier listing, undated page, observed 2026-09-01; single 5.6 x 7 ft or twin 11 x 7 ft, and the listing does not say which the price covers (HO-87) |
| Utilities per cycle, about 10 pigs, 3 to 4 months | ₱1,950 | Mlang, Cotabato survey published April 2026 (HO-88) |

The PIDS paper assumes backyard housing lasts about 3 years and commercial housing 6 to 10 years, with repairs and maintenance at 1 percent of the building and vehicle cost a year (HO-84). Backyard farms in the Bulacan survey used inexpensive housing, ordinary feeders and drinkers, concrete floors, natural ventilation and the household water and power supply. In Mlang most houses had a concrete floor and iron roof; a few had wooden walls and a thatched roof.

## What to budget for

The DA Cagayan Valley guide lists the investment items for a breeding farm: a hog house with concrete floor, a farrowing house or stall, a house for gilts and dry or pregnant sows, a boar house (not needed if you use AI), a weanling house, a growing-fattening house, an isolation house, a water pump, an electrical connection, a hog scale (a portable unit or a weighing tape), spade, fork, wheelbarrow and rake. On top of that come seed stock, feed, veterinary supplies, livestock insurance, labour and repairs. A 2006 US budget shows equipment adding roughly half again on top of the farrowing building shell; the document says that ratio is the only useful part of it for Philippine planning.

## What is not known

The research could not find, from a primary source, the current (2024 to 2026) cost per square metre of a pig pen, current Philippine prices for feeders, nipple drinkers, weighing scales, heat lamps and gestation stalls, or the current cost of a small biogas digester. Treat any figure you enter for these as your own quote. The app's start-up cost in a scenario is your number, not a default: see [Capital and payback](/guide/capital-and-payback) and [Projection assumptions](/guide/projection-assumptions). Pen sizes to price are in [Pen space by stage](/guide/pen-space-by-stage); biogas and vermicompost figures are in [Waste and odour](/guide/waste-and-odour).`,
    sources: ['HO-84', 'HO-85', 'HO-86', 'HO-87', 'HO-88'],
    prices: true,
  },
  {
    id: 'water-and-electricity',
    section: 'housing',
    title: 'Water and electricity',
    summary: 'How much water each class of pig drinks, drinker flow rates and settings, and the lighting, creep heat, pump and standby power a small piggery needs.',
    body: `## Daily water per pig

DA Administrative Order 41 gives these drinking needs at normal temperature:

| Pig | Litres per day |
|---|---|
| Up to 10 kg | 1.2 to 1.5 (HO-47) |
| 11 to 25 kg | 2.3 to 2.5 (HO-48) |
| 26 to 50 kg | 3.0 to 5.0 (HO-49) |
| 51 to 120 kg | 6.0 to 8.0 (HO-50) |
| Boar | 5 to 10 (HO-51) |
| Pregnant sow or gilt | 5 to 10 (HO-52) |
| Lactating sow | 15 to 30 (HO-53) |

US figures run higher for the breeding herd: 7.6 to 15 L for pregnant sows and 7.6 to 25 L for lactating sows, with herd averages up to 37 L (HO-53). Pigs drink 2 to 3 L of water per kg of dry feed (HO-55). On hot days give at least twice as much (HO-54).

Your reserve must cover 24 hours of demand. The document's derived sizing example for a 5-sow farrow-to-finish unit (2 lactating sows, 3 pregnant, 1 boar, 20 weaners, 40 growers and finishers) comes to about 500 L a day for drinking alone, using the upper AO 41 values, before washing and cooling water.

## Water quality

Test the water for salts, minerals and microbes at least once when you start and whenever something looks wrong, and write the result down (see [Labour and routine](/guide/labour-and-routine)). Clean pipes and tanks regularly so biofilm does not build up, and set nipple pressure correctly.

## Drinker settings

Nipple flow should be 250 to 500 mL per minute in the nursery (HO-44), 500 to 1,000 mL per minute for growers and finishers (HO-45) and 1,000 mL per minute for the breeding herd (HO-46). Check a nipple by holding a cup under it for one minute. Pigs per drinker and mounting heights are in [Pen space by stage](/guide/pen-space-by-stage). Feed-related water advice is in [Water](/guide/water).

## Lighting

PAES 401:2001 converts its lux targets (HO-68) into bulbs per square metre (HO-69):

| Area | Lux | 40 W incandescent bulbs per m2 | 40 W fluorescent tubes per m2 |
|---|---|---|---|
| Breeding, gestation, farrowing | 150 | 0.597 | 0.080 |
| Nursery | 100 | 0.398 | 0.053 |
| Growing and finishing | 50 | 0.199 | 0.027 |

So a 7.2 m2 grower pen needs about 1.4 incandescent bulbs, or one fluorescent tube shared with the next pen. Light must be available at night.

## Creep heat

One 100 W bulb per litter, dropped to 50 W after 14 days (HO-59), hung 762 mm above the floor (HO-60), for at least the first 7 to 14 days (HO-58). See [Farrowing pen](/guide/farrowing-pen).

## Other loads and power failure

Fans are needed only when natural ventilation is not enough (HO-67). A water pump and an electrical connection are investment items in the DA Cagayan Valley list. The GAHP standard asks for a continuous supply of adequate power, and AO 41 for periodic checks of the wiring, a fallback for heating, lighting, ventilation, feeding and watering when the power fails, and firefighting equipment. A backyard survey in Cotabato put utilities at ₱1,950 per 3 to 4 month cycle for about 10 pigs (Mlang, published April 2026) (HO-88).`,
    sources: ['HO-44', 'HO-45', 'HO-46', 'HO-47', 'HO-48', 'HO-49', 'HO-50', 'HO-51', 'HO-52', 'HO-53', 'HO-54', 'HO-55', 'HO-58', 'HO-59', 'HO-60', 'HO-67', 'HO-68', 'HO-69', 'HO-88'],
    prices: true,
      },
  {
    id: 'waste-and-odour',
    section: 'housing',
    title: 'Waste and odour',
    summary: 'How much manure pigs make, where it must go, what the Clean Water Act and your municipality require, and the compost, vermicast and biogas options.',
    body: `## How much waste

A growing or finishing pig of 21 to 100 kg produces 0.39 to 0.45 kg of manure a day on a dry-matter basis (HO-76). The dry matter holds about 7.2 percent nitrogen, 1.9 percent phosphorus and 3.2 percent potassium, so it has value as fertiliser.

## Drainage and containment

Slope floors 2 to 4 percent to a gutter or canal (HO-28). The GAHP standard asks for a drainage system leading to a treatment facility, manure and leftover feed removed from surfaces, and odour kept to a minimum.

The Moncada, Tarlac ordinance is a typical local rule: all waste stays inside the compound and never drains to a public canal or waterway; solid waste goes onto a container or dry surface; large piggeries need a watertight concrete septic tank sized to the stock, at least 30 m from groundwater and not under any building (HO-83). Your municipality's rule may differ: see [Local rules for small piggeries](/guide/local-rules-for-small-piggeries).

## The law on discharges

Any discharge to a water body must meet the DENR General Effluent Standards (DAO 2016-08). Wastewater with 3,000 mg/L BOD or more counts as strong wastewater under its Table 10 (HO-116). Breaking the Clean Water Act (RA 9275) carries fines of ₱10,000 to ₱200,000 per day, rising 10 percent every two years (2017 rules) (HO-115). Storing manure is an "offensive trade" under the Sanitation Code (PD 856), which needs a sanitary permit from the local health office before you start. More in [Environmental rules](/guide/environmental-rules).

## Dead pigs

Bury at least 50 cm deep with lime or disinfectant and at least 50 cm of soil cover, away from water and flooding, or use a carcass pit (HO-82). Record the death. If ASF is suspected, follow [ASF: what to do on suspicion](/guide/asf-what-to-do-on-suspicion) first.

## Turning waste into value

- Compost and vermicompost: Central Luzon State University established the African night crawler for Philippine vermicomposting; vermicompost from 75 percent pig manure and sawdust matched chemical fertiliser on cabbage. A CLSU centre produced 8 tons of vermicast a month valued at ₱56,000, about ₱7 per kg, in 2005 (HO-81). No current vermicast price was found.
- Biogas: a 1997 national programme found a household with at least 6 pigs made enough gas to cook for a family of 6 (HO-78), saving ₱160 a month and paying back the digester in 11 months, in 1997 pesos (HO-79). A Philippine fixed-dome home digester of 8 m3 cost ₱22,800 in January 2006, ₱16,800 materials plus ₱6,000 labour (HO-80). A 40 kg pig gives about 182 g of volatile solids a day, and 0.61 kg of volatile solids makes 1 m3 of methane (HO-77). No 2024 to 2026 digester price was found.

## Cleaning between batches

Remove all manure and debris, then clean and disinfect with a registered disinfectant before the next batch; PAES allows 3 days per batch (HO-71). Farrowing rooms rest empty 5 to 7 days after disinfection (HO-97). Record the date, pen, product and rest days: see [Biosecurity checklist](/guide/biosecurity-checklist).`,
    sources: ['HO-28', 'HO-71', 'HO-76', 'HO-77', 'HO-78', 'HO-79', 'HO-80', 'HO-81', 'HO-82', 'HO-83', 'HO-97', 'HO-115', 'HO-116'],
    prices: true,
    terms: [
      { term: 'Vermicast', meaning: 'The compost left after earthworms digest manure and plant waste. Sold as fertiliser; a CLSU centre valued it at about ₱7 per kg in 2005.' },
      { term: 'Biogas digester', meaning: 'A sealed tank or tube where manure ferments without air and gives off methane for cooking. A household needs about 6 pigs to cook on it.' },
      { term: 'BOD', meaning: 'Biochemical oxygen demand, the measure of how much organic pollution wastewater carries. Piggery wastewater at 3,000 mg/L or more is "strong wastewater" under DENR rules.' },
    ],
  },
  {
    id: 'local-rules-for-small-piggeries',
    section: 'housing',
    title: 'Local rules for small piggeries',
    summary: 'What counts as backyard or commercial, the zoning and distance rules from HLURB, GAHP and a sample municipal ordinance, and when DENR coverage starts.',
    body: `## Backyard or commercial

For statistics, the GAHP standard (PNS/BAFS 267:2019) calls a farm backyard if it keeps 1 to 20 adults and no young, or 1 to 40 young, or 1 to 9 adults with 1 to 21 young. It is commercial at 21 or more adults, or 41 or more young, or 10 or more adults with 22 or more young (HO-108). A 10-sow farm with a boar and growers on hand crosses the commercial line. See [Farm classification](/guide/farm-classification).

## Zoning and distance

- HLURB Resolution R-674 s.2000 sets the rules for locational clearance. Its Annex A, from a secondary copy, calls a piggery backyard at one sow and 10 heads or less, allowed only in rural areas on not more than 30 percent of the lot (HO-110). Medium (2 sows, 11 to 20 heads) and large farms must be at least 25 m from groundwater, 1,000 m from built-up areas, 500 m from major roads and 1,000 m from other farms (HO-111). These figures come from the reproduction, not the official text.
- GAHP siting is a voluntary standard for commercial farms: 3 km from a national highway, 1 km from other farms and built-up areas, 5 km from slaughterhouses (HO-112).
- Your municipality sets its own numbers. The Moncada, Tarlac ordinance of 2020 is one example: small-scale is up to 4 head including one sow or boar, medium up to 10 head with 2 sows and a boar, large up to 20 head; piglets under 50 days are not counted. No hog raising in built-up areas. Small pens must be at least 15 m from the nearest house, medium and large at least 30 m (HO-113). Fines run up to ₱2,500 per offence, with the permit revoked on the third (HO-114). A legal commentary from May 2026 (secondary) says typical ordinances ask 100 to 300 m from residences and 50 to 200 m from water, and that no national law fixes a backyard distance. Ask your municipal agriculture office for your ordinance.
- The Sanitation Code (PD 856) requires a sanitary permit for manure storing but sets no piggery distance.

## Permits (the Moncada example)

Small scale: barangay clearance with an ocular inspection report, community tax certificate, sanitary inspection clearance, veterinary health certificate, then the Mayor's business permit. Medium and large add BIR registration, locational clearance and building and occupancy permits. See [Permits and registrations](/guide/permits-and-registrations).

## DENR coverage

Under EMB Memorandum Circular 2014-005, a piggery of 100 heads or fewer is not covered by the environmental impact system and may secure a Certificate of Non-Coverage (CNC). More than 100 but fewer than 5,000 heads need an ECC through an IEE checklist; 5,000 or more need a full EIS (HO-109). A farm of 1 to 10 sows with progeny normally stays under 100 head, but its wastewater must still meet the effluent standards if it reaches a water body: see [Waste and odour](/guide/waste-and-odour) and [Environmental rules](/guide/environmental-rules). The thresholds come from an EMB presentation, as the official PDF could not be fetched.`,
    sources: ['HO-108', 'HO-109', 'HO-110', 'HO-111', 'HO-112', 'HO-113', 'HO-114'],
    prices: true,
    terms: [
      { term: 'CNC', meaning: 'Certificate of Non-Coverage, the DENR paper saying a project is too small for the environmental impact system. Piggeries of 100 heads or fewer qualify.' },
      { term: 'ECC', meaning: 'Environmental Compliance Certificate, needed by piggeries of more than 100 heads.' },
      { term: 'GAHP', meaning: 'Good Animal Husbandry Practice, the voluntary Philippine standard PNS/BAFS 267:2019 for swine farms.' },
      { term: 'Backyard farm', meaning: 'For statistics, a farm with 1 to 20 adult pigs and no young, or 1 to 40 young, or 1 to 9 adults with 1 to 21 young. Municipal ordinances use their own smaller head counts.' },
    ],
  },
  {
    id: 'labour-and-routine',
    section: 'housing',
    title: 'Labour and routine',
    summary: 'Who does the work on a small farm, how often pigs and equipment must be inspected, and what gets written down at each event.',
    body: `## Labour on small farms

Philippine small farms run on family labour. All 50 raisers in a Mlang, Cotabato survey (farms under 20 pigs) used family members, valued at ₱3,000 per 3 to 4 month cycle for about 10 pigs, as a non-cash cost (published April 2026) (HO-89). Almost all fed three times a day and called a veterinarian only when needed. In Bulacan in 2014, 90 percent of enterprises in one town and 81 percent in the other had 0 to 5 employees.

The only hours benchmark found is from a large US farm: 1,200 sows farrow-to-finish with 7.5 full-time workers, or 160 sows per worker, which works out to about 13 hours per sow per year (HO-90). The document derives that figure and warns that a 5-sow farm spends far more per sow. No source gives hours per day for a 1 to 10 sow Philippine farm; that is an open question. Enter your family time as a cost in the app so the margins are honest: see [Farm accounting conventions](/guide/farm-accounting-conventions).

## Minimum routine set by AO 41

- Inspect every pig at least once a day, best at feeding time (HO-91). Look more often in hot weather, during disease, when a sow is due to farrow and after mixing pigs.
- Feed 2 to 3 times a day; weaners at least twice if not fed ad libitum (HO-93). Every pig gets feed and water at least once a day.
- Check automated feeders and waterers 4 to 5 times a day (HO-91).
- Inspect buildings and equipment (feeders, drinkers, ventilation, lights, heaters, pumps, hoses, extinguishers, standby power) at least once a month (HO-92).

The [Daily checklist](/guide/daily-checklist), [Weekly and monthly checklists](/guide/weekly-and-monthly-checklists) and [Farrowing week checklist](/guide/farrowing-week-checklist) turn these into tasks.

## What gets written, when

The GAHP standard requires records to be retrievable and kept at least 3 years (HO-107). AO 41 requires records of deaths, sick animals, treatments and responses. The DA Cagayan Valley guide separates technical records (production and schedules) from economic records (prices of meat, weanlings and feed). Mapped to the events that trigger an entry:

| When | What is recorded |
|---|---|
| Animal enters or leaves the farm | ID, sex, breed, date of birth, ear notch, source or buyer, date in or out |
| Purchase of feed, medicine, supplies | Date, product, batch number, expiry, supplier, quantity |
| Feeding change or delivery | Ration type and quantity fed |
| Heat and service | Sow ID, boar or AI ID, date and time, expected farrowing date (service date plus 114 days) |
| Farrowing | Date, born alive, stillborn, mummified, birth weights, sow and boar ID |
| Piglet processing | Iron injection date and dose, teeth clipping, tail docking, castration, ear notching |
| Weaning | Date, number weaned, weaning weights |
| Any treatment, vaccination or deworming | Date, product, batch, dose, route, animals treated, who gave it, withdrawal period |
| Sickness or death | Animal, signs, diagnosis, action taken, response |
| Water quality test | Date and result |
| Visitors and vehicles | Date, name, origin, purpose |
| Cleaning and disinfection | Date, pen, product, rest days before restocking |
| Sale | Date, head, liveweight, price per kg, buyer |

The app's forms for each of these are described in [Standard records](/guide/standard-records) and [What smallholders record](/guide/what-smallholders-record).`,
    sources: ['HO-89', 'HO-90', 'HO-91', 'HO-92', 'HO-93', 'HO-96', 'HO-107'],
    prices: true,
  },
  {
    id: 'daily-checklist',
    section: 'housing',
    title: 'Daily checklist',
    summary: 'The tasks to do every day: walk the pens, feed, check water, scrape, cool, check creep heat and heats, treat, dispose, and write it down.',
    body: `## Every day

Do these in order at the first feeding, then repeat the feed, water and temperature checks at each later feeding.

1. Walk every pen and look at every pig standing, eating and moving. Note anything lame, off feed, coughing, scouring or lying apart (HO-91).
2. Feed at the set times, 2 to 3 times a day; weaners at least twice; lactating sows to appetite (HO-93). Record any change of ration. Feed phases are in [Feed phases](/guide/feed-phases).
3. Check that every nipple, cup and trough runs clean water. Check pressure and flow, and refill the reserve for the next 24 hours.
4. Scrape manure and wet feed from solid floors and flush to the drain or pit (HO-28). Keep the dunging area separate from the lying area.
5. Check the temperature at pig level. Run sprinklers or showers in the hot hours, for example 2 minutes every 30 minutes from noon to 19:00 (HO-65), when the house is above 30 °C for adult pigs (HO-56).
6. In farrowing pens, check the creep heat: bulb working, lamp at 762 mm (HO-60), piglets spread out rather than piled.
7. Check sows due for service for heat (swollen vulva, standing reflex) and record it. Serve twice, 12 to 25 hours apart (HO-105). See [Heat and service](/guide/heat-and-service).
8. Give any scheduled treatment and write the product, batch, dose, animal and withdrawal period.
9. Remove and dispose of any dead pig the same day: bury 50 cm deep with lime and 50 cm of cover (HO-82). Record it.
10. Refill the footbath at the entrance. Log every visitor and vehicle.
11. Note feed used, sales and purchases in the day's record.

## Why each day

AO 41 requires every pig to be inspected at least once a day, at feeding time, and more often in hot weather, during disease, near farrowing and after mixing (HO-91). Feeding time is when a sick pig shows itself: it hangs back. Water is the first thing to fail in the heat and the last thing a raiser checks, so it has its own line. Dead pigs left in a pen spread disease and draw complaints.

## What the app wants from today

The daily entries that feed the app's figures are feed used, deaths, treatments with their withdrawal dates, heats and services, and sales. The forms are listed in [Standard records](/guide/standard-records); the service date drives the [Breeding calendar](/guide/breeding-calendar). The sow near her date has her own list in [Farrowing week checklist](/guide/farrowing-week-checklist).`,
    sources: ['HO-28', 'HO-56', 'HO-60', 'HO-65', 'HO-82', 'HO-91', 'HO-93', 'HO-105'],
      },
  {
    id: 'weekly-and-monthly-checklists',
    section: 'housing',
    title: 'Weekly and monthly checklists',
    summary: 'The weekly pen, weighing, feed stock, water line, drainage, breeding calendar and inventory tasks, and the monthly equipment, health, repair, waste, records and permit checks.',
    body: `## Weekly

1. Wash and disinfect empty pens. Check partitions, gates, slats, feeders and drinkers for damage or sharp edges.
2. Weigh or tape a sample of growers and finishers and compare with the expected weight. Adjust the ration and move pigs so each pen keeps its space per head by weight band (HO-03 to HO-06). The app does the comparison in [Growth tracking](/guide/growth-tracking).
3. Count the feed stock against the two-week reserve (HO-70) and order before it runs down. The app's feed days remaining figure is described in [Feeding management](/guide/feeding-management).
4. Clean water lines and tanks against sediment and biofilm. Check the reserve volume.
5. Check drainage, the septic tank or lagoon level, and any leaks. Nothing leaves the compound.
6. Review the breeding calendar: sows due to farrow within 14 days get dewormed and treated for lice or mange (HO-95); sows due within 7 days move to a clean farrowing pen (HO-94); weaned sows are due back in heat 3 to 7 days after weaning (HO-105). The app lists them in [Breeding calendar](/guide/breeding-calendar).
7. Update the inventory by class (sows, boar, piglets, weaners, growers, finishers) and check the total against your municipality's head-count classes and the DENR 100-head line (HO-108, HO-109, HO-113). See [Local rules for small piggeries](/guide/local-rules-for-small-piggeries).

## Monthly

1. Inspect buildings and equipment: roof, gutters, wiring, lights, fans, pump, hoses, heaters, extinguisher and standby power. AO 41 requires this at least once a month (HO-92).
2. Run the deworming round on the veterinarian's programme: pigs 1 to 2 weeks after weaning (HO-104), sows 14 days before farrowing (HO-95). Record each animal.
3. Run the vaccination round on the written health programme. See [Vaccination calendar](/guide/vaccination-calendar).
4. Repair floors, slats, partitions and gates. Regrade drains.
5. Empty or turn the compost or vermicompost beds. Desludge the septic tank when due and record it.
6. Review the records: services, farrowings, born alive, weaned, deaths, treatments, feed used and sales. Compute feed per pig sold and mortality, and decide which sows to cull. The app's figures are in [KPI breeding](/guide/kpi-breeding) and [Mortality benchmarks](/guide/mortality-benchmarks).
7. Check the permits and their renewal dates: barangay clearance, sanitary permit, Mayor's permit, CNC.

## Why these intervals

The weekly items are the ones that drift unseen in a week: a pen that has outgrown its space, a feed bin that looks full but is not, a water line growing slime, a sow whose date was missed. The monthly items are the ones AO 41 and the GAHP standard require on a fixed cycle, plus the records review that tells you whether the month made money.`,
    sources: ['HO-03', 'HO-04', 'HO-05', 'HO-06', 'HO-70', 'HO-92', 'HO-94', 'HO-95', 'HO-104', 'HO-105', 'HO-108', 'HO-109', 'HO-113'],
  },
  {
    id: 'farrowing-week-checklist',
    section: 'housing',
    title: 'Farrowing week checklist',
    summary: 'Day by day from three weeks before farrowing to two weeks after: deworming, the move, the kit, attending the birth, iron, castration, creep feed and the sow card.',
    body: `## Counting the days

Gestation averages 114 days, range 109 to 119 (HO-96). Day 0 below is the expected farrowing date the app computes from the service date: see [Breeding calendar](/guide/breeding-calendar) and [Gestation and pregnancy check](/guide/gestation-and-pregnancy-check).

| Day | What to do | Source |
|---|---|---|
| -21 to -14 | Deworm the sow and treat for external parasites (lice, mange). | HO-95 |
| -7 to -5 | Wash the sow's teats and belly. Move her to a farrowing pen that was cleaned, disinfected and rested 5 to 7 days. Switch to a laxative ration with green feed and plenty of water. AO 41 says at least 3 to 5 days before; US extension says no later than day 110. | HO-94, HO-97 |
| -3 to -1 | Lay out dry cloths, iodine, scissors or cord ties, string, nippers, iron dextran, needles, a 100 W heat bulb, the piglet box and the record card. Watch for restlessness, a swollen vulva and milk in the teats: farrowing is within 24 hours. | HO-59 |
| 0 | Attend the farrowing. If strong labour goes 30 minutes without a piglet, assist or call the veterinarian. Wipe the mouth and nose, tie and cut the cord 2 inches from the body, dip it in iodine, put the piglet under the lamp and then on a teat. Make sure every piglet drinks colostrum in the first hours. Do not feed the sow for 12 to 24 hours, then give 1 to 1.5 kg of laxative feed and build up to full feed. Record born alive, stillborn, mummified and weights. | HO-98 |
| 0 to 1 | Clip needle teeth and dock tails if you practise it. Ear notch. Cross-foster within 24 to 48 hours, after colostrum. | HO-100 |
| 1 to 3 | Iron dextran injection (200 mg); repeat at day 14 on the DA schedule. Check the creep is at 32 °C and the piglets are spread out. | HO-99, HO-57 |
| 4 to 7 | Castrate the males (any time from 4 to 14 days). Check the sow's appetite, udder and discharge every day. Raise her feed to appetite. | HO-101 |
| 7 to 14 | Start creep feed, no later than the end of week 2. Drop the bulb to 50 W at day 14. Keep piglet drinkers running at piglet height. | HO-102, HO-59 |
| Any day | Write on the sow card: farrowing date, litter size, treatments, piglet deaths and causes, and the planned weaning date at day 30. | HO-103 |

## After the week

Wean at 30 days (AO 41) or 4 to 6 weeks, never under 3 weeks (HO-103). Deworming, castration and ear notching are done before weaning. Deworm the weaners 1 to 2 weeks after weaning and vaccinate 1 to 2 weeks after weaning or 1 week after deworming (HO-104). The sow returns to heat 3 to 7 days after weaning (HO-105).

The care behind each line is in [Farrowing](/guide/farrowing), [Piglet processing](/guide/piglet-processing) and [Lactation and weaning](/guide/lactation-and-weaning). The farrowing form on the litter page and the health event form are described in [Standard records](/guide/standard-records); the born-alive, stillborn and weaned counts feed [KPI breeding](/guide/kpi-breeding).`,
    sources: ['HO-57', 'HO-59', 'HO-94', 'HO-95', 'HO-96', 'HO-97', 'HO-98', 'HO-99', 'HO-100', 'HO-101', 'HO-102', 'HO-103', 'HO-104', 'HO-105'],
      },
]

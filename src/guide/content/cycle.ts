import type { GuideArticle } from '../types'

// Section "cycle": the sow reproductive cycle and herd dynamics, compiled from
// research/production-cycle.md (rows PC-01 to PC-93 in research/parameters.md).

export const CYCLE: GuideArticle[] = [
  {
    id: 'gilt-selection-and-first-service',
    section: 'cycle',
    title: 'Gilt selection and first service',
    summary: 'When a young female pig reaches puberty, how to bring her into heat, and the age, weight and heat number to breed her at.',
    body: `## What a gilt is

A gilt is a young female pig that has not yet farrowed. Her first litter is the start of her working life, so the timing of her first service sets up every litter after it.

## Puberty

A gilt that gets daily contact with a boar usually shows her first heat at about 170 to 210 days of age; one extension source gives 170 to 220 days (PC-01). Start the boar contact at 150 to 170 days of age, 10 to 15 minutes a day, and keep it up for several weeks (PC-02). Philippine native pigs mature earlier, at a mean 5.79 months, and were traditionally bred at about one year old (PC-08).

## When to breed her

The genetics company PIC recommends serving a gilt on her **second** heat, not the first, at 200 to 225 days of age (PC-03) and 135 to 160 kg (PC-04). A gilt served after 240 days of age performs worse over her life (PC-03). To reach that weight on time she should grow at 600 to 800 g a day while being reared (PC-05). The first farrowing then comes at about 315 to 340 days of age, derived from first service plus 115 days of gestation (PC-93).

The only Philippine guidance the research found is a magazine article, a secondary source, giving puberty at 6 to 8 months and breeding at a minimum of 8 months and 120 to 130 kg (PC-07). No PH extension figures for first-service age and weight were found, so this remains an open question in the research.

## Selection points

- Cull a gilt that shows no heat by 230 days of age or 140 kg even after boar contact (PC-06).
- Cull a gilt that fails to conceive over two consecutive services (PC-79).
- Expect to remove up to 30 percent of gilts before breeding for poor growth, bad structure, teat defects or genital defects (PC-79).

Record each gilt's service date in the app so the [breeding calendar](/guide/breeding-calendar) can compute her heat check and farrowing dates. The next steps are [heat and service](/guide/heat-and-service) and the choice between [a boar or AI](/guide/boar-or-ai). Feeding a gilt to the target weight is covered under [growth stages](/guide/growth-stages).`,
    sources: ['PC-01', 'PC-02', 'PC-03', 'PC-04', 'PC-05', 'PC-06', 'PC-07', 'PC-08', 'PC-79', 'PC-93'],
    terms: [{ term: 'Gilt', meaning: 'A young female pig that has not yet farrowed her first litter.' }],
  },
  {
    id: 'heat-and-service',
    section: 'cycle',
    title: 'Heat and service',
    summary: 'The signs of heat, how long the cycle and the standing heat last, and when to serve the sow and how many times.',
    body: `## The cycle

A sow or gilt that is not pregnant comes into heat about every 21 days, with a range of 18 to 24 days (PC-09). Philippine native pigs in the Cordillera averaged 19.66 days (PC-10). If a served sow comes back into heat about three weeks later, the service failed; see [gestation and pregnancy check](/guide/gestation-and-pregnancy-check).

## Signs of heat

The signs listed in the research, in the order they appear:

- The vulva swells and reddens 2 to 3 days before the heat proper.
- Clear sticky mucus from the vulva.
- Riding other pigs and seeking the boar.
- The **standing reflex**: she stands rigid when a person presses down on her back (the back-pressure response). This is the standing heat, and it is the time to serve.

## How long the standing heat lasts

Standing heat lasts about 40 hours in gilts, with a range of 36 to 48 hours (PC-11), and about 55 hours in sows, with a range of 48 to 72 hours (PC-12). Individual animals can range from 12 to 84 hours (PC-11). The eggs are released about two thirds of the way through the heat, roughly 30 to 40 hours after it starts (PC-13). Serving too early or too late misses the eggs.

## When to serve and how many times

Serve 2 to 3 times during the standing heat (PC-15). The timing depends on how often you check for heat:

- **Two checks a day:** first service 8 to 12 hours after the standing heat starts, second service 12 to 16 hours later (PC-14).
- **One check a day:** serve within 0 to 4 hours of finding her standing, and again 24 hours later (PC-14).

Services should be no more than 24 hours apart, at least two per heat; three services (morning, evening, morning) is the best per the UK levy board AHDB (PC-15).

A sow that returns to heat within 4 days of weaning tends to have a 3-day heat, so serve her later after onset; one that returns at 6 days or more tends to have a 2-day heat, so serve her earlier (PC-63).

## Record it

Enter the service date in the app on the day of the first service. The [breeding calendar](/guide/breeding-calendar) then dates the return-to-heat check, the pregnancy check and the farrowing. Whether the service is by [boar or AI](/guide/boar-or-ai), the timing above is the same. How well your services work shows up in the [breeding KPIs](/guide/kpi-breeding).`,
    sources: ['PC-09', 'PC-10', 'PC-11', 'PC-12', 'PC-13', 'PC-14', 'PC-15', 'PC-63'],
    terms: [
      { term: 'Heat (estrus)', meaning: 'The days when a sow or gilt will accept the boar and can conceive; it returns about every 21 days if she is not pregnant.' },
      { term: 'Standing heat', meaning: 'The part of the heat when the sow stands rigid under back pressure; the time to serve her.' },
    ],
  },
  {
    id: 'boar-or-ai',
    section: 'cycle',
    title: 'Boar or AI',
    summary: 'Natural boar service against artificial insemination in the Philippines: who uses what, what it costs, where semen comes from and how many sows a boar can serve.',
    body: `## What raisers do now

In a 2024 survey of 68 raisers in Misamis Occidental, 77.94 percent used natural mating only, 8.82 percent AI only and 13.23 percent both (PC-16). 91.17 percent did not manage a boar-to-sow ratio and 4.41 percent used 1:10 (PC-84). Traveling boars (boar travelers) and AI technicians compete for the same customers (PC-16). In the 1997/98 smallholder study in Leyte and Benguet, farm boars were used only 0.9 times a month (PC-85): with a few sows, a boar of your own sits idle.

## What it costs

- AI at a government-supported village AI center: ₱200 or lower per service, sometimes free (DA-ATI feature, Ilocos Norte, August 2024) (PC-17).
- AI from a private provider: ₱1,000 to ₱1,500 per service, as quoted in the same 2024 feature (PC-18).
- Boar hire (pakasta): no primary source for the fee was found, so the research leaves it as an open question.

Record the fee you actually pay as a boar or AI service expense in the ledger, and enter it as the breeding cost per litter on the Plan page so your own number replaces the default.

## Does AI conceive as well?

No Philippine study was found. The closest analogue is a smallholder study in Thailand: farrowing rate 76.0 percent for AI with two inseminations per heat, against 70.0 percent for natural mating with rental boars (PC-19). Among the AI sows, having a boar present at insemination raised the farrowing rate from 69.2 to 83.7 percent and litter size from 9.7 to 11.2 born (PC-20). If you use AI, let the sow see, hear and smell a boar while the technician works.

## Where AI semen comes from

The Bureau of Animal Industry accredits swine AI centers and providers under DA-BAI Administrative Order 02 of 2009, because uncertified semen can carry disease. The DA-ATI "AI sa Barangay" program set up 16 village AI centers in Western Visayas in 2020, each with 2 boars and a laboratory package (PC-17). Private and farm-based AI centers also sell processed semen. Buying only from accredited providers is part of your [biosecurity](/guide/biosecurity-checklist).

## If you keep a boar

- A boar should be at least 8 months old before use; the PH welfare code defines a boar as a male breeding pig of at least 8 months (PC-23).
- Natural hand mating usually needs one boar per 15 to 25 sows, average about 1:18 (PC-80). Pen mating runs at about 1:4 for a mature boar and 1:2 for a young one (PC-81).
- A young boar of 8 to 12 months: at most 1 service a day, 5 a week (PC-82). A mature boar: at most 2 a day, 7 a week, and not on consecutive days (PC-83).

Either route, the service is timed as in [heat and service](/guide/heat-and-service). Its cost goes into the [cost per weaned piglet](/guide/unit-costs-and-break-even).`,
    sources: ['PC-16', 'PC-17', 'PC-18', 'PC-19', 'PC-20', 'PC-23', 'PC-80', 'PC-81', 'PC-82', 'PC-83', 'PC-84', 'PC-85'],
    prices: true,
    terms: [
      { term: 'Boar', meaning: 'A male breeding pig; the PH welfare code and housing standard define it as at least 8 months old.' },
      { term: 'Boar hire', tagalog: 'pakasta', meaning: 'Paying a boar owner to serve your sow; the research found no primary source for the fee.' },
      { term: 'Traveling boar', meaning: 'A boar taken from farm to farm for hire (boar traveler); competes with AI technicians for the same customers.' },
      { term: 'AI (artificial insemination)', meaning: 'Serving the sow with processed boar semen placed by a technician instead of a live boar.' },
    ],
  },
  {
    id: 'gestation-and-pregnancy-check',
    section: 'cycle',
    title: 'Gestation and pregnancy check',
    summary: 'How long a sow carries her litter, the heat check at three weeks, the pregnancy check at day 28, and what happens inside the sow in between.',
    body: `## How long gestation lasts

A sow farrows about 115 days after the first service, three months, three weeks and three days; most farrow between 110 and 117 days, and 112 to 120 is seen in practice (PC-24). Smaller litters tend to come a little earlier and prolific genetics a little later (PC-24). Philippine native pigs averaged 112.94 days (PC-25). A PH magazine article gives 114 days, range 109 to 119 (PC-24).

The app's [breeding calendar](/guide/breeding-calendar) counts these days from the service date you enter, so the due date is only as good as that record.

## The return-to-heat check at 18 to 24 days

The first sign of pregnancy is that the sow does **not** come back into heat. Check her for heat 18 to 24 days after service, around day 21 (PC-26). Watch for the signs in [heat and service](/guide/heat-and-service) and, if you can, walk a boar past her. This check is only 75 to 85 percent accurate (PC-26): a sow that shows no heat may still be empty.

If she does come into heat, the service failed. Serve her again on that heat; in the app, close the litter as not pregnant and record the new service.

## The pregnancy check at day 28

Real-time ultrasound is at least 95 percent accurate from day 27, and one extension source suggests checking around day 30 (PC-27). The app schedules this check at day 28. Ask your technician or [veterinary service](/guide/veterinary-services) whether a scan is available.

## What happens inside the sow

- The embryos attach to the womb from day 12 to 15, and attachment is complete by about day 40 (PC-27).
- At least four live embryos are needed for the pregnancy to continue (PC-27).
- Bone calcification starts at day 35 to 45. A piglet that dies after that cannot be absorbed and becomes a mummy, delivered with the litter (PC-27).

## Feeding notes

The research document does not give a gestation feeding schedule. It only notes that the gilt should be reared at 600 to 800 g of gain a day before her first service (PC-05) and that feed intake drops the day before or the day of farrowing (PC-29). Feed amounts by stage are in [feed phases](/guide/feed-phases).

## Next

Move the sow to the farrowing pen before the due date: see [farrowing](/guide/farrowing) and the [farrowing week checklist](/guide/farrowing-week-checklist).`,
    sources: ['PC-05', 'PC-24', 'PC-25', 'PC-26', 'PC-27', 'PC-29'],
    terms: [{ term: 'Mummy (mummified piglet)', meaning: 'A piglet that died in the womb after its bones formed (day 35 to 45) and was delivered dried and shrunken with the litter.' }],
  },
  {
    id: 'farrowing',
    section: 'cycle',
    title: 'Farrowing',
    summary: 'The signs that farrowing is near, how the delivery runs, when to help, what born alive, stillborn and mummified mean, and why the first day decides most piglet deaths.',
    body: `## Signs that farrowing is near

- Nest building and restlessness start 2 to 3 days before (PC-29).
- Milk droplets can be squeezed from the teats 2 to 3 days before; when milk comes in **streams**, farrowing follows within 12 hours (PC-28).
- Feed intake drops the day before or on the day (PC-29).
- In the last hours: quick breathing, trembling of the flanks and discharge from the vulva.

## Preparation

Have the sow in a clean [farrowing pen](/guide/farrowing-pen) before these signs appear. The [farrowing week checklist](/guide/farrowing-week-checklist) lists what to have ready.

## During farrowing

Piglets come every 10 to 15 minutes on average, with a range of 5 to 45 minutes (PC-30). Active delivery takes about 2 to 3 hours; the whole event can run 1 to 8 hours or more, and sows that finish within 2 to 2.5 hours have fewer stillborns (PC-31). The placenta is expelled within 1 to 2 hours of the last piglet, at most 4 (PC-33).

**When to help:** examine the sow if more than 30 to 45 minutes pass with no piglet; one breeding company assists once an interval passes 1 hour (PC-32). If you are not trained to check a sow internally, call your [veterinary service](/guide/veterinary-services).

## Born alive, stillborn and mummified

Count and record three numbers for every litter: born alive, stillborn and mummified. Stillbirth is typically 5 to 10 percent of the litter (PC-36). On commercial farms overseas the average is 1.14 stillborn (PC-36) and 0.46 mummies (PC-37) per litter of 15.5 total born (PC-34), leaving 13.9 born alive (PC-35). Philippine litters are smaller: 9.26 born per litter on commercial farms in a 2009 industry article (PC-38) and 8.5 live born on smallholder farms in Benguet and Leyte in 1997 (PC-39). Most PH raisers surveyed in 2024 reported 6 to 10 piglets per litter (PC-40). Native pigs average about 7 born (PC-41).

Commercial piglets weigh about 1.4 kg at birth, less in big litters (PC-42); 1.0 kg or under is low birth weight (PC-43). Native piglets weigh about 0.8 kg (PC-44).

## Just after farrowing

- **Colostrum within 24 hours.** The gut closes to the sow's first milk at 24 hours, and each piglet needs at least about 250 g of it (PC-61). Put weak piglets on a teat yourself.
- **Watch for crushing.** Crushing causes 48.1 percent of piglet deaths before weaning, starvation 15.3 percent and scours 13.3 percent (PC-59). Most deaths happen in the first 72 hours, the first 24 above all (PC-61); on PH smallholder farms 49 percent of piglet deaths came within 24 hours of birth (PC-60).
- Do the [piglet processing](/guide/piglet-processing) jobs on the day ranges given there.

The next stage is [lactation and weaning](/guide/lactation-and-weaning).`,
    sources: ['PC-28', 'PC-29', 'PC-30', 'PC-31', 'PC-32', 'PC-33', 'PC-34', 'PC-35', 'PC-36', 'PC-37', 'PC-38', 'PC-39', 'PC-40', 'PC-41', 'PC-42', 'PC-43', 'PC-44', 'PC-59', 'PC-60', 'PC-61'],
    terms: [
      { term: 'Colostrum', meaning: "The sow's first milk; the piglet's gut closes to it at 24 hours, so each piglet must drink it within its first day." },
      { term: 'Stillborn', meaning: 'A piglet born dead, fully formed; typically 5 to 10 percent of a litter.' },
    ],
  },
  {
    id: 'lactation-and-weaning',
    section: 'cycle',
    title: 'Lactation and weaning',
    summary: 'Weaning age in Philippine practice and under the welfare code, the minimum weaning weight, how many piglets die before weaning and why, and when to start creep feed.',
    body: `## Weaning age

- **Commercial benchmark overseas:** about 21 days (PC-45).
- **Philippine commercial farms (2009):** 27.7 days on average, range 21.27 to 32.77 (PC-46), at an average 7.47 kg (PC-50), weaning 8.47 piglets per litter (PC-54).
- **Philippine welfare code (DA Administrative Order 41 of 2000):** weaning is done at 30 days; below 30 days only under very efficient management; piglets under 3 weeks face significant welfare problems (PC-47). See [animal welfare law](/guide/animal-welfare-law).
- **Native pigs:** much later, 34 to 60 days depending on the line, and traditionally 3 to 4 months in the Cordillera (PC-51).

## Minimum weaning weight

The PH code says piglets under 6 kg shall not be weaned except in certified exceptional circumstances; PIC advises a litter average of 6 to 6.5 kg and no pig under 5 kg (PC-48). In a controlled trial, piglets weaned at 21 days weighed 6.87 kg (PC-49) and at 28 days 8.49 kg (PC-50).

## Early or later weaning

The trade-off in the research: the 28-day group grew faster in the two weeks after weaning and had less diarrhoea, 14.77 percent against 17.59 percent for the 21-day group (PC-52). Weaning under 21 days slows the womb's recovery, lengthens the wean-to-service interval and reduces the next litter; a lactation of about 28 days improves piglet viability but lowers litters per sow per year (PC-48). For a farm with a few sows, the 28 to 30 days the PH code and PH farms use is the practical choice.

## Pre-weaning mortality and its causes

| Management | Piglets lost before weaning | Row |
|---|---|---|
| Good (top 10 percent of US farms) | 8.3 percent | PC-55 |
| Average (US 2021) | 14.4 percent | PC-56 |
| Poor (bottom 10 percent) | 20.2 percent | PC-57 |
| PH smallholder (Benguet and Leyte, 1997) | 19.0 and 12.8 percent | PC-58 |

The causes are crushing (48.1 percent), starvation (15.3 percent) and scours (13.3 percent) (PC-59). In a Leyte field trial, control herds lost a median 37 percent of piglets over two litters while herds with a heated piglet pen, vitamin injections, creep feed and early weaning lost 0 percent, and their interfarrowing interval fell from a median 220 to 176 days (PC-58). The benchmarks the app uses are in [mortality benchmarks](/guide/mortality-benchmarks).

## Creep feed from day 14

The PH code says giving piglets access to meal within the first week reduces weaning diarrhoea, and creep feeding should begin by the end of the second week of life (PC-62). The smallholder creep feeds seen in the 1990s study were of low nutritive value (PC-62), so buy a proper pre-starter: see [feed phases](/guide/feed-phases).

## Recording

Record the weaning date, the number weaned and their total weight per litter. The app moves the piglets to a weaner batch from that date and computes the [cost per weaned piglet](/guide/unit-costs-and-break-even). If you sell at weaning, see [selling weaners](/guide/strategy-sell-weaners).`,
    sources: ['PC-45', 'PC-46', 'PC-47', 'PC-48', 'PC-49', 'PC-50', 'PC-51', 'PC-52', 'PC-54', 'PC-55', 'PC-56', 'PC-57', 'PC-58', 'PC-59', 'PC-62'],
    terms: [
      { term: 'Weaner', tagalog: 'biik', meaning: 'A piglet taken off the sow; in the PH trade the biik is sold to a grower. The usual sale age and weight could not be sourced by the research.' },
      { term: 'Creep feed', meaning: 'Dry feed offered to piglets in the farrowing pen while they still suckle; the PH code says start by the end of week 2.' },
    ],
  },
  {
    id: 'sow-year-and-litters',
    section: 'cycle',
    title: 'The sow year and litters per year',
    summary: 'How soon a sow returns to heat after weaning, how many litters and weaned pigs a sow can give in a year, and how Philippine farms compare with commercial benchmarks.',
    body: `## Wean to service

A mature sow normally returns to heat within 3 to 5 days of weaning; other sources say 3 to 7 or 4 to 6 days, and producers allow up to 7 days to detect it (PC-63). Check her for heat every day from weaning. The app's [breeding calendar](/guide/breeding-calendar) dates this window from the weaning date.

## Litters per sow per year

The sow year is gestation plus lactation plus the wean-to-service days. With 115 days of gestation, 21 days of lactation and 5 days to re-service, the biological ceiling is 365 divided by 141, about 2.59 litters a year, derived in the research (PC-65). The US commercial average is about 2.08 litters per mated female per year, derived from 25.12 pigs weaned divided by 12.07 weaned per litter (PC-64).

Every day beyond that cycle is a day the sow eats without producing: a sow that misses her heat, returns after a failed service, or suckles a long litter gives fewer litters a year. The research document gives no benchmark for non-productive days.

**Philippine smallholders** are far from the ceiling. In the 1997 study the interval between farrowings was 6.6 months in Leyte and 9.7 months in Benguet, about 1.8 and 1.2 litters a year, derived (PC-66). In the Leyte field trial the median interval was 220 days in control herds and 176 days with improved piglet care (PC-66), about 1.66 and 2.07 litters a year.

## Pigs weaned per sow per year (PSY)

This is the figure that decides a breeding farm's income. It is litters per year times pigs weaned per litter.

| Farm type | Pigs weaned per sow per year | Row |
|---|---|---|
| Commercial, good (top 10 percent, 2022 to 2024) | 31.7 to 34.3 | PC-67 |
| Commercial, average (2022 to 2024) | 25.1 to 28.6 | PC-68 |
| Commercial, poor (bottom 10 percent, 2022) | 19.2 | PC-69 |
| PH commercial farms (2009) | 19.78, range 15.22 to 22.95 | PC-70 |
| PH smallholder, Leyte (1997, derived) | about 13.3 | PC-71 |
| PH smallholder, Benguet (1997, derived) | about 8.5 | PC-71 |

The Leyte figure is derived from 8.4 live born, 12.8 percent lost before weaning and 1.82 litters a year (PC-71). The gap between 13 and 20 pigs a year per sow is mostly the litters lost to long intervals and the piglets lost in the first days: see [farrowing](/guide/farrowing) and [lactation and weaning](/guide/lactation-and-weaning).

## Repeats and farrowing rate

On commercial farms 78.33 percent of services led to a farrowing in 2022, with the top 10 percent at 90.15 and the bottom at 62.66 (PC-21); 5.13 percent of services were repeats (PC-22). The app's [breeding KPIs](/guide/kpi-breeding) compute the same figures from your service and farrowing records, and the [projection assumptions](/guide/projection-assumptions) use litters per year and pigs weaned per litter as inputs.`,
    sources: ['PC-21', 'PC-22', 'PC-63', 'PC-64', 'PC-65', 'PC-66', 'PC-67', 'PC-68', 'PC-69', 'PC-70', 'PC-71'],
    terms: [
      { term: 'PSY', meaning: 'Pigs weaned per sow per year: litters per year times pigs weaned per litter.' },
      { term: 'Wean-to-service interval', meaning: 'The days from weaning until the sow is served again; normally 3 to 7 days.' },
    ],
  },
  {
    id: 'sow-culling-and-replacement',
    section: 'cycle',
    title: 'Sow culling and replacement',
    summary: 'How long a sow stays productive, why and when sows are culled, how many replacement gilts a herd needs each year, and the boar-to-sow ratio.',
    body: `## How long a sow works

Across herd studies in the US, EU and Japan, sows were removed at a mean parity of 3.3 to 5.6, about 4 litters (PC-72), after 467 to 969 days in the herd, about 700 days (PC-73). The authors of a Thai study cite an optimum herd life of 5 to 10 parities (PC-72). Philippine native sows were traditionally allowed 4 to 5 farrowings in a lifetime (PC-74).

## Why sows are culled

In a Thai herd of 4,887 culled Landrace x Large White sows in a tropical climate (PC-78):

| Reason | Share of culls |
|---|---|
| Old age | 34.93 percent |
| Reproductive disorders | 29.32 percent |
| Low performance | 12.62 percent |
| Lameness | 12.56 percent |
| Disease | 4.80 percent |
| Body condition | 4.68 percent |
| Udder problems | 0.79 percent |

Parity 7 had the highest share of culls (19.35 percent), followed by parity 1 (15.83 percent) (PC-78). The parity 1 losses are gilts that did not work out.

## Culling rules for gilts

Cull a gilt that is not cycling by 230 days of age or 140 kg (PC-06) and one that fails to conceive over two consecutive services; up to 30 percent of gilts may be removed for growth, structure, teat or genital defects (PC-79). See [gilt selection](/guide/gilt-selection-and-first-service).

## Replacement rate

On US commercial farms, 42 percent of sows were culled each year (PC-75) and a further 14 percent died (PC-76). Together that is an annual replacement need of about 57 percent, derived (PC-77). For a farm of 5 sows that means keeping or buying about 3 gilts a year. A culled sow is sold as a cull sow; enter it as a sale so the [stock rules](/guide/stock-rules) remove her from the herd. Rearing your own gilts is the [breeder-multiplier strategy](/guide/strategy-breeder-multiplier).

## Boar-to-sow ratio

Natural hand mating usually needs one boar for 15 to 25 sows (PC-80), so a farm of 1 to 10 sows cannot keep a boar busy: PH smallholder boars were used 0.9 times a month (PC-85), and most PH raisers keep no ratio at all, relying on traveling boars or AI (PC-84). Pen mating runs at about 1:4 for a mature boar (PC-81). The service limits per boar and the AI option are in [boar or AI](/guide/boar-or-ai).`,
    sources: ['PC-06', 'PC-72', 'PC-73', 'PC-74', 'PC-75', 'PC-76', 'PC-77', 'PC-78', 'PC-79', 'PC-80', 'PC-81', 'PC-84', 'PC-85'],
    terms: [
      { term: 'Parity', meaning: "One farrowing in a sow's life; a parity 3 sow is on her third litter." },
      { term: 'Cull', meaning: 'To remove a sow, gilt or boar from the breeding herd, usually by selling it.' },
    ],
  },
  {
    id: 'piglet-processing',
    section: 'cycle',
    title: 'Piglet processing',
    summary: 'The iron shot, teeth clipping, tail docking, castration and ear notching in the first days of life, with the day ranges the Philippine welfare code sets.',
    body: `## The jobs and their days

Processing is the set of small jobs done on every piglet in its first week. The Philippine welfare code (DA Administrative Order 41 of 2000) sets the latest day for each; the extension sources give the usual practice.

| Job | Usual day | PH code limit | Row |
|---|---|---|---|
| Iron injection | day 1 to 2 (24 to 48 hours); some sources allow up to day 3 or 4 | not stated | PC-86 |
| Needle teeth clipping | day 1 (24 to 48 hours) | within 2 days; remove no more than one third of the tooth | PC-88 |
| Tail docking | day 2 (up to 3 days) | first 3 days; one third to one half of the tail; after 7 days only a vet, in an emergency | PC-89 |
| Castration | day 3 (usually 3 to 5) | not later than 14 days; older piglets only by a vet under anaesthesia | PC-90 |
| Ear notching | before 3 days is best | not on piglets over 7 days | PC-91 |
| Cross-fostering | first 2 days after birth | not stated | PC-92 |

## Iron

Piglets are born short of iron. Inject 200 mg of iron dextran, 1 or 2 mL, into the muscle behind the ear at 24 to 48 hours; the US National Pork Board sheet gives 100 to 200 mg at 1 to 4 days (PC-87). One extension source adds an optional second dose at day 17 to 18 (PC-86).

## Teeth and tail

Clip the needle teeth at 24 to 48 hours (PC-88). Under the PH code do it within 2 days of birth and take off no more than one third of the tooth (PC-88). Dock the tail by day 3, leaving about 1.3 cm; the PH code allows routine docking only in the first 3 days, removing one third to one half of the tail (PC-89).

## Castration

Castrate male piglets not meant for breeding as early as management allows, usually at 3 to 5 days and on average day 3; the PH code sets 14 days as the latest, and an older piglet may be castrated only by a veterinarian under anaesthesia (PC-90). The US source gives within 7 days (PC-90).

## Ear notching and fostering

Notch ears for identification before 3 days if you do it at all; the PH code forbids notching piglets over 7 days old (PC-91). Move piglets between sows to even up litters only in the first 2 days after birth (PC-92).

The rules above are welfare law, not just advice: see [animal welfare law](/guide/animal-welfare-law). Colostrum in the first 24 hours matters more than any of these jobs; see [farrowing](/guide/farrowing). Follow the [farrowing week checklist](/guide/farrowing-week-checklist) and record any medicine given as a health event so the [withdrawal periods](/guide/withdrawal-periods) are tracked.`,
    sources: ['PC-86', 'PC-87', 'PC-88', 'PC-89', 'PC-90', 'PC-91', 'PC-92'],
    terms: [{ term: 'Needle teeth', meaning: 'The eight sharp teeth a piglet is born with, clipped within 2 days so they do not cut the sow or littermates.' }],
  },
  {
    id: 'milestone-timeline',
    section: 'cycle',
    title: 'Milestone timeline',
    summary: 'The whole cycle on one table: from starting boar contact with a gilt, through service, checks and farrowing, to weaning and re-service, with the age and weight at each step.',
    body: `## From gilt to rebreed

The table carries the research document's milestone timeline. Ages are days of the pig's own age for the gilt and piglet rows, and days counted from service, farrowing or weaning for the sow rows. The Row column names the parameters behind each line.

| Milestone | Age (days) | Typical weight (kg) | Notes | Row |
|---|---|---|---|---|
| Gilt: start boar exposure | 150 to 170 | 113 to 125 | 10 to 15 minutes a day for several weeks | PC-02 |
| Gilt: first heat (puberty) | 170 to 210 | not stated | 170 to 220 per Penn State | PC-01 |
| Gilt: first service (2nd heat) | 200 to 225 | 135 to 160 | over 240 days or under 135 kg not recommended | PC-03, PC-04 |
| Pregnancy: return-to-heat check | service + 18 to 24 | n/a | 75 to 85 percent accurate | PC-26 |
| Pregnancy: ultrasound check | service + 27 to 30 | n/a | over 95 percent accurate from day 27 | PC-27 |
| Farrowing | service + 115 (110 to 117) | piglet 1.27 to 1.54 (commercial); 0.77 to 1.00 (native) | first farrowing at about 315 to 340 days of age, derived | PC-24, PC-42, PC-44, PC-93 |
| Piglet: colostrum, teeth clip, iron | 0 to 2 | n/a | colostrum within 24 hours; iron 200 mg at 24 to 48 hours | PC-61, PC-88, PC-86 |
| Piglet: tail dock, castrate, ear notch | 1 to 7 | n/a | PH code: castrate usually 3 to 5 days, max 14; dock and notch by 3 to 7 days | PC-89, PC-90, PC-91 |
| Piglet: creep feed offered | 7 to 14 | n/a | PH code: by end of week 2 | PC-62 |
| Weaning, early (21 days) | 21 | 6.87 | commercial benchmark practice; below 21 days not advised | PC-45, PC-49 |
| Weaning, conventional (28 days) | 28 | 8.49 | PH farms averaged 27.7 days at 7.47 kg | PC-46, PC-50 |
| Weaning, PH welfare code | 30 | at least 6 | under 6 kg not weaned | PC-47, PC-48 |
| Weaning, native pigs | 34 to 60 | 3.0 to 4.9 | ISUbela 34 days, Q-Black 45, Benguet 60 | PC-51 |
| Sow: return to heat and re-service | wean + 3 to 7 | n/a | most within 3 to 5 days | PC-63 |
| Sow: next farrowing | previous farrowing + 141 to 150 | n/a | derived: lactation 21 to 30 + 5 days to service + 115 gestation | PC-24, PC-63, PC-65 |
| Weaner (biik) sale | not sourced | not sourced | PH housing classes only: up to 10 kg, 11 to 20 kg; fattener from 15 kg | none |

## How the app uses it

You enter three dates: the service, the farrowing and the weaning. The [breeding calendar](/guide/breeding-calendar) computes the rest: the return-to-heat check, the day 28 pregnancy check, the due date, the processing days and the re-service window. The [growth tracking](/guide/growth-tracking) page takes over from weaning.

The weaner sale row is empty because the research could not trace the usual PH sale age and weight of a biik to a primary source; a claim of 20 to 25 kg at 7 to 8 weeks circulated in search snippets only. Log your own sales so the app has your figure. The details behind each row are in [gilt selection](/guide/gilt-selection-and-first-service), [gestation and pregnancy check](/guide/gestation-and-pregnancy-check), [farrowing](/guide/farrowing), [piglet processing](/guide/piglet-processing) and [lactation and weaning](/guide/lactation-and-weaning).`,
    sources: [
      'PC-01', 'PC-02', 'PC-03', 'PC-04', 'PC-24', 'PC-26', 'PC-27', 'PC-42', 'PC-44', 'PC-45', 'PC-46', 'PC-47', 'PC-48', 'PC-49', 'PC-50', 'PC-51',
      'PC-61', 'PC-62', 'PC-63', 'PC-65', 'PC-86', 'PC-88', 'PC-89', 'PC-90', 'PC-91', 'PC-93',
    ],
  },
]

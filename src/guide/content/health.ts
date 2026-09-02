import type { GuideArticle } from '../types'

// Health and biosecurity (research/health-and-biosecurity.md, rows HB-01 to HB-98).

export const HEALTH: GuideArticle[] = [
  {
    id: 'asf-in-the-philippines',
    section: 'health',
    title: 'ASF in the Philippines',
    summary: 'What African swine fever means for a raiser, the timeline since 2019, the zone colours and the vaccine status as of 2026.',
    body: `## What ASF is for a raiser

African swine fever (ASF) is a virus disease of pigs with no treatment. In the acute form nearly every infected pig dies, usually 6 to 13 days after infection (HB-10). Pigs show signs 4 to 19 days after they catch the virus (HB-09), so a farm can be infected for two weeks before the first pig looks sick. The virus stays alive 3 to 6 months in uncooked pork (HB-11), which is why kitchen scraps must never reach a pen: the first backyard outbreaks in Rizal were attributed largely to swill feeding.

One confirmed case means every pig within 500 m is depopulated (HB-04). The signs and steps are in [what to do on suspicion](/guide/asf-what-to-do-on-suspicion); the cash assistance and the road back are in [assistance and repopulation](/guide/asf-assistance-and-repopulation).

## Timeline since 2019, in brief

- July 2019: first outbreaks in Rizal, then Bulacan, Pampanga, Nueva Ecija and Cavite.
- September 2019: the 1-7-10 protocol: depopulation within 1 km (HB-01), surveillance and blood testing within 7 km (HB-02), mandatory reporting within 10 km (HB-03). December 2019: the zoning plan (DA AC 12 s2019) defined the colours below.
- May 2020: the depopulation radius was cut to 500 m (HB-04).
- February 2021: the Bantay ASF sa Barangay programme (AO 07 s2021) and a nationwide state of calamity.
- July 2024: 17 regions, 74 provinces, 978 cities and municipalities and 5,463 barangays reached (HB-93). August 2024: first controlled vaccination; cash-assistance rates revised.
- March 2025: 39 barangays with active cases (HB-94). December 2025: 98 (HB-95). February 2026: 27 barangays in 13 provinces (HB-96). The 2025 and 2026 counts are BAI figures reported in the press, a secondary source.
- August 2026: new cases confirmed by PCR in Iriga City, Naga City and Nabua, Camarines Sur.

## The zone colours

- **Red (Infected)**: provinces, cities or municipalities with confirmed cases. Inside a Red zone the Quarantine Area is the 1 km around the infected farm.
- **Pink (Buffer)**: ASF-free localities inside an infected province, and areas next to infected zones.
- **Yellow (Surveillance)**: high-risk provinces with many pigs and much trade.
- **Light Green (Protected)**: no cases, next to a Yellow zone.
- **Dark Green (Free Zone)**: no cases.

A city or municipality can move from Red to Pink after at least 40 days with no outbreak, counted from the last day of cleaning and disinfection (HB-12). National ASF-free status needs 90 days without a new outbreak, shown by weekly negative monitoring (HB-13). Your zone decides which papers you need to move pigs: see [transport and shipping permits](/guide/transport-and-shipping-permits).

## The vaccine, as of 2026

The approved product is AVAC ASF LIVE, a live attenuated vaccine from Vietnam, registered by the FDA for two years under monitored release in July 2024. It is given only under the voluntary DA-BAI controlled programme, in Red and Pink zone barangays with no active case for at least 40 days (HB-12), to weanlings and growers at least 4 weeks old and apparently healthy (HB-35). Immunity is about 40% at 7 to 14 days and 90 to 95% at about 28 days (HB-38); the label claims at least five months (HB-39). Vaccinated pigs are sampled 30 days after vaccination and/or 7 days before slaughter (HB-36) and need a negative PCR before slaughter.

The government bought 600,000 doses for ₱350 million (DA, 2024) and gives them free within the programme (HB-41); no retail price per dose was found. Trade press in May to July 2026 reported 90% efficacy (HB-40, a secondary source), six vaccines awaiting registration and commercial release expected around the third quarter of 2026. The research found no DA or BAI primary statement confirming commercial release as of 1 September 2026.

> This status changes. The research says the current case count and zoning need a manual check on the BAI Disease Situation pages: the [ASF report](https://www.bai.gov.ph/Report/African) and the AsfZoning report on the same site.`,
    sources: ['HB-01', 'HB-02', 'HB-03', 'HB-04', 'HB-09', 'HB-10', 'HB-11', 'HB-12', 'HB-13', 'HB-35', 'HB-36', 'HB-38', 'HB-39', 'HB-40', 'HB-41', 'HB-93', 'HB-94', 'HB-95', 'HB-96'],
    prices: true,
    terms: [
      { term: 'African swine fever (ASF)', meaning: 'A virus disease of pigs with no treatment; in the acute form nearly every infected pig dies within 6 to 13 days. Notifiable: report the same day and move nothing.' },
      { term: 'Red zone', meaning: 'Infected zone: a province, city or municipality with confirmed ASF cases. Movement needs a CFS-ASF.' },
      { term: 'Pink zone', meaning: 'Buffer zone: an ASF-free locality inside an infected province, or an area next to an infected zone. Movement needs a CFS-ASF.' },
      { term: 'Yellow zone', meaning: 'Surveillance zone: a high-risk province with a dense pig population and much trade, no cases.' },
      { term: 'Green zone', meaning: 'Light Green is a protected zone with no cases next to a Yellow zone; Dark Green is the free zone. Movement out of Green zones needs no CFS-ASF.' },
      { term: 'Quarantine Area', meaning: 'The 1 km radius around an infected farm inside a Red zone; from 1 km to the LGU boundary is the Outside Quarantine Area.' },
    ],
  },
  {
    id: 'asf-what-to-do-on-suspicion',
    section: 'health',
    title: 'ASF: what to do on suspicion',
    summary: 'The signs that make a suspect case, who to report to, the movement stop and the things you must not do.',
    body: `## The signs

A suspect case, in the BAI definition used by AO 07 s2021, is high fever of 40.5 to 42 C with deaths in 2 to 10 days on average (HB-08), with any of: red or purple ear tips, tail, legs, chest or belly; vomiting; diarrhoea, sometimes bloody; eye discharge; bleeding from the nose or rectum; nervous signs; deaths in every age group; sudden death with no signs. A probable case adds a history of new pigs brought in, swill feeding or access to garbage. Only a laboratory PCR test confirms ASF. Classical swine fever (hog cholera) looks the same in the field and is reported the same way.

Rule of thumb from the research: fever above 40 C, blue or purple skin, bleeding, or several pigs dying within days is an ASF alert. Report today and move nothing.

## The reporting chain

1. Report the same day to the barangay: the Barangay Biosecurity Officer (BBO) or the barangay captain.
2. Report also to the City or Municipal Veterinarian, or where there is none, the Municipal Agriculture Office. They call the Municipal ASF Task Force.
3. The LGU must validate the report and start the investigation within 24 hours (HB-05).
4. Investigators sample 30 pigs, or all pigs if you have fewer, starting with the sick ones (HB-07). A rapid test may screen first; the regional laboratory (RADDL) or BAI confirms by PCR.
5. All farms within 1 km are mapped within 2 days (HB-06). If the screen is positive and the signs fit, the LGU secures a 500 m radius while the PCR result is awaited.
6. If confirmed, pigs within 500 m are depopulated under AO 22 s2020 (HB-04); farms 501 m to 1 km away are sampled instead. Under the original 1-7-10 protocol nothing moves within 1 km (HB-01), pigs within 7 km are tested and restricted (HB-02), and farms within 10 km must report any disease (HB-03).

The research found no national hotline number: the chain is documented, the phone numbers are not.

## Stop all movement

From the moment you suspect, nothing moves in or out: pigs, pork, manure, feed sacks, tools, vehicles and people, until the laboratory clears the farm. Isolate sick pigs. Keep dead pigs covered where they lie until the investigators have sampled them, then disinfect the area. Prepare your records: pig inventory, recent purchases, feed sources, visitors and treatments. Keep your RSBSA and farm registration at hand, because the cash-assistance claim needs the veterinarian's certification and the laboratory result: see [assistance and repopulation](/guide/asf-assistance-and-repopulation).

## What not to do

- Do not treat and hope. There is no treatment, and delay spreads the virus to the neighbours.
- Do not sell, slaughter or eat a sick pig. AC 12 s2019 treats the carcass of a diseased animal as adulterated food under RA 10611.
- Do not throw a carcass in a river or field. The LGU designates the burial site.
- Do not move pigs out of a quarantine area or without permits. Not reporting, late reporting, concealment, removing animals from a quarantine area and refusing inspection are prohibited acts under AO 07 s2021 Section 9. RA 3639 penalises transporting animals with a dangerous communicable disease.

Everyday prevention is in the [biosecurity checklist](/guide/biosecurity-checklist); the other diseases that can look similar are in [common diseases](/guide/common-diseases).`,
    sources: ['HB-01', 'HB-02', 'HB-03', 'HB-04', 'HB-05', 'HB-06', 'HB-07', 'HB-08'],
    terms: [
      { term: '1-7-10 protocol', meaning: 'The 2019 ASF response: depopulation and movement ban within 1 km of the infected farm, surveillance and blood testing within 7 km, mandatory disease reporting within 10 km. The depopulation radius was cut to 500 m in 2020.' },
      { term: 'Barangay Biosecurity Officer (BBO)', meaning: 'A community animal health worker, barangay livestock aide or person assigned by the LGU, deputised by the Provincial Veterinary Office, who does the weekly ASF negative monitoring and receives suspect reports.' },
      { term: 'Depopulation', meaning: 'The culling of all pigs within 500 m of a confirmed ASF case (Test and Destroy) ordered by the LGU under AO 22 s2020; depopulated pigs qualify for cash assistance.' },
      { term: 'RADDL', meaning: 'The DA regional animal disease laboratory that runs the ASF PCR test; BAI-ADDRL in Quezon City is the national one.' },
    ],
  },
  {
    id: 'asf-assistance-and-repopulation',
    section: 'health',
    title: 'ASF assistance and repopulation',
    summary: 'The cash assistance per pig depopulated, the sentinel and restocking rules, and the Bantay ASF sa Barangay programme.',
    body: `## Cash assistance (indemnification)

Under DA AO 10 s2024 (15 August 2024), a raiser whose pigs within 500 m of the index case are depopulated gets cash assistance per head:

| Animal class | Cash assistance per head (AO 10 s2024, 15 August 2024) |
|---|---|
| Suckling piglet | ₱0 (HB-30) |
| Weanling (about 30 to 90 days old, up to 25 kg) | ₱4,000 (HB-30) |
| Grower (25 to 75 kg) | ₱8,000 (HB-31) |
| Finisher (over 70 kg) | In the order, but illegible in the scanned copy (HB-31) |
| Sow that has farrowed, or boar at least 8 months old | ₱12,000 (HB-32) |

Earlier rates were ₱3,000 per head in September 2019 and ₱5,000 per head from late 2019 to mid 2024 (HB-33).

The claim needs a licensed government veterinarian's certification of the signs, a rapid or PCR result and the DA Regional Field Office's depopulation form. It does not apply to pigs insured with the Philippine Crop Insurance Corporation (PCIC); about 40.7% of hog farmers had PCIC cover in 2023 (HB-92). Payment passes through the provincial or city veterinary office, the regional office, BAI, the DA Undersecretary for Livestock and the DA Finance Group before release. A smallhold farm under these rules is 1 to 20 sows or 1 to 100 pigs (HB-34).

## Repopulation and sentinel rules

AO 07 s2021 sets a recovery path for an infected barangay that takes about 3 months (HB-14):

1. No new outbreak, shown by weekly negative monitoring (HB-23), with active surveillance within 1 km every 30 days until release from quarantine (HB-15).
2. Clean with a foaming agent, disinfect with an approved ASF disinfectant at label dilution, then a 20-day downtime (HB-16).
3. Environmental tests on day 7 and day 14 after cleaning; positives are checked by PCR (HB-17).
4. Sentinel pigs at 10% of normal stocking, at least 60 days old and 15 to 20 kg, from ASF-free farms (HB-18). A field validation on 145 Philippine farms used a median of 3 sentinels per farm and found 90.34% of farms negative throughout.
5. Watch the sentinels 40 days: faecal screening on days 7 and 21, blood PCR on day 40 (HB-19). They must be PCR-negative before restocking.
6. A Certificate to Repopulate from the Provincial ASF Task Force, then restocking at 50% of capacity in a locally declared ASF-free barangay of a Red-zone municipality, and full capacity once the LGU is Pink (HB-21).

After the upgrade the farm must be registered, meet the minimum biosecurity of AO 07 Annex 9, accept visits and weekly monitoring, pass a biosecurity evaluation every 6 months and hold a CFS-ASF from 6 months after the upgrade, renewed every 6 months (HB-22).

The government sentinel programme gave each of 8,000 farmers in eight regions 3 to 5 piglets plus feed, drugs and biologics, with release from quarantine after 40 ASF-free days (HB-20). The INSPIRE programme (2021 to 2023) funded ₱400 million for calibrated repopulation, ₱200 million for multiplier farms and ₱272 million for hog insurance premium subsidy. RSBSA registration is a prerequisite for programme assistance: see [government support programs](/guide/government-support-programs).

## Bantay ASF sa Barangay

AO 07 s2021 (February 2021) launched Bantay ASF sa Barangay (BABay ASF). It has five components: risk assessment, surveillance and monitoring; biosecurity; capability building; LGU engagement; and recovery and repopulation. Its field arms are the Barangay Biosecurity Officers, deputised by the Provincial Veterinary Office after a one-day training, and Veterinary Biosecurity Officers. They do the weekly ASF negative monitoring; municipal summaries go to the provincial office every Tuesday. Missing two consecutive weekly reports is a ground for retesting (HB-23). In Red and Pink zones that weekly report is what keeps your CFS-ASF valid: see [transport and shipping permits](/guide/transport-and-shipping-permits).`,
    sources: ['HB-14', 'HB-15', 'HB-16', 'HB-17', 'HB-18', 'HB-19', 'HB-20', 'HB-21', 'HB-22', 'HB-23', 'HB-30', 'HB-31', 'HB-32', 'HB-33', 'HB-34', 'HB-92'],
    prices: true,
    terms: [
      { term: 'Indemnification (cash assistance)', meaning: 'The DA payment per pig depopulated within 500 m of a confirmed ASF case: ₱4,000 per weanling, ₱8,000 per grower, ₱12,000 per sow or boar under AO 10 s2024 (15 August 2024). Not paid for PCIC-insured pigs.' },
      { term: 'Sentinel pigs', meaning: 'Test pigs placed after cleaning, disinfection and the 20-day downtime, at 10% of normal stocking, at least 60 days old and 15 to 20 kg, watched 40 days and PCR-tested before a farm may restock.' },
      { term: 'Downtime', meaning: 'The empty period after cleaning and disinfection: 20 days before sentinels under AO 07 s2021; at least 3 days of drying (5 on soil floors) after routine disinfection.' },
      { term: 'Bantay ASF sa Barangay (BABay ASF)', meaning: 'The DA programme under AO 07 s2021: weekly ASF negative monitoring by barangay biosecurity officers, Test and Destroy, and the recovery and repopulation rules.' },
      { term: 'Certificate to Repopulate', meaning: 'The paper from the Provincial ASF Task Force a farm needs before restocking after an ASF outbreak.' },
    ],
  },
  {
    id: 'transport-and-shipping-permits',
    section: 'health',
    title: 'Transport and shipping permits',
    summary: 'The veterinary health certificate and shipping permit every live hog shipment needs, the ASF-zone papers on top, and the checkpoints.',
    body: `## Two papers for every shipment

Under DA AO 05 s2019, every shipment of live animals within and between Luzon, Visayas and Mindanao carries two documents. The old "Authority to Ship" was abolished.

| Document | Who issues it | Valid for |
|---|---|---|
| Veterinary Health Certificate (VHC) | The farm's attending veterinarian for BAI, DARFO or LGU-registered farms, with written concurrence of the LGU or DARFO veterinarian; the LGU or DARFO veterinarian for farms without one | 3 days, counted from the day after issue, weekends and holidays included (HB-25) |
| Shipping Permit (SP) | BAI-NVQSD: central office, veterinary quarantine stations, or online at nvqsd.bai.gov.ph | 7 days from the day after issue; free of charge (HB-26) |

The shipping permit needs a VHC not older than 3 days. Online applications take at most 3 working days (HB-27). Any alteration voids the permit.

## What a smallholder must show

A backyard farm may transport pigs if it meets the VHC, laboratory test and vaccination requirements. For pigs going to slaughter, a VHC is sufficient under the general rule. Breeding pigs must come from a BAI-accredited breeder farm and piglets for fattening from a BAI- or LGU-accredited farm; the VHC certifies that the source farm and zone have no reported priority swine disease. The trader needs a Livestock Handler's Licence and a registered transport carrier. AO 05 s2019 requires the vaccinations and medications given before shipment to be recorded for the VHC, so keep the treatment records and check [withdrawal periods](/guide/withdrawal-periods) before you book a truck.

## The ASF layers on top

- Red and Pink zones: movement needs a Certificate of Free Status on ASF (CFS-ASF) based on a negative PCR. For smallhold farms it is issued through clustering approved by the DARFO and endorsed by the Provincial Veterinary Office, and renewed with the weekly negative monitoring reports. Commercial farms retested inside a 1 km quarantine area get a CFS-ASF valid only 7 days (HB-28).
- Green zones: movement is not restricted and needs no CFS-ASF.
- Hog traders and carriers need a Hog Transport Pass, valid 6 months, before a VHC is issued (HB-24); the truck must be washed and disinfected.
- Vaccinated pigs under the ASF programme go to slaughter only if apparently healthy and PCR-negative in the 30-day monitoring or within 7 days before slaughter (HB-36). A PCR-positive pig without signs is held 7 days and retested (HB-37).
- LGUs add their own orders. Cebu's Executive Order 39 (7 July to 21 August 2026) restricted hog entry after cases in Negros, and Cebu's Recognised ASF-Free (RAS-ASF) municipal certification, valid 3 to 6 months, lets raisers ship out without a laboratory test per shipment (HB-29). Whether RAS-ASF exists outside Cebu is an open question in the research.

## Checkpoints

Issued permits are checked at BAI veterinary quarantine station checkpoints. RA 3639 penalises transporting animals with a dangerous communicable disease or out of a declared infected locality. The wider rules on selling and moving pigs are in [movement and sale rules](/guide/movement-and-sale-rules). Before a sale, segregate the pigs for 15 days with no new introductions (HB-43), as the [biosecurity checklist](/guide/biosecurity-checklist) says.`,
    sources: ['HB-24', 'HB-25', 'HB-26', 'HB-27', 'HB-28', 'HB-29', 'HB-36', 'HB-37', 'HB-43'],
    terms: [
      { term: 'Veterinary Health Certificate (VHC)', meaning: 'The certificate a veterinarian issues for a shipment of live animals, valid 3 days from the day after issue, weekends included. Required with a shipping permit for every shipment; on its own it is enough for pigs going to slaughter.' },
      { term: 'Shipping Permit (SP)', meaning: 'The free BAI-NVQSD permit for moving live animals, valid 7 days from the day after issue; it needs a VHC not older than 3 days. Replaced the old Authority to Ship.' },
      { term: 'Certificate of Free Status on ASF (CFS-ASF)', meaning: 'The certificate, based on a negative PCR, that a farm in a Red or Pink zone needs to move pigs; for smallhold farms issued through DARFO-approved clustering and kept valid by the weekly negative monitoring reports.' },
      { term: 'Hog Transport Pass', meaning: 'The pass a hog trader or transport carrier needs before a VHC is issued, valid 6 months.' },
      { term: 'RAS-ASF', meaning: 'Recognised ASF-Free municipal certification in Cebu, valid 3 to 6 months, which lets raisers ship live hogs out without a laboratory test per shipment.' },
    ],
  },
  {
    id: 'biosecurity-checklist',
    section: 'health',
    title: 'Biosecurity checklist',
    summary: 'The daily, weekly, new-stock, visitor and suspicion checks from the research, with the numbers behind them.',
    body: `## Why it matters

Segregation comes first: keep other pigs, people and vehicles away from yours. Cleaning removes most dirt and germs. Disinfection comes last and fails on a dirty surface. A survey of 350 smallholders in Baybay City, Leyte (mean herd 5.24 pigs) found fewer than 10% with a working footbath, about 30% feeding swill and 76% keeping no records, although 82.3% knew about ASF (HB-91). The checks below are the research document's checklist, grouped as it groups them. The app's own routine lists are in [daily checklist](/guide/daily-checklist) and [weekly and monthly checklists](/guide/weekly-and-monthly-checklists).

### Daily

- Wash or brush boots, then stand in the footbath for a full count: 60 seconds minimum, 5 minutes ideal (HB-46), at the farm entrance and at each pen.
- Wear farm-only clothes and footwear; wash hands before and after pig work.
- Feed only commercial feed or farm by-products; no raw kitchen or restaurant scraps. If swill must be used, boil it 30 minutes, stirring, then cool (HB-45). Uncooked pork stays infectious 3 to 6 months (HB-11).
- Check every pig: appetite, breathing, skin colour (ears, tail, belly), faeces; take the temperature of any pig off feed (alert at 40 C and above, HB-08).
- Record deaths, sick pigs and treatments (product, dose, date, animal) and the withdrawal end date.
- Check water and shade; in hot weather sprinkle or drip-cool pigs breathing faster than 50 per minute (HB-81).
- Keep dogs, cats, poultry and stray animals out of the pens; remove spilled feed.

### Weekly

- Change the footbath solution, more often after rain (dilution) or in heat (evaporation); check the concentration on the label.
- Clean pens with detergent and water, let them dry, then disinfect with an ASF-effective product at label dilution.
- Rodent control: check baits placed where pigs cannot reach them, remove refuse and vegetation around the pens, seal the feed store.
- Fly control: remove manure and wet bedding; keep drainage flowing.
- Submit or confirm the weekly ASF negative monitoring report through the barangay BBO or municipal office (Red and Pink zones, HB-23).
- Review the [vaccination calendar](/guide/vaccination-calendar): vaccinations, deworming and iron injections due this week.

### On arrival of new stock

- Buy only from a BAI- or LGU-accredited farm in an ASF-free area, with VHC and shipping permit, and CFS-ASF where required: see [transport and shipping permits](/guide/transport-and-shipping-permits).
- Do not let the delivery vehicle inside; unload at the perimeter; disinfect the unloading area.
- House new pigs in a separate quarantine pen for 30 days, minimum 14 (HB-42), handled last, with their own tools and boots.
- Observe and record daily; vaccinate (CSF and others due), deworm and treat for mange during quarantine.
- No further additions to the quarantine group until the period ends; move to the main herd only if healthy.

### On visitor

- Ask when they last had contact with pigs, slaughterhouses or markets; refuse entry if within 48 hours (HB-44).
- Write name, date and last pig contact in the visitor log.
- Provide farm boots and clothing or disposable coveralls; footbath and hand washing at entry.
- Keep visitors and buyers out of the pens; show pigs by photo or video, or meet at the gate.
- Traders and their vehicles: check the Hog Transport Pass (HB-24) and that the truck was washed and disinfected; load at the perimeter.

### On suspicion

Fever 40.5 C and above, blue or purple ears or belly, bleeding, or several sudden deaths (HB-08). The full steps are in [what to do on suspicion](/guide/asf-what-to-do-on-suspicion).

- Stop all movement of pigs, pork, manure, feed sacks, tools and people in or out of the farm.
- Report the same day to the barangay BBO or captain and the Municipal or City Veterinarian or Municipal Agriculture Office; the LGU must validate within 24 hours (HB-05).
- Do not treat and hope, do not sell, do not slaughter or eat the pig, do not throw the carcass in a river or field.
- Isolate sick pigs, keep dead pigs covered in place until investigators sample them, disinfect the area.
- Prepare records for the investigators: pig inventory, recent purchases, feed sources, visitors, treatments; keep the RSBSA and farm registration at hand for the cash-assistance claim.
- Cooperate with sampling (30 pigs or all pigs, HB-07), the 500 m and 1 km measures (HB-04) and the LGU's depopulation and burial arrangements.
- After depopulation: clean, disinfect, 20-day downtime (HB-16), environmental tests on days 7 and 14 (HB-17), then sentinels at 10% (HB-18) for 40 days (HB-19) before restocking.

## Disinfectants that kill the ASF virus

Use only approved products at the label dilution and contact time, never mix products, and wear gloves and a mask. Two Philippine routine disinfectants list 10 to 20 mL per gallon of warm water for use with animals present (HB-51). After cleaning and disinfection allow at least 3 days of drying before restocking, 5 days for soil floors (HB-47). Before selling, segregate the pigs for 15 days without signs, or at least bring in no new pigs during those 15 days (HB-43).

| Product | Concentration | Contact time |
|---|---|---|
| Sodium hydroxide (caustic soda) | 0.8% (HB-48) | 30 minutes |
| Hypochlorite (bleach), as available chlorine | 0.03 to 0.5% (HB-49) | 30 minutes |
| Formalin | 0.3% (HB-50) | 30 minutes |
| Ortho-phenylphenol | 3% (HB-50) | 30 minutes |
| Quaternary ammonium | 0.003% (HB-50) | 30 minutes |
| Iodine compounds | 0.015 to 0.0075% (HB-50) | 30 minutes |`,
    sources: ['HB-04', 'HB-05', 'HB-07', 'HB-08', 'HB-11', 'HB-16', 'HB-17', 'HB-18', 'HB-19', 'HB-23', 'HB-24', 'HB-42', 'HB-43', 'HB-44', 'HB-45', 'HB-46', 'HB-47', 'HB-48', 'HB-49', 'HB-50', 'HB-51', 'HB-81', 'HB-91'],
    terms: [
      { term: 'Biosecurity', meaning: 'The measures that keep disease off the farm: segregation first (keep other pigs, people and vehicles away), then cleaning, then disinfection, which fails on a dirty surface.' },
      { term: 'Segregation', meaning: 'Keeping your pigs apart from other pigs, people and vehicles; the first and most important element of biosecurity. Also the 15-day separation of pigs before transport or slaughter.' },
      { term: 'Quarantine (new stock)', meaning: 'Keeping newly bought pigs in a separate pen for 30 days (minimum 14), handled last with their own tools, before mixing them with the herd.' },
      { term: 'Footbath', meaning: 'A tray of disinfectant at the farm entrance and each pen; brush boots first, stand 60 seconds minimum and 5 minutes ideally, and change the solution often.' },
      { term: 'Swill', meaning: 'Kitchen or restaurant food waste fed to pigs; the main historical route of ASF into backyard herds. If it must be used, boil it 30 minutes, stir and cool.' },
      { term: 'All-in all-out', meaning: 'Filling a pen or farm with one group and emptying it completely before the next group, so that cleaning and disinfection happen between groups.' },
    ],
  },
  {
    id: 'vaccination-calendar',
    section: 'health',
    title: 'Vaccination calendar',
    summary: 'The health calendar from the research: vaccines, deworming, iron and mange treatment by age and stage, with the withdrawal reminders.',
    body: `## How to read it

Vaccinate only healthy pigs, and note the withdrawal time on the label: vaccines commonly carry 21 days on US labels (HB-59), so a vaccine given close to sale can delay it. Classical swine fever (hog cholera) is the mandatory core vaccine in the Philippines. Foot-and-mouth disease is not on the calendar: the Philippines has been FMD-free without vaccination since May 2011. ASF vaccination is only through the DA-BAI controlled programme, pigs 4 weeks and older (HB-35): see [ASF in the Philippines](/guide/asf-in-the-philippines). The claim that hog cholera vaccine is free through LGU offices is widely stated, but the research found no primary source for it.

The piglet rows fit into [piglet processing](/guide/piglet-processing); the gilt, sow and boar rows sit on the [breeding calendar](/guide/breeding-calendar). Every treatment starts a withdrawal clock: see [withdrawal periods](/guide/withdrawal-periods).

## Health calendar

| Who | Age or stage | What | Notes |
|---|---|---|---|
| Piglet | Day 3 and day 14 | Iron dextran injection | 1 mL IM each on Philippine 10% labels (HB-70); extension alternative 200 mg once at day 1 to 3 (HB-69) |
| Piglet | Day 0 to 7 | Needle-teeth clipping, navel and castration hygiene | Castrate at 3 to 7 days with iodine and clean instruments; prevents greasy pig entry wounds |
| Piglet | Day 21 | PCV2 and Mycoplasma vaccine | Single 2 mL dose (HB-60); healthy pigs only |
| Piglet | Day 35 to 56 if the sow was vaccinated; day 21 to 35 if not | Classical swine fever vaccine, first dose | (HB-54); second dose at 9 weeks in high-challenge areas on the MSD label; onset 5 to 12 days, lasts 4 to 8 months (HB-58) |
| Piglet | Day 28 to 56 | Erysipelas bacterin, only where erysipelas is a herd problem | Second dose 3 to 4 weeks later (HB-66) |
| Weaner | 1 week after weaning, about day 35 to 56 | First deworming | (HB-73); repeat 30 days later, different dewormer if on dirt (HB-74); levamisole in water or feed on the Philippine label |
| Grower | Day 65 to 90 | Second deworming | None before sale unless heavy burden; withdrawal: levamisole Philippine label 30 days, ivermectin 28 days |
| Grower | About day 90 | Mange treatment, herd programme | Ivermectin 1 mL per 33 kg (HB-77); repeat at 10 to 14 days if lesions (HB-76); 28-day withdrawal |
| Grower | From day 28, when the barangay is eligible | ASF vaccination, government programme only | (HB-35); sampling at 30 days after vaccination and/or 7 days before slaughter (HB-36); PCR clearance before slaughter |
| Grower | 15 days before transport or slaughter | Pre-sale segregation | No new pigs introduced during these 15 days (HB-43) |
| Grower | From the last treatment | Withdrawal check | Earliest sale = last dose + label withdrawal days |
| Gilt | 6 to 7 months, about 5 weeks before first breeding | Parvo (or Ery-Parvo-Lepto) vaccine, first dose | Second dose 3 weeks later, 2 to 4 weeks before breeding (HB-61, HB-63); not before 6.5 months; breed at 7.5 to 8 months |
| Gilt | 6 weeks before first farrowing | Classical swine fever vaccine, breeder schedule | Second dose 3 weeks before farrowing (HB-55); MSD alternative: second dose 6 months after the piglet dose, then annual |
| Gilt | 5 weeks before farrowing | E. coli scours vaccine | Second dose 2 weeks before farrowing (HB-67); protects piglets through colostrum, mainly the first 14 days |
| Gilt or sow | 7 to 21 days before farrowing | Deworm and wash | (HB-71); Philippine levamisole label: 2 weeks before farrowing (HB-72); move to a cleaned farrowing pen |
| Gilt or sow | Before entering the farrowing pen | Mange treatment | Every farrowing |
| Sow | 3 weeks before farrowing | Classical swine fever booster | Every gestation (HB-56); or annual under the MSD label |
| Sow | 2 to 3 weeks before farrowing | E. coli scours booster | Every farrowing (HB-68) |
| Sow | At weaning or 2 to 4 weeks before rebreeding | Parvo (or Ery-Parvo-Lepto) booster | Every cycle (HB-64); parvo at least annually (HB-62) |
| Sow | 2 weeks before breeding | Deworm | Philippine levamisole label (HB-72) |
| Sow | Farrowing to day 3 | MMA watch | Temperature above 39.5 C, hard udder, off feed: call the vet the same day (HB-83) |
| Sow | Whole lactation | Heat-stress watch | Above 21 C ambient for a lactating sow (HB-79); breathing above 50 per minute (HB-81) |
| Boar | Every 6 months | Classical swine fever vaccine | Twice yearly (HB-57) |
| Boar | 2 doses 3 weeks apart before first use, then every 6 months | Ery-Parvo-Lepto vaccine | (HB-65) |
| Boar | Every 6 months | Deworm and mange treatment | (HB-75) |
| Boar | As needed | Tusk trimming | |
| Whole herd | Every week | ASF negative monitoring (Red and Pink zones) | Summary every Tuesday; required for the CFS-ASF (HB-23) |
| Whole herd | Every 6 months after zone upgrade | Biosecurity evaluation | AO 07 Annex 9 scoring (HB-22) |
| Whole herd | On arrival, 30 days | New stock quarantine | Vaccinate and deworm on arrival; observe daily (HB-42) |

> Vitamin B-complex and other supportive injections are common on Philippine labels (for example day 10 and day 25 for sucklings) but are not prophylaxis in the veterinary sense. Philippine labels with full schedules for erysipelas, leptospirosis and E. coli vaccines were not found, so those rows come from US extension sources.`,
    sources: ['HB-22', 'HB-23', 'HB-35', 'HB-36', 'HB-42', 'HB-43', 'HB-54', 'HB-55', 'HB-56', 'HB-57', 'HB-58', 'HB-59', 'HB-60', 'HB-61', 'HB-62', 'HB-63', 'HB-64', 'HB-65', 'HB-66', 'HB-67', 'HB-68', 'HB-69', 'HB-70', 'HB-71', 'HB-72', 'HB-73', 'HB-74', 'HB-75', 'HB-76', 'HB-77', 'HB-79', 'HB-81', 'HB-83'],
    terms: [
      { term: 'Classical swine fever (CSF)', tagalog: 'hog cholera', meaning: 'A notifiable virus disease of pigs: fever of 41 C, depression, huddling, skin bleeding, nervous signs, death 5 to 25 days after onset, up to 100% mortality in young pigs. Looks like ASF in the field. Vaccination is the control and is the mandatory core vaccine in the Philippines.' },
      { term: 'Maternal antibody', meaning: 'Protection a piglet gets from a vaccinated sow through colostrum; it sets the age of the first CSF dose (5 to 8 weeks if high, 3 to 5 weeks if low) and blocks parvo vaccine before 6.5 months.' },
    ],
  },
  {
    id: 'common-diseases',
    section: 'health',
    title: 'Common diseases',
    summary: 'The diseases and conditions of tropical smallholder herds with their signs and the first response, and the alerts that mean call the vet today.',
    body: `## The alerts

Four rules of thumb from the research. Fever above 40 C, blue or purple skin, bleeding, or several pigs dying within days is an ASF or CSF alert: report today, no movement ([what to do on suspicion](/guide/asf-what-to-do-on-suspicion)). Sudden death of a good-looking grower is an erysipelas or peracute-disease alert. A sow off feed within 3 days of farrowing is an MMA alert. A scouring litter needs fluids within hours.

## Diseases and conditions

| Disease | Who | Signs | First response |
|---|---|---|---|
| African swine fever | All ages | Fever 40.5 to 42 C, death in 2 to 10 days (HB-08), purple ears and belly, bleeding, sudden deaths; mortality close to 100% (HB-10) | No treatment. Stop movement, report within the day, no home treatment, no sale |
| Classical swine fever (hog cholera) | All ages | Fever 41 C, depression, huddling, red eyes, skin bleeding, nervous signs, death 5 to 25 days after onset; incubation 2 to 14 days (HB-53) | Report as for ASF; the two cannot be told apart in the field. Vaccination is the control |
| Piglet diarrhoea (E. coli, Clostridium, rotavirus; later salmonella, dysentery) | 0 to 3 weeks and 3 to 9 weeks | Watery diarrhoea, fast dehydration, sudden death | Oral fluids and electrolytes, warmth, dry bedding, antimicrobial guided by the vet; a Philippine oral apramycin-electrolyte product is given 3 to 5 days with a 14-day withdrawal. Call the vet if piglets collapse, blood appears or more than one litter is affected. Prevent with sow vaccination before farrowing |
| Greasy pig disease (Staphylococcus hyicus) | 5 to 60 days old | Listless, reddened skin, brown spots turning to greasy crusts, not itchy; mortality 5 to 90% (HB-84) | Systemic antimicrobial plus daily antiseptic spray (chlorhexidine or povidone-iodine) and oral fluids. Prevent by clipping needle teeth, soft bedding, disinfected farrowing pens, no mixing |
| Erysipelas | Growers, finishers, breeders | Sudden deaths, fever 40 to 42 C, diamond-shaped skin patches, painful joints, reluctance to move | Penicillin G procaine every 12 hours for at least 3 days (HB-85); vaccinate breeding stock twice yearly. Handlers can get a skin rash |
| Respiratory disease (Mycoplasma, secondary bacteria) | From about 16 weeks | Chronic cough, poor growth | Vaccinate piglets, avoid mixing and crowding, all-in all-out. Philippine injectables: long-acting oxytetracycline 1 mL per 10 kg, enrofloxacin 1 mL per 20 kg daily for 3 days. Call the vet for open-mouth breathing, high fever with blue ears (rule out ASF and CSF) or deaths |
| Sarcoptic mange and lice | All ages | Head shaking, ear lesions spreading over the body, intense itching, grey crusts in older pigs; spreads by contact within 24 hours | Ivermectin (1 mL per 33 kg, HB-77) or doramectin injection, repeat at 10 to 14 days, treat the whole herd (HB-76); quarantine and treat new stock |
| Internal parasites (roundworm, nodular worm, whipworm, threadworm, lungworm) | All ages; threadworm kills piglets from 4 days | Poor feed efficiency, cough, diarrhoea, liver condemnations | The deworming schedule in the [vaccination calendar](/guide/vaccination-calendar), plus sanitation, drainage and concrete floors |
| Postpartum dysgalactia (MMA) | Sows, first 3 days after farrowing | Rectal temperature above 39.5 C (HB-83), hard red udder, off feed, piglets hungry and scouring | Call the vet the same day: flunixin 2.2 mg/kg IM, oxytocin every 2 to 3 hours, antimicrobials only if infection is suspected. Prevent with clean sows and pens, correct condition, supervised farrowing |
| Reproductive failure (parvo, lepto) | Sows and gilts | Mummified piglets, small litters, abortions | Prevention only: the pre-breeding vaccination on the calendar |
| Heat stress | All, lactating sows worst | Breathing above 50 per minute at rest (HB-81); feed intake falls 30 to 60 g per day per degree between 25 and 30 C (HB-82) | Shade and roof insulation, cool water always, wet the skin (sprinkler, drip, wallow), feed in the cool hours, never restrict water. Over-conditioned sows suffer most |

## Heat limits by class

The upper comfort limits are European figures; the research found no Philippine thresholds. A finisher over 60 kg is stressed above 25 C, comfortable up to 20 C (HB-78). A lactating sow is stressed above 21 C (comfort 18 C), a pregnant sow above 26 C, an empty sow above 29 C (HB-79). Piglets tolerate more: 35 C at 8 kg, 30 C at 20 kg, 28 C for a 30 kg grower (HB-80). Lactating sows dropped from 4.9 kg of feed a day at 20 C to 2.8 kg at 30 C (HB-82). Housing answers are in [ventilation and heat stress](/guide/ventilation-and-heat-stress); the MMA watch belongs to [farrowing](/guide/farrowing).

> Every antibiotic or dewormer above starts a withdrawal clock. Record the product, dose and date, and see [withdrawal periods](/guide/withdrawal-periods).`,
    sources: ['HB-08', 'HB-10', 'HB-53', 'HB-76', 'HB-77', 'HB-78', 'HB-79', 'HB-80', 'HB-81', 'HB-82', 'HB-83', 'HB-84', 'HB-85'],
    terms: [
      { term: 'MMA (postpartum dysgalactia)', meaning: 'Mastitis, metritis, agalactia: a sow with rectal temperature above 39.5 C, a hard red udder and no appetite within 3 days after farrowing, with hungry scouring piglets. Call the vet the same day.' },
      { term: 'Greasy pig disease', meaning: 'Exudative epidermitis from Staphylococcus hyicus in piglets 5 to 60 days old: reddened skin and brown spots turning to greasy crusts, not itchy; mortality 5 to 90%.' },
      { term: 'Erysipelas', meaning: 'A bacterial disease of growers, finishers and breeders: sudden deaths, fever 40 to 42 C, diamond-shaped skin patches, painful joints. Penicillin is the treatment; it can give handlers a skin rash.' },
      { term: 'Mange', meaning: 'Sarcoptic mites: head shaking, ear lesions spreading over the body, intense itching and grey crusts; spreads by contact and through contaminated pens within 24 hours.' },
      { term: 'Heat stress', meaning: 'When a pig cannot shed heat: breathing above 50 per minute at rest, falling feed intake. A lactating sow is stressed above 21 C, a finisher above 25 C.' },
    ],
  },
  {
    id: 'withdrawal-periods',
    section: 'health',
    title: 'Withdrawal periods',
    summary: 'What a withdrawal period is, why the app blocks a sale before it ends, and the meat withdrawal days from Philippine and US labels.',
    body: `## What a withdrawal period is

The withdrawal period is the time that must pass between the last dose of a veterinary product and slaughter, or sale for slaughter, so that residues in the meat fall below the permitted limit. Philippine law requires every veterinary product label to state it: DA AO 11 s1991 defines the label "Warning" as the statement of the withdrawal period before the animal is slaughtered for food (HB-98).

The clock starts at the last dose. If a product is given over several days, the last day starts the count. A 5-day withdrawal after a dose at noon on 1 January ends at noon on 6 January. Vaccines generally carry 21 days on US labels (HB-59); the Philippine CSF label pages state none, so check the physical label. The figure differs by product, dose, route and even injection-site volume: ceftiofur is 4 days at up to 5 mL per site and 6 days above that. That is why the app stores the figure from the actual product label, not from the active ingredient alone.

## Why the app blocks the sale

When a pig or batch has a treatment record, the earliest allowed sale or slaughter date is the date of the last dose plus the label withdrawal days. A planned sale before that date is refused with "in withdrawal until" the date unless you tick that you accept the risk. The treatment form lists the products in the table below: picking one fills in its label days and shows the label type; for any other product, type the days from its label. The batch page shows the result as "Sale allowed from": see [growth tracking](/guide/growth-tracking).

Two more clocks run beside it. Pigs vaccinated under the ASF programme need the PCR clearance before they move to slaughter, and AO 05 s2019 requires the vaccinations and medications given before shipment to be recorded for the veterinary health certificate: see [transport and shipping permits](/guide/transport-and-shipping-permits). The routine treatments that start these clocks are on the [vaccination calendar](/guide/vaccination-calendar).

## Meat withdrawal in days, swine

"PH label" is the figure on a Philippine-registered product page; "US label" is from a US FDA-approved label; "extension" is a university compilation of US labels. Always prefer the figure on the physical label of the product you used.

| Product or active ingredient | Route | Withdrawal days | Label type |
|---|---|---|---|
| Oxytetracycline long-acting (Sustalin LA) | IM | 14 | PH label |
| Oxytetracycline 200 mg/mL (Liquamycin LA-200) | IM | 28 | US label |
| Oxytetracycline 300 mg/mL (Noromycin 300 LA) | IM or SC | 28 | US label |
| Enrofloxacin (Bacterid) | IM, daily 3 days | 10 | PH label |
| Doxycycline, tylosin, paracetamol, bromhexine, prednisolone (Vetracin Ultima) | Oral in water, 5 to 7 days | 10 | PH label |
| Doxycycline and tiamulin (Vetracin Gold with Probiotics) | Oral in feed or water, 5 to 7 days | 10 | PH label |
| Chlortetracycline with vitamins A and B12 (Vetracin Premium) | Oral in water, 5 to 7 days | 4 | PH label |
| Chlortetracycline with vitamins A and B12 (Vetracin Classic) | Oral in water, 5 to 7 days | 5 | PH label |
| Apramycin, attapulgite, electrolytes (Apralyte) | Oral, 3 to 5 days | 14 | PH label |
| Tylosin 200 mg/mL (Tylan 200) | IM | 14 | US label |
| Ceftiofur hydrochloride (Excenel RTU EZ) | IM | 4 at up to 5 mL per site; 6 at 5 to 15 mL per site | US label |
| Ceftiofur crystalline free acid (Excede for Swine) | IM, single dose | 14 | US label |
| Tulathromycin (Draxxin 25) | IM | 5 | US label |
| Florfenicol (Nuflor-S) | IM | 11 | US label |
| Ivermectin 1% injectable (GenVet Ivermec), 1 mL per 33 kg (HB-77) | SC or IM | 28 | PH label |
| Ivermectin injectable (Ivomec) | SC | 18 | Extension (US label) |
| Ivermectin premix | Feed | 5 | Extension (US label) |
| Doramectin (Dectomax) | IM | 24 | Extension (US label) |
| Levamisole (Latigo) | Oral in water or feed | 30 | PH label |
| Levamisole (US water-soluble) | Drinking water | 3 | Extension (US label) |
| Fenbendazole (Safe-Guard swine) | Feed, 3 days | 0 | Extension (US label) |
| Pyrantel (Banminth premix) | Feed | 1 | Extension (US label) |
| Permethrin sprays | Topical | 5 | Extension (US label) |
| Albendazole 11.25% (GenVet Alzen) | Oral | Not stated for swine (7 to 10 sheep and goat; 27 cattle and carabao) | PH label, no swine figure |
| Vaccines (general) | IM or SC | 21 (HB-59) | Extension (US labels); PH CSF label pages state none |
| Iron dextran (GenVet ID 100, Jectran Premium) | IM | Not stated on the page | PH label, no figure shown |

> No Philippine label was found for amoxicillin long-acting, penicillin-streptomycin, tylosin injectable, florfenicol, ceftiofur, tulathromycin or lincomycin, so the US figures stand in for them and are marked as such.`,
    sources: ['HB-59', 'HB-77', 'HB-98'],
    terms: [
      { term: 'Withdrawal period', meaning: 'The days that must pass between the last dose of a veterinary product and slaughter or sale for slaughter, so that meat residues fall below the permitted limit. Every Philippine label must state it (DA AO 11 s1991).' },
    ],
  },
  {
    id: 'mortality-benchmarks',
    section: 'health',
    title: 'Mortality benchmarks',
    summary: 'Death rates by stage: the Philippine smallholder figures, the commercial reference and the thresholds the research suggests, with the main causes.',
    body: `## Mortality by stage

The only Philippine mortality data the research found are two smallholder pre-weaning studies from 1999 and 2001. Nursery, grow-finish and sow figures come from commercial benchmarks abroad.

| Stage | Philippine smallholder figure | Reference figure | App guide |
|---|---|---|---|
| Pre-weaning (birth to weaning) | 19.0% at a northern site and 12.8% at a southern site, 222 herds, 1999 (HB-86); 37% in untreated control herds in a 1998 to 1999 trial | InterPIG 2024 median 12.7%, range 7.8% to 16.2%; PigCHAMP USA 2023 mean 14.6% (HB-87) | Target under 15%; good under 10% |
| Nursery (weaning to about 25 to 30 kg) | None found | InterPIG 2024 leaders 1.4% to 1.9% (HB-88) | Good under 3%; investigate above 5% |
| Grow-finish | None found | InterPIG 2024 leaders 1.4% to 1.7% (HB-89) | Good under 3%; investigate above 5% |
| Sow and gilt death rate, per year, excluding culls | None found | PigCHAMP USA 2023 mean 14.7%, range 7.1% to 20.2% (HB-90) | No Philippine benchmark |

The app guide thresholds are the research document's suggestions, not published benchmarks. ASF changes everything: mortality approaches 100% in the acute form (HB-10), so a single death with ASF signs is an alert, not a statistic. How the app counts deaths and where the benchmarks sit beside the other KPIs is in [KPI benchmarks](/guide/kpi-benchmarks).

## What the Philippine trial showed

The 1998 to 1999 trial on 170 smallholder sows cut pre-weaning deaths from 37% to 0% with four changes: a heated piglet pen, vitamin injections, creep feed and early weaning (HB-86). Those are the piglet-week measures in [farrowing](/guide/farrowing) and [lactation and weaning](/guide/lactation-and-weaning).

## Main causes by stage

- Pre-weaning: piglet diarrhoea from E. coli, Clostridium and rotavirus in the first 3 weeks, with sudden death from dehydration; greasy pig disease in piglets 5 to 60 days old, mortality 5 to 90% (HB-84); threadworm, which can kill piglets from 4 days of age; a sow with MMA in the first 3 days after farrowing (HB-83), whose piglets starve within hours; chilling and damp.
- Nursery: diarrhoea from E. coli, salmonella, swine dysentery and proliferative enteropathy between 3 and 9 weeks; mixing and crowding.
- Grow-finish: erysipelas, with sudden death of a good-looking grower (HB-85); respiratory disease from about 16 weeks; heat stress, breathing above 50 per minute (HB-81).
- Sows: MMA, heat stress in lactation above 21 C (HB-79), and the notifiable diseases at any age.

Signs and first responses are in [common diseases](/guide/common-diseases); the prevention schedule is the [vaccination calendar](/guide/vaccination-calendar).`,
    sources: ['HB-10', 'HB-79', 'HB-81', 'HB-83', 'HB-84', 'HB-85', 'HB-86', 'HB-87', 'HB-88', 'HB-89', 'HB-90'],
    terms: [
      { term: 'Pre-weaning mortality', meaning: 'Piglets that die between birth and weaning as a share of piglets born alive. Philippine smallholders: 12.8% to 19.0% in a 1999 study; the research suggests under 15% as the target and under 10% as good.' },
      { term: 'Nursery stage', meaning: 'From weaning to about 25 to 30 kg.' },
    ],
  },
  {
    id: 'veterinary-services',
    section: 'health',
    title: 'Veterinary services',
    summary: 'Where a smallholder gets veterinary help: the LGU veterinarian or agriculture office, the barangay officers, the DA laboratories and private vets, and what the research says about cost.',
    body: `## The LGU

The Local Government Code (RA 7160) makes a veterinarian mandatory for every province and city, but not for a municipality (HB-97). Many municipalities therefore rely on the Municipal Agriculture Office (MAO). The LGU veterinarian must take the measures needed to eradicate, prevent or cure animal diseases and regulates slaughter and the keeping of animals. Where there is no municipal veterinarian, AO 07 s2021 has the MAO coordinate ASF recovery with the Provincial Veterinarian, and LGUs may hire a part-time veterinarian. For a suspect case the chain is barangay first, then the City or Municipal Veterinarian or the MAO: see [what to do on suspicion](/guide/asf-what-to-do-on-suspicion).

## The barangay

Barangay Biosecurity Officers (community animal health workers, barangay animal health workers, barangay livestock aides) are trained by ATI-ITCPH (the International Training Center on Pig Husbandry) and the ATI regional centres, deputised by the Provincial Veterinary Office, and do the weekly monitoring and sample collection in Red and Pink zones.

## DA laboratories and programmes

Each region has a DA laboratory (RADDL) and BAI-ADDRL in Quezon City runs ASF PCR; the DA-CAR integrated laboratory said its services for economically important diseases are free. RSBSA registration is the prerequisite for programme assistance: sentinel piglets, ASF vaccination and repopulation ([assistance and repopulation](/guide/asf-assistance-and-repopulation)). PCIC livestock insurance, with a premium subsidy under INSPIRE, covers deaths but excludes the ASF cash assistance; 40.7% of hog farmers had it in 2023 (HB-92). Registrations are in [permits and registrations](/guide/permits-and-registrations) and the programmes in [government support programs](/guide/government-support-programs).

## Private

The Animal Welfare Act rules define consulting veterinarians for farms up to 300 sows and resident veterinarians above that. Agri-vet stores sell the Philippine-registered vaccines, dewormers and antibiotics cited in this section.

## What it costs, where the research says

- ASF vaccine: free within the government programme; 600,000 doses were bought for ₱350 million (DA, 2024) (HB-41). No retail price per dose was found.
- Shipping permit: free of charge (HB-26).
- ASF PCR at the DA-CAR laboratory: stated as free for economically important diseases.
- Hog cholera vaccine: the claim that BAI-produced vaccine is distributed free to RSBSA-registered raisers through municipal offices, and a procurement unit cost of about ₱164 per 10-dose vial, appear only in secondary or aggregator pages that were not verifiable; no BAI or LGU primary page was found.
- Private veterinarian fees and product prices: not in the research.`,
    sources: ['HB-26', 'HB-41', 'HB-92', 'HB-97'],
    prices: true,
    terms: [
      { term: 'Municipal Agriculture Office (MAO)', meaning: 'The LGU office that stands in for a municipal veterinarian where none is appointed; receives ASF suspect reports and coordinates recovery with the Provincial Veterinarian.' },
      { term: 'Provincial Veterinary Office (PVO)', meaning: 'The office of the provincial veterinarian, mandatory under RA 7160; deputises the barangay biosecurity officers, validates cash-assistance claims and endorses smallholder CFS-ASF clustering.' },
      { term: 'DARFO', meaning: 'DA Regional Field Office: validates zone upgrades, approves smallholder clustering for the CFS-ASF and consolidates depopulation records for cash assistance.' },
      { term: 'Consulting veterinarian', meaning: 'A private veterinarian serving farms of up to 300 sows under the Animal Welfare Act rules; farms above 300 sows need a resident veterinarian.' },
    ],
  },
]

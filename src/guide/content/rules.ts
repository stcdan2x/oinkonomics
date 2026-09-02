import type { GuideArticle } from '../types'

// Section 'rules': permits, movement, welfare law, tax and support programs,
// compiled from research/regulations-and-tax.md (rows RT-01 to RT-74).
// Research summary for a farm-management guide, not legal or tax advice.

export const RULES: GuideArticle[] = [
  {
    id: 'farm-classification',
    section: 'rules',
    title: 'Backyard, smallhold, semi-commercial, commercial',
    summary: 'How the PSA, the DA and your own municipality classify a piggery, and why the label changes your permits, fees, subsidies and ASF rules.',
    body: `## Two national definitions

Two PSA definitions are in circulation. Older statistics use the head-count one; current DA orders use the sow-level one. A raiser with 1 to 10 sows is a backyard or smallhold farm under both.

**Head-count definition** (PSA, as quoted by PIDS from 2018 metadata and by the DA Hog Industry Roadmap from 2021 data). A backyard farm raises any of:

- 1 to 20 adult pigs and no young (RT-01)
- 1 to 40 young pigs only (RT-02)
- 1 to 9 adults plus 1 to 21 young (RT-03)

At or above 21 adults with no young, 41 young, or 10 adults with 22 young, the farm is commercial (RT-01, RT-02, RT-03). Backyard farms held 70.6 percent of the national hog inventory as of September 2021 (RT-07).

**Sow-level definition** (PSA Board Resolution No. 11 s.2023, as quoted in DA AO 10 s.2024). A smallhold farm, also called a backyard farm, tends 1 to 20 sows or 1 to 100 pigs (RT-04). DA AO 7 s.2021 sets the tiers above it: semi-commercial is 10 to 50 sows or 41 to 500 fatteners (RT-05); commercial is 51 sows or more, or 501 fatteners or more (RT-06). A 10-sow farm sits on the semi-commercial boundary in that order.

## Your municipality may cut off much lower

Local ordinances define "backyard" their own way, and the permit list and fees follow the local tier. Two examples from the research:

| LGU (ordinance year) | Tier | Ceiling |
|---|---|---|
| Moncada, Tarlac (2020) | Small scale piggery | 4 head, including 1 sow or 1 boar; piglets under 50 days not counted (RT-08) |
| Moncada, Tarlac (2020) | Medium scale piggery | 10 head, at most 2 sows and 1 boar (RT-09) |
| Moncada, Tarlac (2020) | Large scale piggery | 20 head, at most 4 sows and 1 boar (RT-10) |
| Burgos, Ilocos Sur (2020) | Backyard | 2 fatteners or 1 farrowing sow; above that the farm is commercial for permit purposes (RT-11) |

A raiser with 5 sows is "backyard" to the PSA and "medium" or "commercial" to some municipalities. Read your own ordinance before you build: see [local rules for small piggeries](/guide/local-rules-for-small-piggeries).

## What changes with the class

- **Subsidies and ASF programs** key off the PSA smallhold definition. The full PCIC premium subsidy goes to backyard raisers of up to 20 head (RT-51). ASF vaccination needs Biosecurity Level 1 for smallhold farms and Level 2 for semi-commercial and commercial farms. See [government support programs](/guide/government-support-programs) and [ASF assistance and repopulation](/guide/asf-assistance-and-repopulation).
- **Movement.** Backyard farms may ship pigs with a Veterinary Health Certificate (valid 3 days, RT-35) plus the tests and vaccinations; for slaughter a VHC is enough. See [movement and sale rules](/guide/movement-and-sale-rules).
- **Environmental permits.** The DENR threshold for an ECC or CNC sits in a table the research could not retrieve; one LGU example asks for it only at its large-scale tier. See [environmental rules](/guide/environmental-rules).
- **LGU fees** scale with the tier: in Burgos a sanitary permit is ₱50 for backyard and ₱200 for medium and large, and the mayor's permit ₱500 for medium and ₱1,500 for large (2020 ordinance, RT-28, RT-29, RT-30).
- **Animal welfare registration** with BAI applies to hog farms with no size floor on the DA regional page that lists it: ₱1,000 for the initial one-year certificate (observed 2026-09-01, RT-32). See [permits and registrations](/guide/permits-and-registrations).`,
    sources: ['RT-01', 'RT-02', 'RT-03', 'RT-04', 'RT-05', 'RT-06', 'RT-07', 'RT-08', 'RT-09', 'RT-10', 'RT-11', 'RT-28', 'RT-29', 'RT-30', 'RT-32', 'RT-35', 'RT-51'],
    prices: true,
    terms: [
      { term: 'Smallhold farm', meaning: 'PSA sow-level definition (Board Resolution No. 11 s.2023, quoted in DA AO 10 s.2024): a farm tending 1 to 20 sows or 1 to 100 pigs; also called a backyard farm.' },
      { term: 'Biosecurity Level 1', meaning: 'Under DA AO 7 s.2021, compliance with the minimum biosecurity standards set by the Philippine College of Swine Practitioners; required before a farm may repopulate, join ASF vaccination or get the PCIC swine subsidy.' },
    ],
  },
  {
    id: 'permits-and-registrations',
    section: 'rules',
    title: 'Permits and registrations checklist',
    summary: 'Every clearance, permit and registration a small piggery may need, who issues it, when, and what it costs where a dated fee was found.',
    body: `## The checklist

Fees are quoted as the research found them, with date and place. Most LGU fees come from two 2020 ordinances (Moncada, Tarlac and Burgos, Ilocos Sur) and are examples, not national rates. "Not stated" means the source named the permit but not its fee.

| Permit or registration | Who issues it | When needed | Cost or fee (dated) |
|---|---|---|---|
| Barangay clearance (some LGUs attach an ocular inspection report) | Punong Barangay or sangguniang barangay | Before start, then yearly with the business permit | "Reasonable fee" set by the barangay (RA 7160, 1991); not fixed nationally |
| Barangay farm registration | Barangay | Before start | None stated (Burgos, 2020) |
| Mayor's or business permit | Municipal or city treasurer or BPLO | Before start; yearly renewal | ₱500 medium, ₱1,500 large (Burgos, 2020, RT-30); none listed for the backyard tier |
| Sanitary permit or sanitary inspection clearance | Municipal or city health office | Before start; yearly | ₱50 backyard, ₱200 medium and large (Burgos, 2020, RT-28, RT-29) |
| Inspection fee | Municipal task force or health office | At application | ₱50 backyard, ₱100 medium and large (Burgos, 2020, RT-28, RT-29) |
| Locational or zoning clearance | Municipal planning and development office | Before start (medium tier and up in Moncada) | Not stated |
| Building and occupancy permit, engineer's clearance on pens and septic tank | Municipal engineer | Before construction (medium tier and up) | ₱200 engineer's clearance (Burgos, 2020, RT-29) |
| Community tax certificate | Municipal treasurer or barangay | Before start | Statutory schedule not researched |
| BIR certificate of registration (Form 1901, TIN) | BIR Revenue District Office | On or before commencement of business | ₱0: the ₱500 annual registration fee was repealed in 2024 (RT-60) |
| Registration of books of accounts and invoices | BIR RDO | Before use | None stated |
| DTI business name registration (if trading under a name; needed for BMBE) | DTI | Before start | Not researched |
| BMBE Certificate of Authority (optional) | DTI Negosyo Center | Before claiming the income tax exemption; renew every 2 years (RT-66) | Free at DTI (2016 guide); the LGU may charge up to ₱1,000 under RA 9178 (RT-65) |
| Animal welfare facility registration (RA 8485) | DA Regional Field Office inspects, BAI issues | Before operating a hog farm; 1-year initial, 3-year renewal | ₱1,000 initial, ₱3,000 three-year renewal (DA RFO3, observed 2026-09-01, RT-32) |
| CNC or ECC | DENR-EMB regional office | Before start where the project is covered; threshold table not retrieved | Not researched |
| Discharge permit (if wastewater goes to a water body) | DENR-EMB | Before discharging | Not researched |
| RSBSA enrolment | Municipal or city agriculture office (DA registry) | Before applying for the PCIC subsidy, ACPC loans or ASF vaccination | Free |
| Hog Transport Pass (traders and carriers) | Provincial veterinary office | Before trading or hauling hogs in the province; precondition to a VHC | Not stated |
| Veterinary Health Certificate | Farm veterinarian with LGU or DA-RFO concurrence, or the LGU or DA-RFO veterinarian | Per shipment of live hogs; valid 3 days (RT-35) | Fee not stated in DA AO 5 s.2019; LGU fees vary |
| Shipping permit | LGU veterinarian (within the province); BAI-NVQSD or a deputized LGU vet (beyond it) | Per shipment crossing a boundary; valid 7 days (RT-36) | ₱0 (DA AO 5 s.2019, RT-37) |
| Certificate of Free Status on ASF | Provincial or LGU veterinary office under the ASF task force | Per farm in red or pink zones, before movement | Not stated |
| Certificate to Repopulate | Provincial ASF Task Force | Before restocking after an outbreak | Not stated |
| Meat inspection certificate, slaughter at an accredited or LGU-registered slaughterhouse | NMIS or LGU meat inspector | Per animal slaughtered for sale; the certificate travels with the meat | LGU slaughter fees vary, not researched |
| PCIC swine insurance enrolment | PCIC through the municipal or city agriculture or veterinary office | Per production cycle or yearly | Premium subsidised 100 percent for RSBSA backyard raisers up to 20 head (2021 program terms, RT-51) |

## Barangay clearance and the mayor's permit

Under the Local Government Code (RA 7160, 1991) no city or municipality may issue a business permit until you hold a barangay clearance from the barangay where the farm sits. The barangay may charge a reasonable fee and must act within 7 working days; after that the municipality may issue the permit anyway (RT-25). Municipal business tax on producers of meat and other agricultural products is capped at half the general schedule (RT-26), and a business with gross sales at or below ₱30,000 a year in a municipality or ₱50,000 in a city is taxed by the barangay instead (RA 7160, 1991, RT-27). A subsistence raiser who sells only what the family produced is a "marginal farmer" whom LGUs may not tax on those sales.

Moncada asks a small scale piggery for a barangay clearance with an ocular inspection report, a community tax certificate, a sanitary inspection clearance and a veterinary health certificate before the treasurer issues the mayor's permit; medium and large tiers add a BIR certificate, a locational clearance and a building and occupancy permit. Burgos asks backyard farms for a barangay clearance "interposing no objection" and a sanitary permit, adds an engineer's clearance and a mayor's permit for medium scale, and a Sangguniang Bayan resolution plus an ECC or CNC application for large scale. See [farm classification](/guide/farm-classification) for the tiers.

## Sanitary permit

The Code on Sanitation (PD 856, 1975) does not name piggeries as an "offensive trade", so the sanitary permit comes in practice from the LGU ordinance: Burgos charges ₱50 for backyard and ₱200 for medium and large (2020, RT-28, RT-29). The Code does ban wells within 25 m of any source of pollution (RT-24). A DOH rule that many ordinances cite for a 25 m setback from dwellings was not located in primary form.

## DA and BAI registration

RA 8485 (1998) requires anyone operating a stock farm or similar facility to hold a BAI certificate of registration, valid one year and renewable (RT-34). The DA Region 3 page lists hog farms among the facilities that must register: ₱1,000 for the initial one-year certificate and ₱3,000 for a three-year renewal, with a 50 percent surcharge on expired certificates (observed 2026-09-01, RT-32); stockfarms, corrals and stockyards pay ₱500 and ₱1,500 (RT-33). Requirements include the facility veterinarian's PRC ID, a CNC or ECC, photos, a location map and an animal welfare seminar certificate; the regional office inspects and BAI processes in one to two weeks.

**RSBSA** (Registry System for Basic Sectors in Agriculture) enrolment at the municipal agriculture office is the key to ACPC loans, the PCIC swine subsidy and ASF vaccination. RA 12308 (25 September 2025) orders a Livestock Registry System within 180 days as the master list of beneficiaries of the new animal industry fund. See [government support programs](/guide/government-support-programs).

## The Philippine National Standard

PNS/BAFS 267:2019, the Code of Good Animal Husbandry Practice (GAHP) for Swine, covers breeding, commercial and backyard farms: location, layout, pig houses, feeds, water, personnel, biosecurity, welfare, waste and records, kept for at least 3 years (RT-23). A 2022 revision replaced it and, per secondary summaries, added biosecurity, waste and ASF provisions; its text could not be downloaded, so the research describes the 2019 edition. Certification is voluntary, through DA regional offices. See [standard records](/guide/standard-records) and [biosecurity checklist](/guide/biosecurity-checklist).`,
    sources: ['RT-23', 'RT-24', 'RT-25', 'RT-26', 'RT-27', 'RT-28', 'RT-29', 'RT-30', 'RT-32', 'RT-33', 'RT-34', 'RT-35', 'RT-36', 'RT-37', 'RT-51', 'RT-60', 'RT-65', 'RT-66'],
    prices: true,
    terms: [
      { term: 'RSBSA', meaning: 'Registry System for Basic Sectors in Agriculture: the DA farmer registry, enrolled at the municipal or city agriculture office, that qualifies a raiser for ACPC loans, the PCIC swine premium subsidy and ASF vaccination.' },
      { term: 'BMBE', meaning: 'Barangay Micro Business Enterprise (RA 9178, 2002): an enterprise in production, processing, agro-processing, trading or services with total assets of not more than ₱3,000,000 excluding land, registered at a DTI Negosyo Center for an income tax exemption.' },
      { term: 'GAHP', meaning: 'Good Animal Husbandry Practice: the Philippine National Standard for swine (PNS/BAFS 267) covering location, housing, feeds, water, biosecurity, welfare, waste and records; certification is voluntary.' },
      { term: 'Marginal farmer', meaning: 'Under the Local Government Code, an individual engaged in subsistence farming limited to selling, bartering or exchanging products produced by himself and his immediate family; LGUs may not tax those sales.' },
    ],
  },
  {
    id: 'environmental-rules',
    section: 'rules',
    title: 'Environmental rules: ECC, CNC, wastewater and distances',
    summary: 'When a piggery needs a DENR certificate or discharge permit, the effluent rules, and the minimum distances from houses, wells and roads that ordinances and the national standard set.',
    body: `## ECC or CNC

DENR-EMB Memorandum Circular 2014-005 sorts projects into categories. Category A and B projects need an Environmental Compliance Certificate (ECC). Category D projects are "deemed unlikely to cause significant adverse impact" and need no ECC, though "such non-coverage shall not be construed as an exemption from compliance with other environmental laws and government permitting requirements". The head count at which a piggery moves from Category D to Category B sits in Annex A of the circular, which could not be retrieved on the research date, so that threshold is left open.

What is verified: a CNC or ECC is a documentary requirement for BAI animal welfare registration (see [permits and registrations](/guide/permits-and-registrations)), and the Burgos, Ilocos Sur ordinance (2020) asks for an ECC or a non-coverage application only at its large-scale tier and states that an ECC is not required for a medium scale piggery.

## Wastewater and the discharge permit

The Clean Water Act (RA 9275, 2004) requires anyone who discharges regulated effluent to hold a DENR discharge permit. Discharging pollutants into water bodies or operating without a permit is a prohibited act, with fines of ₱10,000 to ₱200,000 for every day of violation (RA 9275, 2004, RT-67). DENR DAO 2021-19 updates the effluent standards for ammonia, boron, copper, fecal coliform, phosphate and sulfate.

Both ordinance examples forbid draining piggery waste into canals, rivers or any body of water and require a watertight septic tank or a biogas digester sized to the stock, at least 30 m from the nearest groundwater in Moncada and 25 m in Burgos (2020, RT-14). Whether a backyard piggery with a septic tank and no outfall needs a discharge permit is not settled by any primary text found. See [waste and odour](/guide/waste-and-odour).

## Zoning and minimum distances

No national statute fixes a distance between a piggery and a house. The Code on Sanitation (PD 856, 1975) gives only a 25 m radius between a well and any source of pollution (RT-24). The national standard PNS/BAFS 267:2019 requires the farm to be inside the LGU's approved land use and sets distances aimed at commercial farms: 3 km from the centre of a national highway, with exceptions for advanced waste technology (RT-20); 1 km from other farms and from built-up areas (RT-21); 5 km from slaughterhouses and animal holding facilities unless disease controls are in place (RT-22). It cites DA AO 12 s.2004 on farm distances, which was not retrieved.

The LGU examples show the range a small raiser may meet:

| Distance | Moncada, Tarlac (2020) | Burgos, Ilocos Sur (2020) |
|---|---|---|
| Pen to nearest household | 15 m small scale (RT-12); 30 m medium and large (RT-13); no hog raising in built-up areas | Not stated as a house distance |
| Piggery to built-up area | Prohibited inside built-up areas | 500 m backyard (RT-16); 1,000 m commercial (RT-17) |
| Piggery to drinking water sources | Not stated | 25 m from ground and surface sources (RT-15) |
| Septic tank to groundwater | 30 m (RT-14) | 25 m (RT-14) |
| Commercial piggery to national highway | Not stated | 500 m (RT-18) |
| Between farms | Not stated | 500 m backyard, 1,000 m commercial (RT-19) |

Moncada does not count piglets under 50 days old as head. A backyard pen may have to sit anywhere from 15 m to 500 m from the nearest house, depending on the municipality. Fines start at ₱1,000 for a first offence in Burgos, rising to ₱2,000 or closure; Moncada gives a reprimand first, then up to ₱2,500 (2020 ordinances, RT-31). Check the ordinance before you pick a site: see [site and building](/guide/site-and-building) and [local rules for small piggeries](/guide/local-rules-for-small-piggeries).`,
    sources: ['RT-12', 'RT-13', 'RT-14', 'RT-15', 'RT-16', 'RT-17', 'RT-18', 'RT-19', 'RT-20', 'RT-21', 'RT-22', 'RT-24', 'RT-31', 'RT-67'],
    prices: true,
    terms: [
      { term: 'ECC', meaning: 'Environmental Compliance Certificate: the DENR-EMB certificate required for projects in Category A or B of the Philippine EIS system under EMB MC 2014-005.' },
      { term: 'CNC', meaning: 'Certificate of Non-Coverage: the DENR-EMB document for a Category D project deemed unlikely to cause significant adverse impact, which needs no ECC; it does not exempt the farm from other environmental laws and permits.' },
    ],
  },
  {
    id: 'movement-and-sale-rules',
    section: 'rules',
    title: 'Moving and selling live pigs',
    summary: 'The Veterinary Health Certificate and shipping permit every live shipment needs, the ASF colour zones and checkpoints, and what to have in hand before a buyer takes pigs off your farm.',
    body: `## VHC and shipping permit

DA AO 5 s.2019 (3 September 2019) requires every shipment of live animals to carry a Veterinary Health Certificate (VHC) and a Shipping Permit. Only accredited farms and registered carriers may transport animals, but backyard and smallholder farms are allowed to ship provided they have the VHC, the laboratory tests and the vaccinations; for slaughter, a VHC is enough.

- **Who issues the VHC.** Your attending veterinarian with written concurrence from the LGU or DA regional veterinarian, or the LGU or DA-RFO veterinarian if you have no vet, as long as the farm is registered with BAI, the DA-RFO or the LGU veterinary office and its vaccination record is up to date.
- **Validity.** The VHC lasts 3 days, counted from the day after issue, weekends included (RT-35). The shipping permit lasts 7 days (RT-36) and is free (RT-37); the BAI-NVQSD online system processes it in up to 3 working days (RT-39).
- **Who issues the permit.** Within a province, the LGU veterinarian; across provinces, regions or islands, BAI-NVQSD or a deputized LGU vet, under a "one VHC, one destination, one shipment" policy (BAI MC 26-17, secondary reproduction).
- **Tests.** Pigs moved for breeding or fattening need negative PRRS, pseudorabies and brucellosis tests, CSF vaccination and a VHC stating no swine influenza on the source farm for six months. Pigs for slaughter need a VHC stating no clinical signs of a notifiable disease.
- **Missing papers.** The shipment is seized and you have 24 hours to produce the documents (RT-38); after that the animals go back to origin or are confiscated and stamped out at the shipper's cost.

## ASF zones and checkpoints

DA AC 02 s.2022 sets the ASF zones at municipality or city level: RED (infected: a confirmed outbreak in one barangay spreading to others within 15 days, RT-41), PINK (buffer around red; NCR is treated as pink), YELLOW (surveillance), LIGHT GREEN (protected) and DARK GREEN (free). It says, zone by zone, which live pigs and pork may move where, always with a VHC and a Local Shipping Permit. Live pigs for slaughter from a red zone may move only to other red zones and must be slaughtered there.

DA AO 7 s.2021 (Bantay ASF sa Barangay) adds a provincial Hog Transport Pass for traders and carriers, required before a VHC is issued, and a Certificate of Free Status on ASF for farms in red and pink zones. Moving animals without permits, not reporting and refusing inspection are violations. An LGU with no outbreak for at least 40 days after the last cleaning and disinfection may start recovery (RT-42). LGU checkpoints mirror these rules, and some cities also require local raisers to register with the city veterinarian (Sorsogon City, EO 35 s.2021). See [ASF in the Philippines](/guide/asf-in-the-philippines).

## Before a buyer moves pigs off your farm

1. Have the farm registered with BAI, the DA regional office or the LGU veterinary office, with the vaccination record updated. Without this no vet can issue the VHC.
2. Get a VHC for the shipment. It lasts only 3 days (RT-35), so time it with the pickup.
3. If the pigs cross a boundary, get the shipping permit as well (free, 7 days, RT-36, RT-37).
4. In a red or pink zone, get the Certificate of Free Status on ASF first.
5. Ask the trader or hauler for their Hog Transport Pass; the VHC depends on it.
6. Pigs sold for breeding or fattening need the tests and CSF vaccination above; pigs for slaughter need only the VHC.

Selling live hogs to a lechonero or a trader is a live-animal movement like any other; the slaughter duties fall on whoever slaughters. See [transport and shipping permits](/guide/transport-and-shipping-permits), [sale channels and buyers](/guide/sale-channels-and-buyers) and [slaughter and meat inspection](/guide/slaughter-and-meat-inspection).`,
    sources: ['RT-35', 'RT-36', 'RT-37', 'RT-38', 'RT-39', 'RT-41', 'RT-42'],
    terms: [
      { term: 'VHC', meaning: 'Veterinary Health Certificate: the certificate a veterinarian issues for each shipment of live animals under DA AO 5 s.2019, valid 3 days counted from the day after issue.' },
      { term: 'Shipping permit', meaning: 'The permit that must accompany a live-animal shipment together with the VHC (DA AO 5 s.2019); issued by the LGU veterinarian within a province or by BAI-NVQSD beyond it, valid 7 days, free.' },
      { term: 'Hog Transport Pass', meaning: 'The provincial pass DA AO 7 s.2021 requires of hog traders and carriers before a VHC is issued.' },
    ],
  },
  {
    id: 'slaughter-and-meat-inspection',
    section: 'rules',
    title: 'Slaughter and meat inspection',
    summary: 'Pork sold must come from an accredited or LGU-registered slaughterhouse and pass inspection; hot meat carries prison terms and fines of up to ₱1,000,000.',
    body: `## The rule

The Meat Inspection Code (RA 9296, 12 May 2004), as amended by RA 10536 (15 May 2013), makes the National Meat Inspection Service (NMIS) the sole national authority on meat inspection and hygiene. An abattoir is premises approved and registered by that authority. LGUs build, manage and operate slaughterhouses and run local meat inspection in their jurisdictions.

For a small raiser the rule comes down to this: any pork sold, including to a wet market stall or a lechonero, must come from an accredited or LGU-registered slaughterhouse and pass ante-mortem (live) and post-mortem (carcass) inspection. Neither RA 9296 nor RA 10536 contains an exemption for slaughter for home consumption in the text the research read. Whether LGU ordinances or NMIS rules allow backyard slaughter for the family's own use, and under what conditions lechoneros may slaughter, was not sourced and stays an open question.

## Hot meat and its penalties

"Hot meat" is the carcass or parts of food animals slaughtered in unregistered or unaccredited meat establishments without the required inspection, including meat NMIS classifies as such. Selling, transporting or distributing hot meat in commerce is punishable by imprisonment of six to twelve years and/or a fine of ₱100,000 to ₱1,000,000, plus confiscation, with administrative fines of ₱50,000 to ₱500,000 (RA 10536, 2013, RT-68).

## Meat on the road

Meat in transport must carry a Meat Inspection Certificate for local meat; without it the load is in violation at a checkpoint (DA AO 5 s.2019). Slaughterhouse classes "AAA", "AA" and "A" (national and export, or local distribution) are set in the implementing rules of RA 9296 (DA AO 28 s.2005), which could not be opened on the research date; the class decides how far the meat may legally travel, so that detail is left open. Slaughter and inspection fees at LGU slaughterhouses were not researched.

## Live sale versus selling meat

Selling a live hog to a lechonero or trader is a live-animal movement: it needs the VHC (valid 3 days, RT-35), a shipping permit where the animal crosses a boundary, and whatever the LGU checkpoints require. The slaughter obligation then falls on whoever slaughters. If you plan to sell roasted lechon or cut pork yourself, the slaughter has to go through an accredited or registered slaughterhouse and inspection first, which is a cost and a step to plan for. Killing pigs is allowed only through humane procedures under the Animal Welfare Act (RA 8485, 1998).

See [movement and sale rules](/guide/movement-and-sale-rules), [strategy: value add](/guide/strategy-value-add) and [strategy: grow to roaster](/guide/strategy-grow-to-roaster).`,
    sources: ['RT-35', 'RT-68'],
    prices: true,
    terms: [
      { term: 'Hot meat', meaning: 'Under RA 9296 as amended by RA 10536: the carcass or parts of food animals slaughtered in unregistered or unaccredited meat establishments without the required inspection, including meat NMIS classifies as such.' },
    ],
  },
  {
    id: 'animal-welfare-law',
    section: 'rules',
    title: 'Animal welfare and other national laws',
    summary: 'The Animal Welfare Act, its transport and humane-killing rules and penalties, the swine husbandry standard, the feeds law, the anti-swill orders and the 2025 animal industry law.',
    body: `## Animal Welfare Act

RA 8485 (11 February 1998), amended by RA 10631 (3 October 2013), regulates facilities that breed, keep, treat or trade animals. Three parts reach a small piggery:

- **Registration.** Anyone operating a stock farm, stockyard, corral or similar establishment must first secure a BAI certificate of registration, valid one year and renewable (Section 1, RT-34). See [permits and registrations](/guide/permits-and-registrations) for the fee.
- **Transport.** Transporters must provide adequate, clean and sanitary facilities, and sufficient food and water when animals are in transit for more than 12 hours (Section 4, RT-40). Overcrowding and carrying animals in vehicle trunks are prohibited.
- **Killing.** Pigs and other food animals may be killed only through humane procedures using the most scientific methods available (Section 6).

Penalties after RA 10631 (2013, RT-69):

| Offence | Imprisonment | Fine |
|---|---|---|
| Cruelty without death | 6 months to 1 year | and/or up to ₱30,000 |
| Serious injury | 1 year and 1 day to 1 year and 6 months | and/or up to ₱50,000 |
| Death of the animal | 1 year, 6 months and 1 day to 2 years | and/or up to ₱100,000 |
| Aggravated (syndicate, business, public officer, three or more animals) | 2 years and 1 day to 3 years | and/or up to ₱250,000 |

## The swine husbandry standard

PNS/BAFS 267:2019, the Code of Good Animal Husbandry Practice for Swine, covers welfare alongside location, pig houses, feeds, water, personnel, biosecurity, waste and record keeping (records kept at least 3 years, RT-23) for breeding, commercial and backyard farms. The 2022 revision could not be downloaded, so its added clauses are unverified. Certification is voluntary. See [pen space by stage](/guide/pen-space-by-stage) for the practical side.

## Transport rules

Live pigs also move under DA AO 5 s.2019 and the ASF zoning orders: a Veterinary Health Certificate valid 3 days (RT-35) and a free shipping permit valid 7 days (RT-36, RT-37) for every shipment. See [movement and sale rules](/guide/movement-and-sale-rules).

## Feeds law

The Livestock and Poultry Feeds Act (RA 1556, 16 June 1956) requires anyone who manufactures, imports, sells or distributes feeds to register with BAI, and every mixture, concentrate, supplement or ingredient to be registered before sale. The statutory fees are ₱5 for retailers and ₱100 for manufacturers, 1956 amounts; the current BAI schedule was not verified (RT-74). Rice bran and corn bran sold in their natural state are excluded. The text read does not address a farmer mixing feed for his own pigs, so home-mixing for own use is not a registrable activity under the text found, while selling mixed feed to neighbours is. See [alternative feeds](/guide/alternative-feeds).

## Swill and ASF orders

DA AO 7 s.2021 directs the ASF task forces to discourage the use of swill (food waste) as hog feed.

## Clean Water Act

Discharging waste to a water body needs a DENR permit; fines run ₱10,000 to ₱200,000 per day of violation (RA 9275, 2004, RT-67). See [environmental rules](/guide/environmental-rules).

## Animal Industry Development and Competitiveness Act

RA 12308 (25 September 2025) converts BAI into a line bureau and creates the Animal Industry Competitiveness Enhancement Fund: 26 percent for repopulation and herd build-up (the lawphil transcription of the hog and poultry split reads inconsistently; DA and news releases describe the 70 percent share as hogs), 15 percent for credit through Land Bank and DBP including interest subsidies and "negative interest loans in the case of calamities", 9 percent for a Capacity Recovery Fund giving "actual cash assistance" to farmers hit by declared disease outbreaks, and a Livestock Registry System within 180 days. Implementing rules were not yet found on the research date.`,
    sources: ['RT-23', 'RT-34', 'RT-35', 'RT-36', 'RT-37', 'RT-40', 'RT-67', 'RT-69', 'RT-74'],
    prices: true,
  },
  {
    id: 'tax-in-plain-language',
    section: 'rules',
    title: 'Tax in plain language',
    summary: 'VAT exemption on live pigs and pork, BIR registration, books and invoices, the 8 percent option and graduated rates, marginal income earners, BMBE and LGU business tax, with every figure dated.',
    body: `Oinkonomics has no tax module: what follows is general information from the research, not tax advice, and your Revenue District Office (RDO) has the final word. The app only records sales and expenses; see [money rules](/guide/money-rules) and [farm accounting conventions](/guide/farm-accounting-conventions).

1. **Selling live pigs and fresh pork is VAT-exempt.** Livestock and agricultural food products in their original state are exempt under Section 109(1)(A) of the Tax Code (as amended by RA 9337, 2005). You do not add 12 percent VAT to your price and you cannot claim VAT on your feed. The general VAT threshold for other sales is ₱3,000,000 in gross annual sales (RA 10963, 2017, RT-54).
2. **Register with the BIR once**, on or before your first sale, at the RDO covering your farm, using Form 1901. You get a TIN and a certificate of registration. The ₱500 yearly registration fee was repealed in 2024 (RR 7-2024, read from a secondary reproduction, RT-60).
3. **Have your books of accounts registered before you use them.** A simple two-column journal of daily sales and expenses is acceptable for the smallest sellers. Keep all records for 5 years from the day after the return deadline (RA 11976, 2024, RT-61). See [standard records](/guide/standard-records).
4. **Issue a registered sales invoice** for every sale of ₱500 or more, or whenever the buyer asks (RA 11976, 2024, RT-59). For many small sales in a day you may issue one invoice for the day's total once it reaches ₱500. Official receipts are no longer the primary document since 2024.
5. **Choose your income tax method** if gross sales in a year are not more than ₱3,000,000: (a) the graduated income tax on net profit plus percentage tax where it applies, or (b) an 8 percent tax on gross sales above ₱250,000 with no percentage tax (RA 10963 and RR 8-2018, RT-56). You choose in the first quarterly return of the year, cannot change within the year, and default to (a) if you do not tick it. The 8 percent option lapses if sales pass ₱3,000,000, and a raiser with a salaried job does not get the ₱250,000 deduction against it.
6. **Graduated rates from 1 January 2023** (RR 8-2018, RT-57, RT-58): the first ₱250,000 of net taxable income a year is taxed at zero, then 15 percent up to ₱400,000, 20 percent up to ₱800,000, 25 percent up to ₱2,000,000, 30 percent up to ₱8,000,000 and 35 percent above that.
7. **Percentage tax** under Section 116 is 3 percent of gross quarterly sales for non-VAT businesses under the ₱3,000,000 threshold; it was 1 percent from July 2020 to June 2023 (RA 11534, 2021, RT-55). Because livestock and pork sales are exempt under a different paragraph of Section 109, whether it applies to your sales was not resolved from a primary BIR text. Ask your RDO; do not assume either way.
8. **Marginal income earner.** If your gross sales are not more than ₱100,000 in any 12 months and the farm is your livelihood, you may register as a marginal income earner (RMC 7-2014, RT-63): Form 1901 with a sworn statement of income, simplified books, registered invoices, an annual income tax return, and no VAT or percentage tax. This 2014 circular has not been found repealed but has not been re-confirmed against 2024 issuances.
9. **BMBE.** If your total business assets excluding land are not more than ₱3,000,000 (RA 9178, 2002, RT-64), you can register as a Barangay Micro Business Enterprise at the DTI Negosyo Center: free per the DTI guide, though the LGU may charge up to ₱1,000 (RT-65); the certificate lasts 2 years, renewable (RT-66). You then apply at your RDO for income tax exemption on farm income and file an Annual Information Return instead. You lose it if assets pass ₱3,000,000 or the business moves.
10. **Micro taxpayer.** With gross sales under ₱3,000,000 you are a "micro" taxpayer (RA 11976, 2024, RT-62): a two-page income tax return, no duty to withhold tax on your purchases, and reduced penalties if you file late.
11. **LGU business tax.** Producers of meat and agricultural products pay at most half the standard municipal business tax rate (RA 7160, 1991, RT-26), businesses with gross sales at or below ₱30,000 a year (municipality) or ₱50,000 (city) are taxed by the barangay instead (RT-27), and a subsistence "marginal farmer" who sells only what the family produced may not be taxed by the LGU on those sales. See [permits and registrations](/guide/permits-and-registrations).

> Records the BIR expects: registered books, registered invoices and their duplicates, kept 5 years, quarterly and annual income tax returns and, unless on the 8 percent option, quarterly percentage tax returns where they apply.`,
    sources: ['RT-26', 'RT-27', 'RT-54', 'RT-55', 'RT-56', 'RT-57', 'RT-58', 'RT-59', 'RT-60', 'RT-61', 'RT-62', 'RT-63', 'RT-64', 'RT-65', 'RT-66'],
    prices: true,
    terms: [
      { term: 'Marginal income earner', meaning: 'BIR RMC 7-2014: a self-employed individual whose gross sales do not exceed ₱100,000 in any 12-month period, principally for subsistence or livelihood, including farmers selling directly to consumers; exempt from VAT and percentage tax, with simplified books.' },
      { term: 'Micro taxpayer', meaning: 'Under the Ease of Paying Taxes Act (RA 11976, 2024), a taxpayer with gross sales under ₱3,000,000: two-page return, no duty to withhold creditable tax, reduced surcharges and interest.' },
    ],
  },
  {
    id: 'government-support-programs',
    section: 'rules',
    title: 'Government support programs',
    summary: 'ASF cash assistance, PCIC swine insurance, ACPC and Land Bank credit, repopulation programs and the ASF vaccine, with the terms and dates the research found.',
    body: `## ASF cash assistance

DA AO 10 s.2024 (August 2024) pays raisers whose pigs within 500 m of an index case are depopulated (RT-44):

| Animal | Cash assistance per head (DA AO 10 s.2024) |
|---|---|
| Suckling piglet | ₱0 |
| Weanling (30 to 90 days, not more than 25 kg) | ₱4,000 (RT-45) |
| Grower and finisher (25 kg to over 70 kg) | ₱8,000 (RT-46) |
| Sow or boar | ₱12,000 (RT-47) |

It does not apply to hogs insured with PCIC and requires the order's veterinary and documentary steps. It replaced the flat ₱5,000 per culled hog reported under earlier orders (DA release, 2021, RT-48). See [ASF assistance and repopulation](/guide/asf-assistance-and-repopulation).

## PCIC livestock insurance

PCIC's regular livestock mortality product covers swine for 70 percent of the local selling or slaughter value, not exceeding ₱8,000 per head for non-commercial cover (undated PCIC product profile, observed 2026-09-01, RT-52), at premiums of 3 to 8 percent for breeders and 0.5 percent per month for fatteners (RT-53). Perils are diseases, accidents, drowning, strangulation, snakebite, fire and lightning, and transport accidents.

The Swine Industry Insurance Program launched in 2021 covers up to ₱10,000 per fattener aged 45 days to 6 months (RT-49), ₱14,500 per F1 breeder and ₱34,000 per parent or grandparent stock (RT-50), and counts government-ordered ASF culling as a compensable peril. RSBSA-listed backyard raisers with at most 20 head get a 100 percent premium subsidy (2021 program terms, RT-51). It requires Biosecurity Level 1, biosecurity training, LGU farm registration and a farm in a green, light green or pink zone. Premium percentages seen only in a search snippet were not confirmed, and the 2021 terms may have changed.

## Credit

| Program (ACPC unless stated) | Maximum | Terms | Date |
|---|---|---|---|
| Agri-Negosyo (ANYO), individual small farmer | ₱300,000 (RT-70) | 2 percent interest plus a service fee of up to 3.5 percent, repayment on project cash flow up to 5 years, RSBSA required | Observed 2026-09-01 |
| KAYA (Kapital Access for Young Agripreneurs), ages 18 to 30 | ₱500,000 (RT-71) | 0 percent, service fee up to 3.5 percent, no collateral, up to 5 years; agriculture-related schooling and RSBSA or FFEDIS registration | Observed 2026-09-01 |
| SURE (Survival and Recovery), calamity areas | ₱25,000 (RT-72) | 0 percent, 3 percent service fee, no collateral, up to 3 years; RSBSA-enrolled farmers under a state of calamity | Observed 2026-09-01 |
| ANYO SWINE R3, backyard raisers in green zones | ₱300,000 | Zero interest, payable up to 5 years, from a ₱800,000,000 fund | 2021 |
| Land Bank SWINE window, commercial raisers, cooperatives and SMEs in ASF-free areas | 80 percent of project cost (RT-73) | 3 percent fixed for 3 years, repayable up to 5 years | March 2021 |

ANYO asks for a government ID, a photo, RSBSA proof and a farm plan and budget. Whether the 2021 windows remain open was not confirmed. See [capital and payback](/guide/capital-and-payback) before you borrow.

## Repopulation and dispersal

INSPIRE (Integrated National Swine Production Initiatives for Recovery and Expansion), launched 11 February 2021 with ₱600,000,000, has three components: calibrated repopulation through swine livelihood enterprises, breeder multiplier farms, and intensive modernized production. Bantay ASF sa Barangay had ₱1,500,000,000. Repopulation follows a sentinel protocol: sentinels at 10 percent of normal stocking, at least 60 days old and 15 to 20 kg, from ASF-free farms, negative on PCR before full restocking (RT-43); the farm must register with the city or municipality and reach Biosecurity Level 1. RA 12308 (25 September 2025) now funds repopulation through the new animal industry fund, with priority to cooperative members.

## ASF vaccine

DA AC 13 s.2024 (November 2024) lets smallhold farms join the controlled ASF vaccination if the barangay has had no active case for 40 days (RT-42), on a letter of intent, a signed veterinarian-client-patient relationship form, DA or BAI registration (RSBSA or animal welfare registration) and Biosecurity Level 1.

Almost every program above starts with RSBSA enrolment at the municipal agriculture office: see [permits and registrations](/guide/permits-and-registrations).`,
    sources: ['RT-42', 'RT-43', 'RT-44', 'RT-45', 'RT-46', 'RT-47', 'RT-48', 'RT-49', 'RT-50', 'RT-51', 'RT-52', 'RT-53', 'RT-70', 'RT-71', 'RT-72', 'RT-73'],
    prices: true,
    terms: [
      { term: 'Sentinel pigs', meaning: 'Under DA AO 7 s.2021, the test animals placed at 10 percent of normal stocking (at least 60 days old, 15 to 20 kg, from ASF-free farms) that must test negative on PCR before a farm fully restocks after ASF.' },
    ],
  },
]

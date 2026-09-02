// Meat withdrawal periods for swine, from research/health-and-biosecurity.md
// "Withdrawal periods" (sources [Sn] are that document's list). days === null
// means the label shows no swine figure: the user must enter the label value.
// App rule: earliest sale date = last dose date + withdrawal days.

export type LabelType = 'PH label' | 'US label' | 'extension'

export interface WithdrawalProduct {
  name: string
  route: string
  days: number | null
  source: string
  labelType: LabelType
  note?: string
}

export const WITHDRAWAL_PRODUCTS: WithdrawalProduct[] = [
  { name: 'Oxytetracycline long-acting (Sustalin LA, Univet)', route: 'IM', days: 14, source: 'S41', labelType: 'PH label' },
  { name: 'Oxytetracycline 200 mg/mL (Liquamycin LA-200, Zoetis)', route: 'IM', days: 28, source: 'S72', labelType: 'US label' },
  { name: 'Oxytetracycline 300 mg/mL (Noromycin 300 LA, Norbrook)', route: 'IM/SC', days: 28, source: 'S75', labelType: 'US label' },
  { name: 'Enrofloxacin (Bacterid, Univet)', route: 'IM, daily 3 days', days: 10, source: 'S42', labelType: 'PH label' },
  { name: 'Doxycycline + tylosin + paracetamol + bromhexine + prednisolone (Vetracin Ultima, Univet)', route: 'oral, water, 5 to 7 days', days: 10, source: 'S44', labelType: 'PH label' },
  { name: 'Doxycycline + tiamulin (Vetracin Gold with Probiotics, Univet)', route: 'oral, feed or water, 5 to 7 days', days: 10, source: 'S45', labelType: 'PH label' },
  { name: 'Chlortetracycline + vitamins A and B12 (Vetracin Premium, Univet)', route: 'oral, water, 5 to 7 days', days: 4, source: 'S46', labelType: 'PH label' },
  { name: 'Chlortetracycline + vitamins A and B12 (Vetracin Classic, Univet)', route: 'oral, water, 5 to 7 days', days: 5, source: 'S47', labelType: 'PH label' },
  { name: 'Apramycin + attapulgite + electrolytes (Apralyte, Univet)', route: 'oral, 3 to 5 days', days: 14, source: 'S48', labelType: 'PH label' },
  { name: 'Tylosin 200 mg/mL (Tylan 200, Elanco)', route: 'IM', days: 14, source: 'S69', labelType: 'US label' },
  { name: 'Ceftiofur hydrochloride (Excenel RTU EZ, Zoetis)', route: 'IM', days: 6, source: 'S70', labelType: 'US label', note: '4 days up to 5 mL per site; 6 days for 5 to 15 mL per site (the longer figure is used)' },
  { name: 'Ceftiofur crystalline free acid (Excede for Swine, Zoetis)', route: 'IM, single dose', days: 14, source: 'S74', labelType: 'US label' },
  { name: 'Tulathromycin (Draxxin 25, Zoetis)', route: 'IM', days: 5, source: 'S71', labelType: 'US label' },
  { name: 'Florfenicol (Nuflor-S, Merck)', route: 'IM', days: 11, source: 'S73', labelType: 'US label' },
  { name: 'Ivermectin 1% injectable (GenVet Ivermec, Univet)', route: 'SC/IM, 1 mL per 33 kg', days: 28, source: 'S43', labelType: 'PH label' },
  { name: 'Ivermectin injectable (Ivomec, US)', route: 'SC', days: 18, source: 'S55', labelType: 'extension' },
  { name: 'Ivermectin premix (US)', route: 'feed', days: 5, source: 'S55', labelType: 'extension' },
  { name: 'Doramectin (Dectomax, US)', route: 'IM', days: 24, source: 'S55', labelType: 'extension' },
  { name: 'Levamisole (Latigo, Univet)', route: 'oral, water or feed', days: 30, source: 'S49', labelType: 'PH label' },
  { name: 'Levamisole (US water-soluble)', route: 'drinking water', days: 3, source: 'S55', labelType: 'extension' },
  { name: 'Fenbendazole (Safe-Guard swine, US)', route: 'feed, 3 days', days: 0, source: 'S55', labelType: 'extension' },
  { name: 'Pyrantel (Banminth premix, US)', route: 'feed', days: 1, source: 'S55', labelType: 'extension' },
  { name: 'Permethrin sprays (US)', route: 'topical', days: 5, source: 'S55', labelType: 'extension' },
  { name: 'Albendazole 11.25% (GenVet Alzen, Univet)', route: 'oral', days: null, source: 'S49', labelType: 'PH label', note: 'no swine figure on the label (7 to 10 sheep/goat; 27 cattle/carabao)' },
  { name: 'Vaccines (general)', route: 'IM/SC', days: 21, source: 'S55', labelType: 'extension', note: 'PH CSF label pages state none' },
  { name: 'Iron dextran (GenVet ID 100, Jectran Premium)', route: 'IM', days: null, source: 'S50, S51', labelType: 'PH label', note: 'not stated on the label page' },
]

export const findProduct = (name: string) => WITHDRAWAL_PRODUCTS.find((p) => p.name === name)

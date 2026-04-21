// Dummy data for Making Art DIY

const PRODUCTS = [
  { sku: 'MAD-VASE-001', name_da: '3D-printet vase', name_en: '3D-printed vase', price: 249, category: 'voksne', files: 3, sold: 12, visible: true, thumb: 'gold', desc_da: 'Håndlavet 3D-printet vase i PLA, let og elegant.', desc_en: 'Handmade 3D-printed vase in PLA, light and elegant.' },
  { sku: 'MAD-FIDG-001', name_da: 'Fidget-tastatur', name_en: 'Fidget keyboard', price: 189, category: 'born', files: 5, sold: 8, visible: true, thumb: 'blue', desc_da: 'Taktilt legetøj til fingrene, perfekt til fokus.', desc_en: 'Tactile toy for fingers, perfect for focus.' },
  { sku: 'MAD-PLAN-001', name_da: 'Plantekasse i fyrretræ', name_en: 'Pine planter box', price: 750, category: 'voksne', files: 7, sold: 3, visible: true, thumb: 'wood', desc_da: 'Robust plantekasse i ubehandlet fyrretræ.', desc_en: 'Robust planter box in untreated pine.' },
  { sku: 'MAD-LAMP-002', name_da: 'Skrivebordslampe "Egern"', name_en: 'Desk lamp "Squirrel"', price: 495, category: 'voksne', files: 6, sold: 19, visible: true, thumb: 'gold', desc_da: 'Justerbar lampe i printet PLA og ege-fod.', desc_en: 'Adjustable lamp in printed PLA with oak base.' },
  { sku: 'MAD-PUZZL-003', name_da: 'Træpuslespil, 24 brikker', name_en: 'Wood puzzle, 24 pcs', price: 219, category: 'born', files: 4, sold: 27, visible: true, thumb: 'wood', desc_da: 'Laser-skåret trælabyrint til børn 4+.', desc_en: 'Laser-cut wood maze for kids 4+.' },
  { sku: 'MAD-SHELF-004', name_da: 'Reol-modul "Korn"', name_en: 'Shelf module "Grain"', price: 1290, category: 'erhverv', files: 9, sold: 5, visible: true, thumb: 'wood', desc_da: 'Stabelbar reol-modul, 40×40×40 cm.', desc_en: 'Stackable shelf module, 40×40×40 cm.' },
  { sku: 'MAD-HOOK-005', name_da: 'Knage-sæt (4 stk)', name_en: 'Hook set (4 pcs)', price: 129, category: 'voksne', files: 2, sold: 44, visible: true, thumb: 'gold', desc_da: 'Minimalistiske knager i printet bio-PLA.', desc_en: 'Minimalist hooks in printed bio-PLA.' },
  { sku: 'MAD-TOY-006', name_da: 'Balancedyr (giraf)', name_en: 'Balance animal (giraffe)', price: 169, category: 'born', files: 3, sold: 33, visible: true, thumb: 'blue', desc_da: 'Motorikleg i massivt bøg.', desc_en: 'Motor skill toy in solid beech.' },
  { sku: 'MAD-SIGN-007', name_da: 'Butiksskilt, custom', name_en: 'Shop sign, custom', price: 2490, category: 'erhverv', files: 12, sold: 2, visible: false, thumb: 'purple', desc_da: 'Tilpasset butiksskilt i træ og metal.', desc_en: 'Custom shop sign in wood and metal.' },
  { sku: 'MAD-BOX-008', name_da: 'Opbevaringsboks, stor', name_en: 'Storage box, large', price: 385, category: 'voksne', files: 5, sold: 11, visible: true, thumb: 'wood', desc_da: 'Stor træboks med låg.', desc_en: 'Large wooden box with lid.' },
  { sku: 'MAD-CLOCK-009', name_da: 'Vægur "Årringe"', name_en: 'Wall clock "Rings"', price: 549, category: 'voksne', files: 4, sold: 7, visible: true, thumb: 'gold', desc_da: 'Ur af skiver fra danske ege.', desc_en: 'Clock made of Danish oak slices.' },
  { sku: 'MAD-GAME-010', name_da: 'Strategispil "Fjord"', name_en: 'Strategy game "Fjord"', price: 399, category: 'born', files: 8, sold: 15, visible: true, thumb: 'blue', desc_da: 'Brætspil fra 8 år og op.', desc_en: 'Board game from 8 years and up.' },
];

// payment: cc | mobilepay | bank | cash | barter | free
// status:  new | production | ready | shipped | delivered | cancelled | refunded
// fragt:   none | qr_pending | dropped_off | in_transit | delivered
const ORDERS = [
  {
    no: '#MAD-2026-0284', date: '2026-04-21 14:32', customer: 'Anna Hansen', city: 'København', email: 'anna.hansen@mail.dk',
    items: [{ sku: 'MAD-VASE-001', name_da: '3D-printet vase', name_en: '3D-printed vase', qty: 1, price: 249, thumb: 'gold' },
            { sku: 'MAD-HOOK-005', name_da: 'Knage-sæt (4 stk)', name_en: 'Hook set (4 pcs)', qty: 1, price: 129, thumb: 'gold' }],
    subtotal: 378, shipping: 60, amount: 438, status: 'new', payment: 'cc', manual: false,
    fragt_status: 'qr_pending', fragt_method: 'GLS Pakkeshop', tracking: null,
    stripe_id: 'ch_3NqK2vFjT9p2D4aA',
    timeline: [{ status: 'created', ts: '2026-04-21 14:32' }, { status: 'paid', ts: '2026-04-21 14:32' }],
    notes: [],
  },
  {
    no: '#MAD-2026-0283', date: '2026-04-21 11:18', customer: 'Lars Petersen', city: 'Aarhus', email: 'lars@petersen.dk',
    items: [{ sku: 'MAD-PLAN-001', name_da: 'Plantekasse i fyrretræ', name_en: 'Pine planter box', qty: 1, price: 750, thumb: 'wood' }],
    subtotal: 750, shipping: 0, amount: 750, status: 'production', payment: 'cc', manual: false,
    fragt_status: 'qr_pending', fragt_method: 'DAO Hjemmelevering', tracking: null,
    stripe_id: 'ch_3NqJ8xFjT9p2D4aA',
    timeline: [{ status: 'created', ts: '2026-04-21 11:18' }, { status: 'paid', ts: '2026-04-21 11:18' }, { status: 'production', ts: '2026-04-21 13:40' }],
    notes: [{ ts: '2026-04-21 13:45', text_da: 'Træ bestilt hos Silvan, hentes i morgen', text_en: 'Wood ordered from Silvan, pickup tomorrow' }],
  },
  {
    no: '#MAD-2026-0282', date: '2026-04-20 16:44', customer: 'Sofie Jensen', city: 'Odense', email: 'sofie.jensen@gmail.com',
    items: [{ sku: 'MAD-TOY-006', name_da: 'Balancedyr (giraf)', name_en: 'Balance animal (giraffe)', qty: 2, price: 169, thumb: 'blue' },
            { sku: 'MAD-PUZZL-003', name_da: 'Træpuslespil, 24 brikker', name_en: 'Wood puzzle, 24 pcs', qty: 1, price: 219, thumb: 'wood' },
            { sku: 'MAD-GAME-010', name_da: 'Strategispil "Fjord"', name_en: 'Strategy game "Fjord"', qty: 1, price: 399, thumb: 'blue' }],
    subtotal: 956, shipping: 60, amount: 1016, status: 'shipped', payment: 'cc', manual: false,
    fragt_status: 'in_transit', fragt_method: 'GLS Pakkeshop', tracking: 'GLS-78420193-DK',
    stripe_id: 'ch_3NqI1zFjT9p2D4aA',
    timeline: [{ status: 'created', ts: '2026-04-20 16:44' }, { status: 'paid', ts: '2026-04-20 16:44' }, { status: 'production', ts: '2026-04-20 17:20' }, { status: 'ready', ts: '2026-04-21 10:02' }, { status: 'shipped', ts: '2026-04-21 11:45' }],
    notes: [],
  },
  {
    no: '#MAD-2026-0281', date: '2026-04-20 09:12', customer: 'Mikkel Nielsen', city: 'Aalborg', email: 'mikkel@nielsen.io',
    items: [{ sku: 'MAD-VASE-001', name_da: '3D-printet vase', name_en: '3D-printed vase', qty: 1, price: 249, thumb: 'gold' }],
    subtotal: 249, shipping: 0, amount: 249, status: 'delivered', payment: 'cc', manual: false,
    fragt_status: 'delivered', fragt_method: 'Afhentning i værkstedet', tracking: null,
    stripe_id: 'ch_3NqH5yFjT9p2D4aA',
    timeline: [{ status: 'created', ts: '2026-04-20 09:12' }, { status: 'paid', ts: '2026-04-20 09:12' }, { status: 'production', ts: '2026-04-20 10:00' }, { status: 'ready', ts: '2026-04-20 14:30' }, { status: 'delivered', ts: '2026-04-21 11:00' }],
    notes: [{ ts: '2026-04-21 11:00', text_da: 'Afhentet i værkstedet', text_en: 'Picked up at workshop' }],
  },
  // MANUAL ORDERS below
  {
    no: '#MAD-2026-M021', date: '2026-04-19 15:30', customer: 'Ida Kristensen', city: 'Esbjerg', email: 'ida.kristensen@outlook.com',
    items: [{ sku: 'MAD-LAMP-002', name_da: 'Skrivebordslampe "Egern"', name_en: 'Desk lamp "Squirrel"', qty: 1, price: 495, thumb: 'gold' },
            { sku: 'MAD-HOOK-005', name_da: 'Knage-sæt (4 stk)', name_en: 'Hook set (4 pcs)', qty: 2, price: 129, thumb: 'gold' }],
    subtotal: 753, shipping: 60, amount: 813, status: 'ready', payment: 'mobilepay', manual: true,
    fragt_status: 'qr_pending', fragt_method: 'GLS Pakkeshop', tracking: null,
    stripe_id: null,
    timeline: [{ status: 'created', ts: '2026-04-19 15:30' }, { status: 'paid', ts: '2026-04-19 15:32' }, { status: 'production', ts: '2026-04-19 16:00' }, { status: 'ready', ts: '2026-04-20 14:00' }],
    notes: [{ ts: '2026-04-19 15:30', text_da: 'Betalt via MobilePay før ordre oprettes', text_en: 'Paid via MobilePay before order created' }],
  },
  {
    no: '#MAD-2026-M020', date: '2026-04-18 12:00', customer: 'Frederik Holm', city: 'Randers', email: 'fholm@mail.dk',
    items: [{ sku: 'MAD-CLOCK-009', name_da: 'Vægur "Årringe"', name_en: 'Wall clock "Rings"', qty: 1, price: 549, thumb: 'gold' }],
    subtotal: 549, shipping: 0, amount: 549, status: 'shipped', payment: 'bank', manual: true,
    fragt_status: 'delivered', fragt_method: 'Selvleveret', tracking: null,
    stripe_id: null,
    timeline: [{ status: 'created', ts: '2026-04-18 12:00' }, { status: 'paid', ts: '2026-04-18 14:22' }, { status: 'production', ts: '2026-04-18 15:00' }, { status: 'ready', ts: '2026-04-19 10:00' }, { status: 'shipped', ts: '2026-04-19 18:00' }],
    notes: [{ ts: '2026-04-18 14:22', text_da: 'Bankoverførsel modtaget. Afleveres personligt lørdag.', text_en: 'Bank transfer received. Hand-delivered Saturday.' }],
  },
  {
    no: '#MAD-2026-M019', date: '2026-04-15 10:20', customer: 'Min far', city: 'Horsens', email: '',
    items: [{ sku: 'MAD-PUZZL-003', name_da: 'Træpuslespil, 24 brikker', name_en: 'Wood puzzle, 24 pcs', qty: 1, price: 0, thumb: 'wood' }],
    subtotal: 0, shipping: 0, amount: 0, status: 'delivered', payment: 'free', manual: true,
    fragt_status: 'delivered', fragt_method: 'Selvleveret', tracking: null,
    stripe_id: null,
    timeline: [{ status: 'created', ts: '2026-04-15 10:20' }, { status: 'paid', ts: '2026-04-15 10:20' }, { status: 'delivered', ts: '2026-04-15 18:00' }],
    notes: [{ ts: '2026-04-15 10:20', text_da: 'Gave til fars fødselsdag', text_en: 'Gift for dad\'s birthday' }],
  },
  {
    no: '#MAD-2026-0280', date: '2026-04-19 08:44', customer: 'Clara Andersen', city: 'Kolding', email: 'clara.a@gmail.com',
    items: [{ sku: 'MAD-LAMP-002', name_da: 'Skrivebordslampe "Egern"', name_en: 'Desk lamp "Squirrel"', qty: 1, price: 495, thumb: 'gold' }],
    subtotal: 495, shipping: 60, amount: 555, status: 'production', payment: 'cc', manual: false,
    fragt_status: 'none', fragt_method: 'GLS Pakkeshop', tracking: null,
    stripe_id: 'ch_3NqG2wFjT9p2D4aA',
    timeline: [{ status: 'created', ts: '2026-04-19 08:44' }, { status: 'paid', ts: '2026-04-19 08:44' }, { status: 'production', ts: '2026-04-19 10:15' }],
    notes: [],
  },
  {
    no: '#MAD-2026-0279', date: '2026-04-18 14:22', customer: 'Emil Sørensen', city: 'Horsens', email: 'emil@sorensen.dk',
    items: [{ sku: 'MAD-SHELF-004', name_da: 'Reol-modul "Korn"', name_en: 'Shelf module "Grain"', qty: 1, price: 1290, thumb: 'wood' }],
    subtotal: 1290, shipping: 120, amount: 1410, status: 'shipped', payment: 'cc', manual: false,
    fragt_status: 'in_transit', fragt_method: 'Bring Erhverv', tracking: 'BRI-22018847-DK',
    stripe_id: 'ch_3NqF9xFjT9p2D4aA',
    timeline: [{ status: 'created', ts: '2026-04-18 14:22' }, { status: 'paid', ts: '2026-04-18 14:22' }, { status: 'production', ts: '2026-04-18 16:00' }, { status: 'ready', ts: '2026-04-19 12:00' }, { status: 'shipped', ts: '2026-04-19 15:30' }],
    notes: [{ ts: '2026-04-18 16:10', text_da: 'Erhvervskunde — fakturering via EAN', text_en: 'Business customer — invoicing via EAN' }],
  },
  {
    no: '#MAD-2026-M018', date: '2026-04-14 11:00', customer: 'Byttekunde: Astrid', city: 'Herning', email: 'astrid@mortensen.dk',
    items: [{ sku: 'MAD-BOX-008', name_da: 'Opbevaringsboks, stor', name_en: 'Storage box, large', qty: 1, price: 0, thumb: 'wood' }],
    subtotal: 0, shipping: 0, amount: 0, status: 'delivered', payment: 'barter', manual: true,
    fragt_status: 'delivered', fragt_method: 'Afhentning i værkstedet', tracking: null,
    stripe_id: null,
    timeline: [{ status: 'created', ts: '2026-04-14 11:00' }, { status: 'paid', ts: '2026-04-14 11:00' }, { status: 'delivered', ts: '2026-04-14 17:30' }],
    notes: [{ ts: '2026-04-14 11:00', text_da: 'Byttet for en flaske vin fra hendes vingård', text_en: 'Bartered for a bottle of wine from her vineyard' }],
  },
  {
    no: '#MAD-2026-0278', date: '2026-04-17 13:10', customer: 'Laura Madsen', city: 'Vejle', email: 'laura.m@mail.dk',
    items: [{ sku: 'MAD-FIDG-001', name_da: 'Fidget-tastatur', name_en: 'Fidget keyboard', qty: 1, price: 189, thumb: 'blue' }],
    subtotal: 189, shipping: 60, amount: 249, status: 'cancelled', payment: 'cc', manual: false,
    fragt_status: 'none', fragt_method: 'GLS Pakkeshop', tracking: null,
    stripe_id: 'ch_3NqE2xFjT9p2D4aA',
    timeline: [{ status: 'created', ts: '2026-04-17 13:10' }, { status: 'paid', ts: '2026-04-17 13:10' }, { status: 'cancelled', ts: '2026-04-17 15:00' }],
    notes: [{ ts: '2026-04-17 15:00', text_da: 'Kunde fortrød, refunderet via Stripe', text_en: 'Customer cancelled, refunded via Stripe' }],
  },
  {
    no: '#MAD-2026-0277', date: '2026-04-16 09:30', customer: 'Oliver Rasmussen', city: 'Roskilde', email: 'oliver@rasmussen.dk',
    items: [{ sku: 'MAD-HOOK-005', name_da: 'Knage-sæt (4 stk)', name_en: 'Hook set (4 pcs)', qty: 3, price: 129, thumb: 'gold' }],
    subtotal: 387, shipping: 60, amount: 447, status: 'delivered', payment: 'cc', manual: false,
    fragt_status: 'delivered', fragt_method: 'GLS Pakkeshop', tracking: 'GLS-78418811-DK',
    stripe_id: 'ch_3NqD9yFjT9p2D4aA',
    timeline: [{ status: 'created', ts: '2026-04-16 09:30' }, { status: 'paid', ts: '2026-04-16 09:30' }, { status: 'production', ts: '2026-04-16 10:00' }, { status: 'ready', ts: '2026-04-16 15:30' }, { status: 'shipped', ts: '2026-04-17 11:00' }, { status: 'delivered', ts: '2026-04-18 14:20' }],
    notes: [],
  },
];

const CUSTOMERS = [
  { name: 'Anna Hansen', email: 'anna.hansen@mail.dk', phone: '+45 28 14 92 03', city: 'København', orders: 7, spent: 3248, newsletter: true, address: 'Vesterbrogade 42, 3.th, 1620 København V', notes: 'Stamkunde siden 2024. Foretrækker fragt med DAO.' },
  { name: 'Lars Petersen', email: 'lars@petersen.dk', phone: '+45 40 55 28 17', city: 'Aarhus', orders: 4, spent: 1890, newsletter: true, address: 'Skanderborgvej 118, 8260 Viby J', notes: '' },
  { name: 'Sofie Jensen', email: 'sofie.jensen@gmail.com', phone: '+45 22 78 91 34', city: 'Odense', orders: 12, spent: 5620, newsletter: true, address: 'Hunderupvej 88, 5000 Odense C', notes: 'Kontakt via SMS.' },
  { name: 'Mikkel Nielsen', email: 'mikkel@nielsen.io', phone: '+45 31 44 67 82', city: 'Aalborg', orders: 2, spent: 498, newsletter: false, address: 'Hobrovej 12, 9000 Aalborg', notes: '' },
  { name: 'Ida Kristensen', email: 'ida.kristensen@outlook.com', phone: '+45 26 33 18 55', city: 'Esbjerg', orders: 9, spent: 4122, newsletter: true, address: 'Strandbygade 5, 6700 Esbjerg', notes: 'Har bedt om ekstra beskyttelse af fragile varer.' },
  { name: 'Frederik Holm', email: 'fholm@mail.dk', phone: '+45 29 88 43 21', city: 'Randers', orders: 3, spent: 1284, newsletter: true, address: 'Østervold 20, 8900 Randers C', notes: '' },
  { name: 'Clara Andersen', email: 'clara.a@gmail.com', phone: '+45 52 17 09 63', city: 'Kolding', orders: 5, spent: 2310, newsletter: false, address: 'Bredgade 37, 6000 Kolding', notes: '' },
  { name: 'Emil Sørensen', email: 'emil@sorensen.dk', phone: '+45 61 42 85 19', city: 'Horsens', orders: 11, spent: 6890, newsletter: true, address: 'Søndergade 14, 8700 Horsens', notes: 'Erhvervskunde — fakturering via EAN.' },
  { name: 'Laura Madsen', email: 'laura.m@mail.dk', phone: '+45 27 91 35 48', city: 'Vejle', orders: 2, spent: 608, newsletter: true, address: 'Dæmningen 42, 7100 Vejle', notes: '' },
  { name: 'Oliver Rasmussen', email: 'oliver@rasmussen.dk', phone: '+45 30 56 22 14', city: 'Roskilde', orders: 6, spent: 1945, newsletter: true, address: 'Algade 8, 4000 Roskilde', notes: '' },
  { name: 'Astrid Mortensen', email: 'astrid@mortensen.dk', phone: '+45 24 73 91 02', city: 'Herning', orders: 1, spent: 2490, newsletter: false, address: 'Bredgade 5, 7400 Herning', notes: 'Nyhedsmail afvist jf. GDPR.' },
  { name: 'Magnus Olsen', email: 'magnus@olsen.dk', phone: '+45 53 21 48 77', city: 'Silkeborg', orders: 3, spent: 872, newsletter: true, address: 'Hostrupsgade 22, 8600 Silkeborg', notes: '' },
];

const SALES_6M = [
  { month_da: 'Nov', month_en: 'Nov', value: 18 },
  { month_da: 'Dec', month_en: 'Dec', value: 22 },
  { month_da: 'Jan', month_en: 'Jan', value: 28 },
  { month_da: 'Feb', month_en: 'Feb', value: 34 },
  { month_da: 'Mar', month_en: 'Mar', value: 41 },
  { month_da: 'Apr', month_en: 'Apr', value: 47 },
];

const SALES_12M = [
  { m_da: 'Maj', m_en: 'May', value: 4200 },
  { m_da: 'Jun', m_en: 'Jun', value: 5100 },
  { m_da: 'Jul', m_en: 'Jul', value: 3800 },
  { m_da: 'Aug', m_en: 'Aug', value: 4600 },
  { m_da: 'Sep', m_en: 'Sep', value: 5400 },
  { m_da: 'Okt', m_en: 'Oct', value: 6200 },
  { m_da: 'Nov', m_en: 'Nov', value: 5800 },
  { m_da: 'Dec', m_en: 'Dec', value: 7900 },
  { m_da: 'Jan', m_en: 'Jan', value: 6400 },
  { m_da: 'Feb', m_en: 'Feb', value: 7100 },
  { m_da: 'Mar', m_en: 'Mar', value: 7800 },
  { m_da: 'Apr', m_en: 'Apr', value: 8420 },
];

// Manual orders split by payment method per month (stacked bar source)
const MANUAL_ORDERS_12M = [
  { m_da: 'Maj', m_en: 'May', mobilepay: 2, bank: 1, cash: 0, barter: 0, free: 1 },
  { m_da: 'Jun', m_en: 'Jun', mobilepay: 3, bank: 0, cash: 1, barter: 1, free: 1 },
  { m_da: 'Jul', m_en: 'Jul', mobilepay: 1, bank: 1, cash: 0, barter: 0, free: 0 },
  { m_da: 'Aug', m_en: 'Aug', mobilepay: 2, bank: 2, cash: 1, barter: 0, free: 2 },
  { m_da: 'Sep', m_en: 'Sep', mobilepay: 4, bank: 1, cash: 0, barter: 1, free: 1 },
  { m_da: 'Okt', m_en: 'Oct', mobilepay: 3, bank: 2, cash: 1, barter: 0, free: 2 },
  { m_da: 'Nov', m_en: 'Nov', mobilepay: 2, bank: 1, cash: 2, barter: 1, free: 1 },
  { m_da: 'Dec', m_en: 'Dec', mobilepay: 5, bank: 3, cash: 1, barter: 2, free: 4 },
  { m_da: 'Jan', m_en: 'Jan', mobilepay: 3, bank: 1, cash: 0, barter: 0, free: 1 },
  { m_da: 'Feb', m_en: 'Feb', mobilepay: 4, bank: 2, cash: 1, barter: 1, free: 1 },
  { m_da: 'Mar', m_en: 'Mar', mobilepay: 3, bank: 1, cash: 0, barter: 0, free: 2 },
  { m_da: 'Apr', m_en: 'Apr', mobilepay: 3, bank: 1, cash: 0, barter: 1, free: 2 },
];

const NEW_CUSTOMERS_12M = [
  { m_da: 'Maj', m_en: 'May', value: 8 }, { m_da: 'Jun', m_en: 'Jun', value: 11 },
  { m_da: 'Jul', m_en: 'Jul', value: 6 }, { m_da: 'Aug', m_en: 'Aug', value: 9 },
  { m_da: 'Sep', m_en: 'Sep', value: 14 }, { m_da: 'Okt', m_en: 'Oct', value: 17 },
  { m_da: 'Nov', m_en: 'Nov', value: 12 }, { m_da: 'Dec', m_en: 'Dec', value: 21 },
  { m_da: 'Jan', m_en: 'Jan', value: 16 }, { m_da: 'Feb', m_en: 'Feb', value: 19 },
  { m_da: 'Mar', m_en: 'Mar', value: 22 }, { m_da: 'Apr', m_en: 'Apr', value: 18 },
];

const NEWSLETTERS = [
  { subject_da: 'Forårsnyheder — nye plantekasser og havelamper', subject_en: 'Spring news — new planters and garden lamps', sent: '2026-04-14', recipients: 287, opened: 168, clicked: 54 },
  { subject_da: 'Påsketilbud: 15% på alle børnevarer', subject_en: 'Easter offer: 15% on all kids items', sent: '2026-03-22', recipients: 281, opened: 192, clicked: 78 },
  { subject_da: 'Håndværker-nyt: byggemanual til reolsystemet', subject_en: 'Maker news: build guide for the shelf system', sent: '2026-03-08', recipients: 274, opened: 151, clicked: 42 },
  { subject_da: 'Nyt år, nye printe — 2026-kataloget er her', subject_en: 'New year, new prints — the 2026 catalog is here', sent: '2026-01-14', recipients: 268, opened: 201, clicked: 88 },
  { subject_da: 'Sidste chance før jul — bestil senest søndag', subject_en: 'Last chance before Christmas — order by Sunday', sent: '2025-12-15', recipients: 254, opened: 210, clicked: 93 },
];

const INTERNAL_FILES = [
  { name: 'vase_v3_final.stl', label_da: '3D-model', label_en: '3D model', size: '4.2 MB' },
  { name: 'byggemanual.pdf', label_da: 'Byggemanual', label_en: 'Build guide', size: '1.8 MB' },
  { name: 'materialeliste.pdf', label_da: 'Materialeliste', label_en: 'Materials list', size: '220 KB' },
];

window.MAD_DATA = { PRODUCTS, ORDERS, CUSTOMERS, SALES_6M, SALES_12M, MANUAL_ORDERS_12M, NEW_CUSTOMERS_12M, NEWSLETTERS, INTERNAL_FILES };

// ===== Extended data =====
const REFUNDS = [
  { id: 'R-2041', order: '#MAD-2026-0278', customer: 'Laura Madsen', date: '2026-04-17', amount: 249, reason_da: 'Kunde fortrød køb', reason_en: 'Customer cancelled', status: 'approved' },
  { id: 'R-2040', order: '#MAD-2026-0271', customer: 'Sofie Jensen', date: '2026-04-14', amount: 189, reason_da: 'Defekt ved levering', reason_en: 'Damaged on arrival', status: 'pending' },
  { id: 'R-2039', order: '#MAD-2026-0268', customer: 'Mikkel Nielsen', date: '2026-04-12', amount: 495, reason_da: 'Forkert størrelse', reason_en: 'Wrong size', status: 'approved' },
  { id: 'R-2038', order: '#MAD-2026-0265', customer: 'Astrid Mortensen', date: '2026-04-08', amount: 2490, reason_da: 'Sent levering — annullering', reason_en: 'Late delivery — cancellation', status: 'pending' },
  { id: 'R-2037', order: '#MAD-2026-0259', customer: 'Oliver Rasmussen', date: '2026-04-02', amount: 129, reason_da: 'Ikke som beskrevet', reason_en: 'Not as described', status: 'rejected' },
  { id: 'R-2036', order: '#MAD-2026-0254', customer: 'Ida Kristensen', date: '2026-03-28', amount: 549, reason_da: 'Defekt ved levering', reason_en: 'Damaged on arrival', status: 'approved' },
];

const DISCOUNTS = [
  { code: 'PASKE25', type: 'percent', value: 25, used: 47, max: 200, from: '2026-03-20', to: '2026-04-06', status: 'expired', applies: 'all' },
  { code: 'FORAAR15', type: 'percent', value: 15, used: 18, max: 100, from: '2026-04-01', to: '2026-05-31', status: 'active', applies: 'all' },
  { code: 'NYKUNDE50', type: 'fixed', value: 50, used: 92, max: 500, from: '2026-01-01', to: '2026-12-31', status: 'active', applies: 'all' },
  { code: 'BORN20', type: 'percent', value: 20, used: 24, max: 150, from: '2026-04-01', to: '2026-06-30', status: 'active', applies: 'cat' },
  { code: 'ERHVERV10', type: 'percent', value: 10, used: 5, max: 50, from: '2026-04-15', to: '2026-07-15', status: 'active', applies: 'cat' },
  { code: 'SOMMER30', type: 'percent', value: 30, used: 0, max: 300, from: '2026-06-01', to: '2026-06-30', status: 'scheduled', applies: 'all' },
];

const EMAIL_TEMPLATES = [
  { id: 'order_confirm_cc', trigger_da: 'Når kunde betaler ordre (kreditkort)', trigger_en: 'When customer pays for order (credit card)', subject_da: 'Tak for din ordre {{ordre}}', subject_en: 'Thanks for your order {{order}}', cc_only: true },
  { id: 'shipping', trigger_da: 'Når ordre afsendes', trigger_en: 'When order ships', subject_da: 'Din ordre er på vej', subject_en: 'Your order is on the way' },
  { id: 'fragt_qr', trigger_da: 'Når Malik markerer ordren som afsendt', trigger_en: 'When the order is marked as shipped', subject_da: 'Din pakke er på vej', subject_en: 'Your parcel is on its way', new: true },
  { id: 'delivered', trigger_da: 'Når ordre markeres leveret', trigger_en: 'When order is marked delivered', subject_da: 'Din ordre er ankommet', subject_en: 'Your order has arrived' },
  { id: 'newsletter', trigger_da: 'Manuel udsendelse', trigger_en: 'Manual send', subject_da: '{{emne}}', subject_en: '{{subject}}' },
  { id: 'welcome', trigger_da: 'Ved nyhedsbrev-tilmelding', trigger_en: 'On newsletter signup', subject_da: 'Velkommen til Making Art DIY', subject_en: 'Welcome to Making Art DIY' },
];

const INTEGRATIONS = [
  { id: 'stripe', name: 'Stripe', desc_da: 'Betalinger', desc_en: 'Payments', status: 'connected', lines: [{ k_da: 'Sidste transaktion', k_en: 'Last transaction', v: '8 min. siden · 249 kr' }, { k_da: 'Denne måned', k_en: 'This month', v: '47 transaktioner' }] },
  { id: 'shipmondo', name: 'Shipmondo', desc_da: 'Fragt og labels', desc_en: 'Shipping and labels', status: 'connected', lines: [{ k_da: 'Pakker denne måned', k_en: 'Parcels this month', v: '38' }, { k_da: 'Fejlede labels', k_en: 'Failed labels', v: '0' }] },
  { id: 'resend', name: 'Resend', desc_da: 'Email-levering', desc_en: 'Email delivery', status: 'connected', lines: [{ k_da: 'Mails denne måned', k_en: 'Emails this month', v: '1.284' }, { k_da: 'Bounce-rate', k_en: 'Bounce rate', v: '0.6%' }] },
  { id: 'netlify', name: 'Netlify', desc_da: 'Hosting', desc_en: 'Hosting', status: 'degraded', lines: [{ k_da: 'Sidste deploy', k_en: 'Last deploy', v: 'i går, 16:42' }, { k_da: 'Build-tid', k_en: 'Build time', v: '42s' }] },
  { id: 'mobilepay', name: 'MobilePay', desc_da: 'Manuel registrering', desc_en: 'Manual registration', status: 'connected', lines: [{ k_da: 'Denne måned', k_en: 'This month', v: '3 ordrer' }, { k_da: 'Samlet beløb', k_en: 'Total', v: '1.240 kr' }] },
  { id: 'postnord', name: 'PostNord', desc_da: 'Tracking-lookup', desc_en: 'Tracking lookup', status: 'disconnected', lines: [{ k_da: 'Status', k_en: 'Status', v: 'Ikke forbundet' }] },
];

const ACTIVITY = [
  { when_da: '2 min. siden', when_en: '2 min ago', who: 'Anna Hansen', type: 'order', text_da: 'bestilte 2 varer (#MAD-2026-0284)', text_en: 'placed an order of 2 items (#MAD-2026-0284)' },
  { when_da: '1 t. siden', when_en: '1 h ago', who: 'Du', type: 'product', text_da: 'opdaterede 3D-printet vase', text_en: 'updated 3D-printed vase' },
  { when_da: '3 t. siden', when_en: '3 h ago', who: 'Lars Petersen', type: 'newsletter', text_da: 'tilmeldte sig nyhedsbrevet', text_en: 'subscribed to the newsletter' },
  { when_da: '5 t. siden', when_en: '5 h ago', who: 'Du', type: 'discount', text_da: 'oprettede rabatkoden FORAAR15', text_en: 'created discount code FORAAR15' },
  { when_da: 'i går, 17:48', when_en: 'yesterday, 17:48', who: 'Sofie Jensen', type: 'order', text_da: 'bestilte 3 varer (#MAD-2026-0282)', text_en: 'placed an order of 3 items (#MAD-2026-0282)' },
  { when_da: 'i går, 14:12', when_en: 'yesterday, 14:12', who: 'Du', type: 'settings', text_da: 'ændrede fragtpris til GLS', text_en: 'changed shipping price for GLS' },
  { when_da: 'i går, 09:04', when_en: 'yesterday, 09:04', who: 'System', type: 'login', text_da: 'du loggede ind fra Aarhus', text_en: 'you logged in from Aarhus' },
];

const ACTIVITY_LOG = [
  ...ACTIVITY,
  { when_da: 'i forgårs, 22:11', when_en: '2 days ago, 22:11', who: 'Du', type: 'product', text_da: 'oprettede produkt "Vægur Årringe"', text_en: 'created product "Wall clock Rings"' },
  { when_da: 'i forgårs, 15:32', when_en: '2 days ago, 15:32', who: 'Emil Sørensen', type: 'order', text_da: 'bestilte 5 varer (#MAD-2026-0277)', text_en: 'placed an order of 5 items (#MAD-2026-0277)' },
  { when_da: 'i forgårs, 11:02', when_en: '2 days ago, 11:02', who: 'Du', type: 'customer', text_da: 'slettede kunde efter GDPR-anmodning', text_en: 'deleted customer after GDPR request' },
  { when_da: '3 dage siden', when_en: '3 days ago', who: 'Du', type: 'product', text_da: 'ændrede pris på Fidget-tastatur fra 219 til 189 kr', text_en: 'changed price on Fidget keyboard from 219 to 189 kr' },
  { when_da: '4 dage siden', when_en: '4 days ago', who: 'Du', type: 'settings', text_da: 'opdaterede CVR i butiksindstillinger', text_en: 'updated VAT number in store settings' },
];

const NOTIFICATIONS = [
  { when_da: '2 min. siden', when_en: '2 min ago', title_da: 'Ny ordre fra Anna Hansen', title_en: 'New order from Anna Hansen', sub_da: '2 varer · 438 kr', sub_en: '2 items · 438 DKK', kind: 'order', unread: true },
  { when_da: '18 min. siden', when_en: '18 min ago', title_da: 'Betaling fejlede', title_en: 'Payment failed', sub_da: 'Ordre #MAD-2026-0285 · prøv igen', sub_en: 'Order #MAD-2026-0285 · retry', kind: 'warn', unread: true },
  { when_da: '1 t. siden', when_en: '1 h ago', title_da: 'Omsætning 12% under sidste måned', title_en: 'Revenue 12% below last month', sub_da: 'Se forslag i statistik', sub_en: 'See suggestions in stats', kind: 'info', unread: true },
  { when_da: '3 t. siden', when_en: '3 h ago', title_da: 'Lars Petersen tilmeldte sig', title_en: 'Lars Petersen subscribed', sub_da: 'Nyhedsbrev', sub_en: 'Newsletter', kind: 'customer', unread: false },
  { when_da: '5 t. siden', when_en: '5 h ago', title_da: 'FORAAR15 blev brugt 5 gange', title_en: 'FORAAR15 used 5 times', sub_da: 'I dag', sub_en: 'Today', kind: 'info', unread: false },
];

const DK_CITIES = [
  { name: 'København', x: 84, y: 58, orders: 18 }, { name: 'Aarhus', x: 54, y: 42, orders: 12 },
  { name: 'Odense', x: 62, y: 66, orders: 9 }, { name: 'Aalborg', x: 52, y: 20, orders: 6 },
  { name: 'Esbjerg', x: 32, y: 62, orders: 5 }, { name: 'Kolding', x: 44, y: 68, orders: 4 },
  { name: 'Vejle', x: 44, y: 58, orders: 3 }, { name: 'Randers', x: 54, y: 32, orders: 3 },
  { name: 'Horsens', x: 48, y: 52, orders: 3 }, { name: 'Silkeborg', x: 46, y: 42, orders: 2 },
  { name: 'Roskilde', x: 78, y: 58, orders: 4 }, { name: 'Herning', x: 36, y: 44, orders: 2 },
];

Object.assign(window.MAD_DATA, { REFUNDS, DISCOUNTS, EMAIL_TEMPLATES, INTEGRATIONS, ACTIVITY, ACTIVITY_LOG, NOTIFICATIONS, DK_CITIES });

// Danish ↔ English strings
const T = {
  // nav sections
  sec_sales: { da: 'SALG', en: 'SALES' },
  sec_customers: { da: 'KUNDER', en: 'CUSTOMERS' },
  sec_analysis: { da: 'ANALYSE', en: 'ANALYSIS' },
  sec_settings: { da: 'INDSTILLINGER', en: 'SETTINGS' },
  menu: { da: 'MENU', en: 'MENU' },
  analysis: { da: 'ANALYSE', en: 'ANALYSIS' },
  settings_label: { da: 'INDSTILLINGER', en: 'SETTINGS' },
  dashboard: { da: 'Dashboard', en: 'Dashboard' },
  products: { da: 'Produkter', en: 'Products' },
  add_product: { da: 'Tilføj produkt', en: 'Add product' },
  orders: { da: 'Ordrestyring', en: 'Order management' },
  refunds: { da: 'Tilbagebetalinger', en: 'Refunds' },
  discounts: { da: 'Rabatkoder', en: 'Discount codes' },
  customers: { da: 'Kundeliste', en: 'Customers' },
  stats: { da: 'Statistik', en: 'Statistics' },
  activity_log: { da: 'Aktivitetslog', en: 'Activity log' },
  newsletter: { da: 'Nyhedsbrev', en: 'Newsletter' },
  shipping: { da: 'Fragt', en: 'Shipping' },
  email_templates: { da: 'Email-skabeloner', en: 'Email templates' },
  integrations: { da: 'Integrationer', en: 'Integrations' },
  settings: { da: 'Generelle indstillinger', en: 'General settings' },

  // topbar
  search: { da: 'Søg varer, ordrer, kunder…', en: 'Search products, orders, customers…' },

  // dashboard
  welcome: { da: 'Velkommen tilbage, Malik', en: 'Welcome back, Malik' },
  welcome_sub: { da: 'Her er hvad der sker i din shop lige nu', en: 'Here is what\'s happening in your shop right now' },
  stat_products: { da: 'Varer i alt', en: 'Total products' },
  stat_orders: { da: 'Ordrer (30d)', en: 'Orders (30d)' },
  stat_revenue: { da: 'Omsætning (30d)', en: 'Revenue (30d)' },
  stat_customers: { da: 'Kunder', en: 'Customers' },
  stat_this_week: { da: 'denne uge', en: 'this week' },
  stat_last_month: { da: 'sidste måned', en: 'last month' },
  sales_6m: { da: 'Salg seneste 6 måneder', en: 'Sales last 6 months' },
  sales_cat: { da: 'Salg pr. kategori', en: 'Sales by category' },
  top_products: { da: 'Mest solgte varer', en: 'Top-selling products' },
  order_count_label: { da: 'antal ordrer', en: 'orders' },
  orders_unit: { da: 'ordrer', en: 'orders' },
  no_sales_data: { da: 'Ingen salgsdata endnu', en: 'No sales data yet' },
  category_data_pending: { da: 'Kategori-data kommer med Live-switch', en: 'Category data coming with Live switch' },
  order_backend_pending: { da: 'Tilgængelig efter ordre-backend (fase 3c)', en: 'Available after order backend (phase 3c)' },

  // categories
  cat_voksne: { da: 'Voksne', en: 'Adults' },
  cat_born: { da: 'Børn', en: 'Kids' },
  cat_erhverv: { da: 'Erhverv', en: 'Business' },
  cat_all: { da: 'Alle kategorier', en: 'All categories' },

  // table headers
  th_sku: { da: 'SKU', en: 'SKU' },
  th_product: { da: 'Vare', en: 'Product' },
  th_price: { da: 'Pris', en: 'Price' },
  th_category: { da: 'Kategori', en: 'Category' },
  th_files: { da: 'Filer', en: 'Files' },
  th_sold: { da: 'Solgt', en: 'Sold' },
  th_status: { da: 'Status', en: 'Status' },
  th_visible: { da: 'Synlig', en: 'Visible' },
  th_order: { da: 'Ordre', en: 'Order' },
  th_date: { da: 'Dato', en: 'Date' },
  th_customer: { da: 'Kunde', en: 'Customer' },
  th_items: { da: 'Varer', en: 'Items' },
  th_amount: { da: 'Beløb', en: 'Amount' },
  th_name: { da: 'Navn', en: 'Name' },
  th_email: { da: 'Email', en: 'Email' },
  th_phone: { da: 'Telefon', en: 'Phone' },
  th_city: { da: 'By', en: 'City' },
  th_orders_count: { da: 'Ordrer', en: 'Orders' },
  th_spent: { da: 'Forbrug', en: 'Spent' },
  th_newsletter: { da: 'Nyhedsmail', en: 'Newsletter' },
  th_subject: { da: 'Emne', en: 'Subject' },
  th_sent: { da: 'Sendt', en: 'Sent' },
  th_opened: { da: 'Åbnet', en: 'Opened' },
  th_clicked: { da: 'Klik', en: 'Clicks' },

  // buttons
  new_product: { da: '+ Ny vare', en: '+ New product' },
  new_newsletter: { da: '+ Opret nyhedsmail', en: '+ New newsletter' },
  save: { da: 'Gem', en: 'Save' },
  cancel: { da: 'Annullér', en: 'Cancel' },
  back: { da: '← Tilbage', en: '← Back' },
  edit: { da: 'Redigér', en: 'Edit' },

  // product form
  edit_product: { da: 'Rediger vare', en: 'Edit product' },
  add_product_title: { da: 'Tilføj vare', en: 'Add product' },
  basics: { da: 'Basis', en: 'Basics' },
  basics_desc: { da: 'Grundlæggende information om varen', en: 'Basic information about the product' },
  description: { da: 'Beskrivelse', en: 'Description' },
  description_desc: { da: 'Synlig for kunder — dansk og engelsk', en: 'Visible to customers — Danish and English' },
  images: { da: 'Billeder', en: 'Images' },
  images_desc: { da: 'Hovedbillede vises først, ekstra galleri-billeder nedenunder', en: 'Main image shown first, gallery images below' },
  internal_files: { da: 'Interne filer', en: 'Internal files' },
  internal_files_desc: { da: 'STL, PDF, byggemanualer — kun synlig for admin', en: 'STL, PDF, build guides — admin only' },
  internal_notes: { da: 'Interne noter', en: 'Internal notes' },
  internal_notes_desc: { da: 'Dine egne noter, aldrig synlig for kunder', en: 'Your own notes, never visible to customers' },
  name_da: { da: 'Navn (dansk)', en: 'Name (Danish)' },
  name_en: { da: 'Navn (engelsk)', en: 'Name (English)' },
  desc_da: { da: 'Beskrivelse (dansk)', en: 'Description (Danish)' },
  desc_en: { da: 'Beskrivelse (engelsk)', en: 'Description (English)' },
  price_dkk: { da: 'Pris (DKK)', en: 'Price (DKK)' },
  drop_images: { da: 'Træk billeder hertil eller klik for at vælge', en: 'Drop images here or click to select' },
  drop_files: { da: 'Træk filer hertil eller klik for at vælge', en: 'Drop files here or click to select' },
  file_types: { da: 'STL, PDF, DXF, DWG — op til 100 MB', en: 'STL, PDF, DXF, DWG — up to 100 MB' },
  image_types: { da: 'PNG, JPG, WebP — op til 10 MB', en: 'PNG, JPG, WebP — up to 10 MB' },
  visible_field: { da: 'Synlig i webshop', en: 'Visible in shop' },
  notes_placeholder: { da: '8 skruer 4x40mm, træ fra Silvan, printtid 4t…', en: '8 screws 4x40mm, wood from Silvan, print time 4h…' },
  primary: { da: 'Hoved', en: 'Main' },

  // orders
  status_paid: { da: 'Betalt', en: 'Paid' },
  status_production: { da: 'Produceres', en: 'In production' },
  status_shipped: { da: 'Sendt', en: 'Shipped' },
  status_delivered: { da: 'Leveret', en: 'Delivered' },
  all: { da: 'Alle', en: 'All' },
  order_detail: { da: 'Ordredetaljer', en: 'Order details' },
  delivery_address: { da: 'Leveringsadresse', en: 'Delivery address' },
  customer_info: { da: 'Kundeinfo', en: 'Customer info' },
  timeline: { da: 'Status-tidslinje', en: 'Status timeline' },
  items_ordered: { da: 'Varer i ordren', en: 'Items ordered' },
  total: { da: 'I alt', en: 'Total' },

  // customer detail
  customer_profile: { da: 'Kundeprofil', en: 'Customer profile' },
  contact: { da: 'Kontakt', en: 'Contact' },
  address: { da: 'Adresse', en: 'Address' },
  order_history: { da: 'Ordrehistorik', en: 'Order history' },
  admin_notes: { da: 'Interne noter', en: 'Admin notes' },
  total_orders: { da: 'Ordrer i alt', en: 'Total orders' },
  total_spent: { da: 'Samlet forbrug', en: 'Total spent' },

  // stats
  time_7: { da: '7 dage', en: '7 days' },
  time_30: { da: '30 dage', en: '30 days' },
  time_90: { da: '90 dage', en: '90 days' },
  time_365: { da: '1 år', en: '1 year' },
  revenue_over_time: { da: 'Omsætning over tid', en: 'Revenue over time' },
  top_10: { da: 'Top 10 varer', en: 'Top 10 products' },
  category_split: { da: 'Kategori-fordeling', en: 'Category split' },
  new_customers: { da: 'Nye kunder pr. måned', en: 'New customers per month' },

  // newsletter
  newsletters_sent: { da: 'Tidligere udsendte nyhedsmails', en: 'Previously sent newsletters' },
  gdpr_note: { da: 'GDPR: Kunder der har afmeldt nyhedsmail modtager ikke denne kampagne', en: 'GDPR: customers who opted out won\'t receive this campaign' },
  compose_newsletter: { da: 'Skriv nyhedsmail', en: 'Compose newsletter' },
  subject_line: { da: 'Emne', en: 'Subject' },
  content: { da: 'Indhold', en: 'Content' },
  recipients: { da: 'Modtagere', en: 'Recipients' },
  recipients_all: { da: 'Alle kunder med nyhedsmail (284)', en: 'All customers with newsletter (284)' },
  recipients_adults: { da: 'Kun voksne-kategori (186)', en: 'Adults category only (186)' },
  recipients_specific: { da: 'Specifikke kunder…', en: 'Specific customers…' },
  preview: { da: 'Vis preview', en: 'Show preview' },
  send: { da: 'Send', en: 'Send' },
  draft: { da: 'Gem kladde', en: 'Save draft' },

  // filters
  filter_category: { da: 'Kategori', en: 'Category' },
  filter_visible: { da: 'Synlighed', en: 'Visibility' },
  visible_yes: { da: 'Synlig', en: 'Visible' },
  visible_no: { da: 'Skjult', en: 'Hidden' },

  // shipping
  shipping_methods: { da: 'Fragtmetoder', en: 'Shipping methods' },
  shipping_desc: { da: 'Hvilke fragtløsninger kunder kan vælge ved checkout', en: 'Which shipping options customers can choose at checkout' },
  carrier_gls: { da: 'GLS Pakkeshop', en: 'GLS Parcel Shop' },
  carrier_dao: { da: 'DAO Hjemmelevering', en: 'DAO Home delivery' },
  carrier_bring: { da: 'Bring Erhverv', en: 'Bring Business' },
  carrier_pickup: { da: 'Afhentning i værkstedet', en: 'Pick up at workshop' },

  // settings
  settings_store: { da: 'Butiksindstillinger', en: 'Store settings' },
  settings_store_desc: { da: 'Navn, kontaktinfo, valuta', en: 'Name, contact info, currency' },
  settings_payment: { da: 'Betalingsmetoder', en: 'Payment methods' },
  settings_tax: { da: 'Moms og afgifter', en: 'Tax and fees' },
  settings_notifications: { da: 'Notifikationer', en: 'Notifications' },

  kr: { da: 'kr', en: 'DKK' },

  // Dashboard additions
  ready_production: { da: 'Klar til produktion', en: 'Ready for production' },
  ready_production_sub: { da: 'Betalte ordrer der venter på produktion', en: 'Paid orders waiting for production' },
  days_ago: { da: 'dage siden', en: 'days ago' },
  recent_activity: { da: 'Seneste aktivitet', en: 'Recent activity' },
  monthly_goal: { da: 'Månedsmål', en: 'Monthly goal' },
  monthly_goal_sub: { da: 'Omsætning i denne måned', en: 'Revenue this month' },
  customer_map: { da: 'Kunder i Danmark', en: 'Customers in Denmark' },
  low_revenue_title: { da: 'Omsætningen er 12% under sidste måned', en: 'Revenue is 12% below last month' },
  low_revenue_sub: { da: 'Overvej en kampagne — prøv en 15% rabatkode til tilbagevendende kunder', en: 'Consider a campaign — try a 15% discount code for returning customers' },
  just_now: { da: 'lige nu', en: 'just now' },
  min_ago: { da: 'min. siden', en: 'min ago' },
  hr_ago: { da: 't. siden', en: 'h ago' },
  view_all: { da: 'Se alle', en: 'View all' },

  // Product edit additions
  variants: { da: 'Varianter', en: 'Variants' },
  variants_desc: { da: 'Forskellige udgaver af samme produkt', en: 'Different versions of the same product' },
  add_variant: { da: '+ Tilføj variant', en: '+ Add variant' },
  variant_name: { da: 'Variant', en: 'Variant' },
  delivery_details: { da: 'Leveringsdetaljer', en: 'Delivery details' },
  delivery_details_desc: { da: 'Hvordan produktet pakkes og sendes', en: 'How the product is packaged and shipped' },
  // 3.1c — vægt + dimensioner
  weight_grams: { da: 'Vægt (gram)', en: 'Weight (grams)' },
  dim_length_cm: { da: 'Længde (cm)', en: 'Length (cm)' },
  dim_width_cm: { da: 'Bredde (cm)', en: 'Width (cm)' },
  dim_height_cm: { da: 'Højde (cm)', en: 'Height (cm)' },
  // reserved for W7-W10 ordrer/forsendelse — do not remove
  delivery_time: { da: 'Leveringstid', en: 'Delivery time' },
  dt_fast: { da: '1–3 dage', en: '1–3 days' },
  dt_med: { da: '3–7 dage', en: '3–7 days' },
  dt_slow: { da: '2–4 uger', en: '2–4 weeks' },
  badges: { da: 'Badges', en: 'Badges' },
  badges_desc: { da: 'Fremhæv produktet med små mærker', en: 'Highlight the product with small tags' },
  badge_new: { da: 'Nyhed', en: 'New' },
  badge_sale: { da: 'Udsalg', en: 'Sale' },
  old_price: { da: 'Førpris (DKK)', en: 'Original price (DKK)' },
  tags: { da: 'Tags', en: 'Tags' },
  tags_desc: { da: 'Søgeord der hjælper kunder med at finde produktet', en: 'Keywords that help customers find the product' },
  add_tag: { da: 'Tilføj tag…', en: 'Add tag…' },
  related_products: { da: 'Relaterede produkter', en: 'Related products' },
  related_desc: { da: 'Vises som forslag på produktsiden', en: 'Shown as suggestions on the product page' },
  seo: { da: 'SEO', en: 'SEO' },
  seo_desc: { da: 'Hvordan produktet vises i søgeresultater', en: 'How the product appears in search results' },
  meta_title_da: { da: 'Meta-titel (DA)', en: 'Meta title (DA)' },
  meta_title_en: { da: 'Meta-titel (EN)', en: 'Meta title (EN)' },
  meta_desc_da: { da: 'Meta-beskrivelse (DA)', en: 'Meta description (DA)' },
  meta_desc_en: { da: 'Meta-beskrivelse (EN)', en: 'Meta description (EN)' },
  url_slug: { da: 'URL-slug', en: 'URL slug' },

  // Refunds
  refunds_sub: { da: 'Tilbagebetalingsanmodninger fra kunder', en: 'Refund requests from customers' },
  th_reason: { da: 'Årsag', en: 'Reason' },
  refund_pending: { da: 'Afventer', en: 'Pending' },
  refund_approved: { da: 'Gennemført', en: 'Approved' },
  refund_rejected: { da: 'Afvist', en: 'Rejected' },
  approve: { da: 'Godkend', en: 'Approve' },
  reject: { da: 'Afvis', en: 'Reject' },
  refund_detail: { da: 'Tilbagebetaling', en: 'Refund' },

  // Discounts
  discounts_sub: { da: 'Kampagner og rabatkoder', en: 'Campaigns and discount codes' },
  new_discount: { da: '+ Opret rabatkode', en: '+ New discount code' },
  th_code: { da: 'Kode', en: 'Code' },
  th_type: { da: 'Type', en: 'Type' },
  th_value: { da: 'Værdi', en: 'Value' },
  th_used: { da: 'Brugt', en: 'Used' },
  th_valid: { da: 'Gyldig', en: 'Valid' },
  discount_percent: { da: 'Procent', en: 'Percent' },
  discount_fixed: { da: 'Fast beløb', en: 'Fixed amount' },
  discount_active: { da: 'Aktiv', en: 'Active' },
  discount_expired: { da: 'Udløbet', en: 'Expired' },
  discount_scheduled: { da: 'Planlagt', en: 'Scheduled' },
  discount_form: { da: 'Ny rabatkode', en: 'New discount code' },
  applies_to: { da: 'Gælder for', en: 'Applies to' },
  all_products: { da: 'Alle produkter', en: 'All products' },
  specific_categories: { da: 'Specifikke kategorier', en: 'Specific categories' },
  specific_products: { da: 'Specifikke produkter', en: 'Specific products' },
  max_uses: { da: 'Max antal brug', en: 'Max uses' },
  expires: { da: 'Udløbsdato', en: 'Expires' },

  // Email templates
  templates_sub: { da: 'Automatiske mails der sendes til dine kunder', en: 'Automated emails sent to your customers' },
  tmpl_order_confirm: { da: 'Ordrebekræftelse', en: 'Order confirmation' },
  tmpl_shipping: { da: 'Fragtbesked', en: 'Shipping notice' },
  tmpl_delivered: { da: 'Levering bekræftet', en: 'Delivery confirmed' },
  tmpl_newsletter: { da: 'Nyhedsbrev-standard', en: 'Newsletter default' },
  tmpl_welcome: { da: 'Velkomst ved tilmelding', en: 'Welcome on signup' },
  use_brand_colors: { da: 'Brug brand-farver', en: 'Use brand colors' },
  include_logo: { da: 'Inkluder logo', en: 'Include logo' },
  body_da: { da: 'Indhold (DA)', en: 'Body (DA)' },
  body_en: { da: 'Indhold (EN)', en: 'Body (EN)' },
  subject_da: { da: 'Emne (DA)', en: 'Subject (DA)' },
  subject_en: { da: 'Emne (EN)', en: 'Subject (EN)' },
  sends_on: { da: 'Udløses ved', en: 'Triggers on' },

  // Integrations
  integrations_sub: { da: 'Forbundne tjenester', en: 'Connected services' },
  connected: { da: 'Forbundet', en: 'Connected' },
  disconnected: { da: 'Afbrudt', en: 'Disconnected' },
  degraded: { da: 'Nedsat', en: 'Degraded' },
  manage: { da: 'Administrer', en: 'Manage' },
  connect: { da: 'Forbind', en: 'Connect' },
  last_transaction: { da: 'Sidste transaktion', en: 'Last transaction' },
  emails_month: { da: 'Mails denne måned', en: 'Emails this month' },
  bounce_rate: { da: 'Bounce-rate', en: 'Bounce rate' },
  last_deploy: { da: 'Sidste deploy', en: 'Last deploy' },
  build_time: { da: 'Build-tid', en: 'Build time' },

  // Activity log
  activity_sub: { da: 'Alt der sker i din admin', en: 'Everything happening in your admin' },
  filter_action: { da: 'Handling', en: 'Action' },
  filter_user: { da: 'Bruger', en: 'User' },
  filter_date: { da: 'Dato', en: 'Date' },
  act_product_updated: { da: 'Produkt opdateret', en: 'Product updated' },
  act_product_created: { da: 'Produkt oprettet', en: 'Product created' },
  act_product_deleted: { da: 'Produkt slettet', en: 'Product deleted' },
  act_order_status: { da: 'Ordre-status ændret', en: 'Order status changed' },
  act_discount_created: { da: 'Rabatkode oprettet', en: 'Discount code created' },
  act_customer_deleted: { da: 'Kunde slettet (GDPR)', en: 'Customer deleted (GDPR)' },
  act_settings: { da: 'Indstillinger ændret', en: 'Settings changed' },
  act_login: { da: 'Login', en: 'Login' },

  // Customers extended
  th_geography: { da: 'Geografi', en: 'Geography' },
  th_ltv: { da: 'Livstidsværdi', en: 'Lifetime value' },
  th_last_purchase: { da: 'Sidste køb', en: 'Last purchase' },
  th_segment: { da: 'Segment', en: 'Segment' },
  seg_new: { da: 'Ny', en: 'New' },
  seg_returning: { da: 'Tilbagevendende', en: 'Returning' },
  seg_vip: { da: 'VIP', en: 'VIP' },
  send_email: { da: 'Send email', en: 'Send email' },
  delete_customer: { da: 'Slet kunde', en: 'Delete customer' },
  export_data: { da: 'Eksportér data', en: 'Export data' },
  gdpr_delete_title: { da: 'Slet kundedata permanent?', en: 'Permanently delete customer data?' },
  gdpr_delete_body: { da: 'Handlingen kan ikke fortrydes. Alle personoplysninger slettes jf. GDPR. Ordrer beholdes i anonymiseret form til bogføring.', en: 'This cannot be undone. All personal data will be deleted under GDPR. Orders are kept anonymized for accounting.' },
  confirm_delete: { da: 'Ja, slet permanent', en: 'Yes, delete permanently' },

  // Stats additions
  avg_order_value: { da: 'Gns. ordreværdi', en: 'Avg. order value' },
  conversion_rate: { da: 'Konverteringsrate', en: 'Conversion rate' },
  conversion_sub: { da: 'af besøgende køber', en: 'of visitors buy' },
  returning_rate: { da: 'Tilbagevendende kunder', en: 'Returning customers' },
  first_time: { da: 'Første-gangs', en: 'First-time' },

  // Topbar
  export: { da: 'Eksport', en: 'Export' },
  export_products_xlsx: { da: 'Eksportér produkter (Excel)', en: 'Export products (Excel)' },
  export_orders_csv: { da: 'Eksportér ordrer (CSV)', en: 'Export orders (CSV)' },
  export_customers_gdpr: { da: 'Eksportér kunder (GDPR)', en: 'Export customers (GDPR)' },
  notifications: { da: 'Notifikationer', en: 'Notifications' },
  mark_all_read: { da: 'Markér alle som læst', en: 'Mark all as read' },

  // Command palette
  cmd_search: { da: 'Søg eller naviger…', en: 'Search or navigate…' },
  cmd_hint: { da: 'Tryk ⌘K for at åbne', en: 'Press ⌘K to open' },
  cmd_pages: { da: 'Sider', en: 'Pages' },
  cmd_recent: { da: 'Seneste', en: 'Recent' },
  cmd_products: { da: 'Produkter', en: 'Products' },
  cmd_orders: { da: 'Ordrer', en: 'Orders' },
  cmd_customers: { da: 'Kunder', en: 'Customers' },

  // Empty states
  empty_generic: { da: 'Intet at vise her endnu', en: 'Nothing to show here yet' },

  // ===== Ordrestyring =====
  om_sub: { da: 'Alle ordrer — shop-betalte og manuelt oprettede', en: 'All orders — shop-paid and manually created' },
  om_stat_new_today: { da: 'Nye i dag', en: 'New today' },
  om_stat_production: { da: 'Under produktion', en: 'In production' },
  om_stat_ready: { da: 'Klar til forsendelse', en: 'Ready to ship' },
  om_stat_shipped_week: { da: 'Sendt denne uge', en: 'Shipped this week' },
  om_cc_only_hint: { da: 'Kun kreditkort-ordrer', en: 'Credit card orders only' },
  create_manual_order: { da: 'Opret manuel ordre', en: 'Create manual order' },
  export_csv: { da: 'Eksportér CSV', en: 'Export CSV' },

  // statuses (full set)
  status_new: { da: 'Ny', en: 'New' },
  status_ready: { da: 'Klar til forsendelse', en: 'Ready' },
  status_cancelled: { da: 'Annulleret', en: 'Cancelled' },
  status_refunded: { da: 'Refunderet', en: 'Refunded' },
  status_created: { da: 'Oprettet', en: 'Created' },

  // payment methods
  pay_all: { da: 'Alle betalingsmetoder', en: 'All payment methods' },
  pay_cc: { da: 'Kreditkort', en: 'Credit card' },
  pay_mobilepay: { da: 'MobilePay', en: 'MobilePay' },
  pay_bank: { da: 'Bankoverførsel', en: 'Bank transfer' },
  pay_cash: { da: 'Kontant', en: 'Cash' },
  pay_barter: { da: 'Bytte', en: 'Barter' },
  pay_free: { da: 'Gratis', en: 'Free' },

  // fragt statuses
  fr_all: { da: 'Alle fragt-statusser', en: 'All shipping statuses' },
  fr_none: { da: 'Ingen fragt', en: 'No shipping' },
  fr_qr_pending: { da: 'QR genereret', en: 'QR generated' },
  fr_dropped_off: { da: 'Afleveret i pakkeshop', en: 'Dropped off' },
  fr_in_transit: { da: 'Undervejs', en: 'In transit' },
  fr_delivered: { da: 'Leveret', en: 'Delivered' },
  fragt_status: { da: 'Fragt', en: 'Shipping' },
  fragt_status_col: { da: 'Fragt', en: 'Ship' },

  // date ranges
  date_today: { da: 'I dag', en: 'Today' },
  date_7: { da: '7 dage', en: '7 days' },
  date_30: { da: '30 dage', en: '30 days' },
  date_custom: { da: 'Tilpas…', en: 'Custom…' },

  // filter toggle
  only_revenue: { da: 'Kun ordrer der tæller i omsætning', en: 'Only revenue-counting orders' },

  // table
  th_payment: { da: 'Betaling', en: 'Payment' },
  th_actions: { da: 'Handlinger', en: 'Actions' },

  // bulk actions
  bulk_production: { da: 'Markér som under produktion', en: 'Mark as in production' },
  bulk_create_qr: { da: 'Opret fragt-QR for valgte', en: 'Create shipping QR for selected' },
  bulk_shipped: { da: 'Markér som sendt', en: 'Mark as shipped' },
  bulk_export: { da: 'Eksportér valgte som CSV', en: 'Export selected as CSV' },
  bulk_print: { da: 'Print pakkesedler (PDF)', en: 'Print packing slips (PDF)' },
  selected_n: { da: 'valgt', en: 'selected' },

  // manual-order modal
  mo_title: { da: 'Opret manuel ordre', en: 'Create manual order' },
  mo_sub: { da: 'Til MobilePay, bankoverførsel, kontant, bytte eller gratis', en: 'For MobilePay, bank transfer, cash, barter or free' },
  mo_customer: { da: 'Kunde', en: 'Customer' },
  mo_find_customer: { da: 'Find eksisterende kunde…', en: 'Find existing customer…' },
  mo_new_customer: { da: 'Opret ny kunde', en: 'Create new customer' },
  mo_save_customer: { da: 'Gem kunde til fremtidige ordrer', en: 'Save customer for future orders' },
  mo_products: { da: 'Produkter', en: 'Products' },
  mo_add_product: { da: 'Tilføj produkt', en: 'Add product' },
  mo_add_free_line: { da: 'Tilføj fri tekst-linje', en: 'Add free text line' },
  mo_product_placeholder: { da: 'Søg produkter…', en: 'Search products…' },
  mo_unit_price: { da: 'Enhedspris', en: 'Unit price' },
  mo_qty: { da: 'Antal', en: 'Qty' },
  mo_line_total: { da: 'Linjesum', en: 'Line total' },
  mo_subtotal: { da: 'Subtotal', en: 'Subtotal' },
  mo_payment: { da: 'Betaling', en: 'Payment' },
  mo_payment_hint: { da: 'Kun kreditkort-ordrer tæller i omsætning og udløser bekræftelses-email til kunden.', en: 'Only credit card orders count in revenue and trigger a confirmation email.' },
  mo_stripe_id: { da: 'Stripe Charge ID (hvis betalt via Terminal eller Link)', en: 'Stripe Charge ID (if paid via Terminal or Link)' },
  mo_paid_date: { da: 'Betalt-dato', en: 'Paid date' },
  mo_shipping: { da: 'Fragt', en: 'Shipping' },
  mo_ship_none: { da: 'Ingen fragt (afhentes)', en: 'No shipping (pickup)' },
  mo_ship_ship: { da: 'Skal sendes via Shipmondo', en: 'Ship via Shipmondo' },
  mo_ship_self: { da: 'Selvleveret', en: 'Self-delivered' },
  mo_ship_price: { da: 'Fragt-pris (kr)', en: 'Shipping price (DKK)' },
  mo_package_size: { da: 'Pakkestørrelse', en: 'Package size' },
  pkg_s: { da: 'Lille (op til 1 kg)', en: 'Small (up to 1 kg)' },
  pkg_m: { da: 'Medium (1–5 kg)', en: 'Medium (1–5 kg)' },
  pkg_l: { da: 'Stor (5–20 kg)', en: 'Large (5–20 kg)' },
  mo_address: { da: 'Leveringsadresse', en: 'Delivery address' },
  mo_internal_note: { da: 'Intern note (kun synlig for dig)', en: 'Internal note (only visible to you)' },
  mo_note_placeholder: { da: 'Gave til far. Pakkes i gavepapir.', en: 'Gift for dad. Wrap in gift paper.' },
  mo_save_draft: { da: 'Gem som kladde', en: 'Save as draft' },
  mo_create: { da: 'Opret ordre', en: 'Create order' },

  // order detail
  back_to_orders: { da: 'Tilbage til ordrestyring', en: 'Back to orders' },
  od_actions: { da: 'Handlinger', en: 'Actions' },
  od_change_status: { da: 'Skift status', en: 'Change status' },
  od_send_email: { da: 'Send email til kunde', en: 'Send email to customer' },
  od_print_slip: { da: 'Print pakkeseddel', en: 'Print packing slip' },
  od_cancel: { da: 'Annuller ordre', en: 'Cancel order' },
  od_refund: { da: 'Refundér', en: 'Refund' },
  od_next_status: { da: 'Ryk til næste status', en: 'Advance to next status' },
  od_regen: { da: 'Regenerér status fra Stripe/Shipmondo', en: 'Regenerate status from Stripe/Shipmondo' },
  od_items: { da: 'Varer', en: 'Items' },
  od_notes: { da: 'Interne noter', en: 'Internal notes' },
  od_add_note: { da: 'Tilføj note…', en: 'Add note…' },
  od_customer: { da: 'Kunde', en: 'Customer' },
  od_delivery: { da: 'Leveringsadresse', en: 'Delivery address' },
  od_payment: { da: 'Betaling', en: 'Payment' },
  od_fragt: { da: 'Fragt', en: 'Shipping' },
  od_previous_orders: { da: 'Tidligere ordrer', en: 'Previous orders' },
  od_view_customer: { da: 'Se kundeprofil', en: 'View customer' },
  od_stripe_link: { da: 'Åbn i Stripe Dashboard', en: 'Open in Stripe Dashboard' },
  od_method: { da: 'Metode', en: 'Method' },
  od_amount: { da: 'Beløb', en: 'Amount' },
  od_paid: { da: 'Betalt', en: 'Paid' },

  // shipmondo / QR
  shm_create: { da: 'Opret fragt via Shipmondo', en: 'Create shipping via Shipmondo' },
  shm_package_size: { da: 'Pakkestørrelse', en: 'Package size' },
  shm_dropoff: { da: 'Afleveringsmetode', en: 'Drop-off method' },
  shm_parcelshop: { da: 'Aflevering i pakkeshop', en: 'Drop at parcel shop' },
  shm_pickup: { da: 'Afhentning hos dig', en: 'Pickup from you' },
  shm_generate: { da: 'Generér QR-label', en: 'Generate QR label' },
  shm_tracking: { da: 'Tracking-nummer', en: 'Tracking number' },
  shm_send_qr: { da: 'Send QR til kunde', en: 'Send QR to customer' },
  shm_download_pdf: { da: 'Download label som PDF', en: 'Download label as PDF' },
  shm_scan_hint: { da: 'Scan QR i pakkeshop for at aflevere', en: 'Scan QR at parcel shop to drop off' },
  shm_track: { da: 'Spor forsendelse hos PostNord', en: 'Track at PostNord' },

  // dashboard additions
  revenue_cc_tooltip: { da: 'Kun kreditkort-betalinger tælles i omsætning', en: 'Only credit card payments count in revenue' },
  manual_orders_30d: { da: 'Manuelle ordrer seneste 30 dage', en: 'Manual orders last 30 days' },
  manual_orders_30d_sub: { da: 'MobilePay, bank, kontant, bytte, gratis', en: 'MobilePay, bank, cash, barter, free' },

  // stats additions
  stats_revenue_cc_note: { da: 'Alle omsætningstal er kun for kreditkort-ordrer', en: 'All revenue figures are credit card only' },
  manual_orders_chart: { da: 'Manuelle ordrer pr. betalingsmetode', en: 'Manual orders by payment method' },
  pay_mobilepay: { da: 'MobilePay', en: 'MobilePay' },
  pay_bank: { da: 'Bankoverførsel', en: 'Bank transfer' },
  pay_cash: { da: 'Kontant', en: 'Cash' },
  pay_barter: { da: 'Bytte', en: 'Barter' },
  pay_free: { da: 'Gratis', en: 'Free' },
  gifts_given: { da: 'Gaver givet', en: 'Gifts given' },
  gifts_given_sub: { da: 'Gratis-ordrer i denne måned', en: 'Free orders this month' },

  // email templates additions
  tmpl_order_confirm_cc: { da: 'Ordrebekræftelse — kreditkort', en: 'Order confirmation — credit card' },
  tmpl_fragt_qr: { da: 'Pakken er sendt', en: 'Parcel shipped' },
  tmpl_cc_banner: { da: 'Bekræftelses-emails sendes KUN til kreditkort-ordrer. Manuelle ordrer (MobilePay, bankoverførsel, kontant, bytte, gratis) udløser ikke automatisk email.', en: 'Confirmation emails are sent ONLY for credit card orders. Manual orders (MobilePay, bank transfer, cash, barter, free) do not trigger automatic email.' },

  // packing slip
  slip_title: { da: 'Kvittering', en: 'Receipt' },
  slip_disclaimer: { da: 'Denne kvittering er uformel og kan ikke bruges som fradragsberettiget bilag.', en: 'This receipt is informal and cannot be used as a tax-deductible document.' },
  manual_badge: { da: 'Manuel ordre', en: 'Manual order' },

  // misc
  info_tooltip: { da: 'Info', en: 'Info' },
  pickup: { da: 'Afhentning', en: 'Pickup' },

  // 3.1b — product edit form save flow
  saved_message: { da: 'Gemt — kunder ser ændringen om ca. 1 minut', en: 'Saved — customers will see the change in ~1 minute' },
  saving: { da: 'Gemmer…', en: 'Saving…' },
  discard_changes_confirm: { da: 'Du har ugemte ændringer. Forkast dem?', en: 'You have unsaved changes. Discard them?' },
  back_to_products: { da: 'Tilbage til produktliste', en: 'Back to products' },
  dismiss: { da: 'Luk', en: 'Dismiss' },

  // 3.1b — error banners (per HTTP-status fra 3.1a-kontrakt)
  err_invalid_request: { da: 'Ugyldig forespørgsel — kontakt udvikler', en: 'Invalid request — contact developer' },
  err_validation_failed: { da: 'Tjek felter markeret med fejl', en: 'Check fields marked with errors' },
  err_unauthorized: { da: 'Du er logget ud — log ind igen', en: 'You\'re logged out — log in again' },
  err_forbidden: { da: 'Du har ikke rettigheder til at gemme produkter', en: 'You don\'t have permission to save products' },
  err_product_not_found: { da: 'Produktet findes ikke længere', en: 'Product no longer exists' },
  err_sku_mismatch: { da: 'SKU-mismatch — genindlæs siden', en: 'SKU mismatch — reload page' },
  err_concurrent_write: { da: 'Konflikt — en anden ændring kom først. Genindlæs siden.', en: 'Conflict — another change won. Reload page.' },
  err_rate_limited: { da: 'API rate-limit ramt — prøv igen om få minutter', en: 'API rate limit hit — try again in a few minutes' },
  err_internal_error: { da: 'Uventet fejl — prøv igen eller kontakt udvikler', en: 'Unexpected error — try again or contact developer' },
  err_github_error: { da: 'GitHub API-fejl — prøv igen om lidt', en: 'GitHub API error — try again in a moment' },
  err_network: { da: 'Netværksfejl — tjek forbindelsen og prøv igen', en: 'Network error — check connection and try again' },

  // 3.1c — dim-validation banners (frontend guard + backend whitelist)
  err_negative_dimension: { da: 'Negative tal ikke tilladt — tjek vægt og dimensioner', en: 'Negative numbers not allowed — check weight and dimensions' },
  err_invalid_dimension: { da: 'Ugyldig værdi i vægt eller dimensioner — skal være heltal ≥ 0', en: 'Invalid value in weight or dimensions — must be integer ≥ 0' },
};

function useI18n(lang) {
  return React.useMemo(() => {
    const t = (key) => {
      const entry = T[key];
      if (!entry) return key;
      return entry[lang] || entry.da;
    };
    return { t };
  }, [lang]);
}

window.T = T;
window.useI18n = useI18n;

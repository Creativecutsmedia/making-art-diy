const BRAND_DARK = '#5C3D20';
const BRAND_GOLD = '#C9963A';
const BG = '#f5f2ec';
const TEXT = '#2b2b2b';
const MUTED = '#666';
const BORDER = '#e5e0d6';

const STRINGS = {
  da: {
    htmlLang: 'da',
    subject: (ref) => `Tak for din ordre hos Making Art DIY — ordre #${ref}`,
    headerTitle: 'Tak for din ordre!',
    greetingWithName: (name) => `Hej ${name},`,
    greetingAnonymous: 'Hej,',
    bodyIntro: 'Tak for din ordre hos Making Art DIY. Vi har modtaget din betaling og går i gang med at gøre pakken klar.',
    orderNumberLabel: 'Ordrenummer',
    quantityLabel: 'Antal',
    subtotalLabel: 'Subtotal',
    shippingLabel: 'Fragt',
    shippingFree: 'Gratis',
    totalLabel: 'Total',
    shippingAddressHeader: 'Leveringsadresse',
    deliveryNote: 'Levering forventes inden for 3-7 hverdage. Du hører fra os når pakken er afsendt.',
    vatNote: 'Priserne er ikke tillagt moms (jf. momslovens § 48).',
    supportLineHtml: `Spørgsmål? Svar bare på denne mail eller skriv til <a href="mailto:info@makingartdiy.dk" style="color:${BRAND_DARK};">info@makingartdiy.dk</a>.`,
    supportLineText: 'Spørgsmål? Svar bare på denne mail eller skriv til info@makingartdiy.dk.',
    unknownProduct: '(ukendt produkt)',
    footerTagline: 'Making Art DIY · makingartdiy.dk',
    plaintextIntro: 'Tak for din ordre hos Making Art DIY!',
    plaintextBodyIntro: 'Vi har modtaget din betaling og går i gang med at gøre pakken klar.',
    plaintextItemsHeader: '--- DINE VARER ---',
    plaintextAddressHeader: '--- LEVERINGSADRESSE ---',
    plaintextDeliveryNote: 'Levering forventes inden for 3-7 hverdage.',
    plaintextSignatureLine1: 'Making Art DIY',
    plaintextSignatureLine2: 'makingartdiy.dk',
  },
  en: {
    htmlLang: 'en',
    subject: (ref) => `Thank you for your order at Making Art DIY — order #${ref}`,
    headerTitle: 'Thank you for your order!',
    greetingWithName: (name) => `Hi ${name},`,
    greetingAnonymous: 'Hi,',
    bodyIntro: 'Thank you for your order at Making Art DIY. We have received your payment and will start preparing your package.',
    orderNumberLabel: 'Order number',
    quantityLabel: 'Quantity',
    subtotalLabel: 'Subtotal',
    shippingLabel: 'Shipping',
    shippingFree: 'Free',
    totalLabel: 'Total',
    shippingAddressHeader: 'Shipping address',
    deliveryNote: 'Delivery is expected within 3-7 business days. We will notify you when your package has been shipped.',
    vatNote: 'Prices are not subject to VAT (Danish VAT Act § 48).',
    supportLineHtml: `Questions? Just reply to this email or write to <a href="mailto:info@makingartdiy.dk" style="color:${BRAND_DARK};">info@makingartdiy.dk</a>.`,
    supportLineText: 'Questions? Just reply to this email or write to info@makingartdiy.dk.',
    unknownProduct: '(unknown product)',
    footerTagline: 'Making Art DIY · makingartdiy.dk',
    plaintextIntro: 'Thank you for your order at Making Art DIY!',
    plaintextBodyIntro: 'We have received your payment and will start preparing your package.',
    plaintextItemsHeader: '--- YOUR ITEMS ---',
    plaintextAddressHeader: '--- SHIPPING ADDRESS ---',
    plaintextDeliveryNote: 'Delivery is expected within 3-7 business days.',
    plaintextSignatureLine1: 'Making Art DIY',
    plaintextSignatureLine2: 'makingartdiy.dk',
  },
};

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPrice(cents, locale) {
  const amount = cents / 100;
  if (locale === 'en') {
    if (Number.isInteger(amount)) {
      return `${amount.toLocaleString('en-US')} DKK`;
    }
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' DKK';
  }
  if (Number.isInteger(amount)) {
    return `${amount.toLocaleString('da-DK')} kr`;
  }
  return amount.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kr';
}

function renderItemsHtml(items, locale, t) {
  return items.map(item => `
    <tr>
      <td width="80" style="padding:16px 16px 16px 0;vertical-align:top;">
        ${item.imageUrl ? `<img src="${esc(item.imageUrl)}" alt="" width="64" height="64" style="display:block;border-radius:4px;">` : ''}
      </td>
      <td style="padding:16px 0;vertical-align:top;">
        <div style="font-size:15px;font-weight:bold;color:${TEXT};">${esc(item.name)}</div>
        <div style="font-size:13px;color:${MUTED};margin-top:4px;">${t.quantityLabel}: ${item.quantity}</div>
      </td>
      <td style="padding:16px 0;vertical-align:top;text-align:right;white-space:nowrap;">
        <div style="font-size:15px;color:${TEXT};">${formatPrice(item.priceCents * item.quantity, locale)}</div>
      </td>
    </tr>
  `).join('');
}

function renderAddressHtml(addr, t) {
  if (!addr) return '';
  return `
    <tr><td style="padding:24px 32px 16px 32px;">
      <div style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:${BRAND_GOLD};font-weight:bold;margin-bottom:8px;">${t.shippingAddressHeader}</div>
      <div style="font-size:15px;line-height:1.5;color:${TEXT};">
        ${addr.name ? esc(addr.name) + '<br>' : ''}
        ${esc(addr.line1)}<br>
        ${addr.line2 ? esc(addr.line2) + '<br>' : ''}
        ${esc(addr.postal_code)} ${esc(addr.city)}<br>
        ${esc(addr.country)}
      </div>
    </td></tr>
  `;
}

function buildOrderEmail({
  orderRef,
  customerName,
  items,
  subtotalCents,
  shippingCents,
  totalCents,
  shippingAddress,
  locale,
}) {
  const lang = locale === 'en' ? 'en' : 'da';
  const t = STRINGS[lang];

  const subject = t.subject(orderRef);
  const greeting = customerName ? t.greetingWithName(esc(customerName)) : t.greetingAnonymous;
  const shippingDisplay = shippingCents === 0 ? t.shippingFree : formatPrice(shippingCents, lang);

  const html = `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head><meta charset="utf-8"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:Helvetica,Arial,sans-serif;color:${TEXT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:${BRAND_DARK};padding:32px 32px 24px 32px;text-align:center;">
          <div style="color:${BRAND_GOLD};font-size:14px;letter-spacing:2px;text-transform:uppercase;">Making Art DIY</div>
          <h1 style="color:#ffffff;font-size:24px;margin:12px 0 0 0;font-weight:normal;">${t.headerTitle}</h1>
        </td></tr>
        <tr><td style="padding:32px 32px 16px 32px;">
          <p style="margin:0 0 12px 0;font-size:16px;line-height:1.5;">${greeting}</p>
          <p style="margin:0 0 12px 0;font-size:16px;line-height:1.5;">${t.bodyIntro}</p>
          <p style="margin:0;font-size:14px;color:${MUTED};">${t.orderNumberLabel}: <strong style="color:${BRAND_DARK};">#${esc(orderRef)}</strong></p>
        </td></tr>
        <tr><td style="padding:16px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid ${BRAND_GOLD};">
            ${renderItemsHtml(items, lang, t)}
          </table>
        </td></tr>
        <tr><td style="padding:8px 32px 16px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${BORDER};">
            <tr>
              <td style="padding:8px 0;font-size:14px;color:${MUTED};">${t.subtotalLabel}</td>
              <td style="padding:8px 0;font-size:14px;text-align:right;">${formatPrice(subtotalCents, lang)}</td>
            </tr>
            <tr>
              <td style="padding:0 0 8px 0;font-size:14px;color:${MUTED};">${t.shippingLabel}</td>
              <td style="padding:0 0 8px 0;font-size:14px;text-align:right;">${shippingDisplay}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 0 0;border-top:2px solid ${BRAND_GOLD};font-size:16px;font-weight:bold;color:${BRAND_DARK};">${t.totalLabel}</td>
              <td style="padding:12px 0 0 0;border-top:2px solid ${BRAND_GOLD};font-size:16px;font-weight:bold;text-align:right;color:${BRAND_DARK};">${formatPrice(totalCents, lang)}</td>
            </tr>
          </table>
        </td></tr>
        ${renderAddressHtml(shippingAddress, t)}
        <tr><td style="padding:24px 32px 32px 32px;border-top:1px solid ${BORDER};">
          <p style="margin:0 0 8px 0;font-size:13px;color:${MUTED};line-height:1.5;">${t.deliveryNote}</p>
          <p style="margin:0 0 8px 0;font-size:13px;color:${MUTED};line-height:1.5;">${t.vatNote}</p>
          <p style="margin:12px 0 0 0;font-size:13px;color:${MUTED};line-height:1.5;">${t.supportLineHtml}</p>
        </td></tr>
        <tr><td style="background:${BRAND_DARK};padding:16px 32px;text-align:center;">
          <div style="color:${BRAND_GOLD};font-size:12px;">${t.footerTagline}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const itemsText = items
    .map(i => `${i.name} × ${i.quantity} — ${formatPrice(i.priceCents * i.quantity, lang)}`)
    .join('\n');

  const addressText = shippingAddress
    ? [
        shippingAddress.name,
        shippingAddress.line1,
        shippingAddress.line2,
        `${shippingAddress.postal_code} ${shippingAddress.city}`,
        shippingAddress.country,
      ].filter(Boolean).join('\n')
    : '';

  const text = [
    t.plaintextIntro,
    '',
    customerName ? t.greetingWithName(customerName) : t.greetingAnonymous,
    '',
    t.plaintextBodyIntro,
    '',
    `${t.orderNumberLabel}: #${orderRef}`,
    '',
    t.plaintextItemsHeader,
    itemsText,
    '',
    `${t.subtotalLabel}: ${formatPrice(subtotalCents, lang)}`,
    `${t.shippingLabel}: ${shippingDisplay}`,
    `${t.totalLabel}: ${formatPrice(totalCents, lang)}`,
    ...(addressText ? ['', t.plaintextAddressHeader, addressText] : []),
    '',
    t.plaintextDeliveryNote,
    t.vatNote,
    '',
    t.supportLineText,
    '',
    t.plaintextSignatureLine1,
    t.plaintextSignatureLine2,
  ].join('\n');

  return { subject, html, text };
}

module.exports = { buildOrderEmail, formatPrice };

const BRAND_DARK = '#5C3D20';
const BRAND_GOLD = '#C9963A';
const BG = '#f5f2ec';
const TEXT = '#2b2b2b';
const MUTED = '#666';
const BORDER = '#e5e0d6';

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDKK(cents) {
  const kr = cents / 100;
  if (Number.isInteger(kr)) {
    return `${kr.toLocaleString('da-DK')} kr`;
  }
  return kr.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kr';
}

function renderItemsHtml(items) {
  return items.map(item => `
    <tr>
      <td width="80" style="padding:16px 16px 16px 0;vertical-align:top;">
        ${item.imageUrl ? `<img src="${esc(item.imageUrl)}" alt="" width="64" height="64" style="display:block;border-radius:4px;">` : ''}
      </td>
      <td style="padding:16px 0;vertical-align:top;">
        <div style="font-size:15px;font-weight:bold;color:${TEXT};">${esc(item.name)}</div>
        <div style="font-size:13px;color:${MUTED};margin-top:4px;">Antal: ${item.quantity}</div>
      </td>
      <td style="padding:16px 0;vertical-align:top;text-align:right;white-space:nowrap;">
        <div style="font-size:15px;color:${TEXT};">${formatDKK(item.priceCents * item.quantity)}</div>
      </td>
    </tr>
  `).join('');
}

function renderAddressHtml(addr) {
  if (!addr) return '';
  return `
    <tr><td style="padding:24px 32px 16px 32px;">
      <div style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:${BRAND_GOLD};font-weight:bold;margin-bottom:8px;">Leveringsadresse</div>
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
}) {
  const subject = `Tak for din ordre hos Making Art DIY — ordre #${orderRef}`;
  const greeting = customerName ? `Hej ${esc(customerName)},` : 'Hej,';

  const html = `<!DOCTYPE html>
<html lang="da">
<head><meta charset="utf-8"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:Helvetica,Arial,sans-serif;color:${TEXT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:${BRAND_DARK};padding:32px 32px 24px 32px;text-align:center;">
          <div style="color:${BRAND_GOLD};font-size:14px;letter-spacing:2px;text-transform:uppercase;">Making Art DIY</div>
          <h1 style="color:#ffffff;font-size:24px;margin:12px 0 0 0;font-weight:normal;">Tak for din ordre!</h1>
        </td></tr>
        <tr><td style="padding:32px 32px 16px 32px;">
          <p style="margin:0 0 12px 0;font-size:16px;line-height:1.5;">${greeting}</p>
          <p style="margin:0 0 12px 0;font-size:16px;line-height:1.5;">Tak for din ordre hos Making Art DIY. Vi har modtaget din betaling og går i gang med at gøre pakken klar.</p>
          <p style="margin:0;font-size:14px;color:${MUTED};">Ordrenummer: <strong style="color:${BRAND_DARK};">#${esc(orderRef)}</strong></p>
        </td></tr>
        <tr><td style="padding:16px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid ${BRAND_GOLD};">
            ${renderItemsHtml(items)}
          </table>
        </td></tr>
        <tr><td style="padding:8px 32px 16px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${BORDER};">
            <tr>
              <td style="padding:8px 0;font-size:14px;color:${MUTED};">Subtotal</td>
              <td style="padding:8px 0;font-size:14px;text-align:right;">${formatDKK(subtotalCents)}</td>
            </tr>
            <tr>
              <td style="padding:0 0 8px 0;font-size:14px;color:${MUTED};">Fragt</td>
              <td style="padding:0 0 8px 0;font-size:14px;text-align:right;">${shippingCents === 0 ? 'Gratis' : formatDKK(shippingCents)}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 0 0;border-top:2px solid ${BRAND_GOLD};font-size:16px;font-weight:bold;color:${BRAND_DARK};">Total</td>
              <td style="padding:12px 0 0 0;border-top:2px solid ${BRAND_GOLD};font-size:16px;font-weight:bold;text-align:right;color:${BRAND_DARK};">${formatDKK(totalCents)}</td>
            </tr>
          </table>
        </td></tr>
        ${renderAddressHtml(shippingAddress)}
        <tr><td style="padding:24px 32px 32px 32px;border-top:1px solid ${BORDER};">
          <p style="margin:0 0 8px 0;font-size:13px;color:${MUTED};line-height:1.5;">Levering forventes inden for 3-7 hverdage. Du hører fra os når pakken er afsendt.</p>
          <p style="margin:0 0 8px 0;font-size:13px;color:${MUTED};line-height:1.5;">Priserne er ikke tillagt moms (jf. momslovens § 48).</p>
          <p style="margin:12px 0 0 0;font-size:13px;color:${MUTED};line-height:1.5;">Spørgsmål? Svar bare på denne mail eller skriv til <a href="mailto:info@makingartdiy.dk" style="color:${BRAND_DARK};">info@makingartdiy.dk</a>.</p>
        </td></tr>
        <tr><td style="background:${BRAND_DARK};padding:16px 32px;text-align:center;">
          <div style="color:${BRAND_GOLD};font-size:12px;">Making Art DIY · makingartdiy.dk</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const itemsText = items
    .map(i => `${i.name} × ${i.quantity} — ${formatDKK(i.priceCents * i.quantity)}`)
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
    'Tak for din ordre hos Making Art DIY!',
    '',
    customerName ? `Hej ${customerName},` : 'Hej,',
    '',
    'Vi har modtaget din betaling og går i gang med at gøre pakken klar.',
    '',
    `Ordrenummer: #${orderRef}`,
    '',
    '--- DINE VARER ---',
    itemsText,
    '',
    `Subtotal: ${formatDKK(subtotalCents)}`,
    `Fragt: ${shippingCents === 0 ? 'Gratis' : formatDKK(shippingCents)}`,
    `Total: ${formatDKK(totalCents)}`,
    ...(addressText ? ['', '--- LEVERINGSADRESSE ---', addressText] : []),
    '',
    'Levering forventes inden for 3-7 hverdage.',
    'Priserne er ikke tillagt moms (jf. momslovens § 48).',
    '',
    'Spørgsmål? Svar bare på denne mail eller skriv til info@makingartdiy.dk.',
    '',
    'Making Art DIY',
    'makingartdiy.dk',
  ].join('\n');

  return { subject, html, text };
}

module.exports = { buildOrderEmail, formatDKK };

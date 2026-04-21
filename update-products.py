#!/usr/bin/env python3
"""Build product cards from _products/*.md into shop.html and emit products.json."""
import json
import os
import re
from html import escape
import yaml

CATEGORY_KEY = {'børn': 'born', 'voksne': 'voksne', 'erhverv': 'erhverv'}
CATEGORY_EN = {'Børn': 'Children', 'Voksne': 'Adults', 'Erhverv': 'Business'}

INTERNAL_KEYS = {'internal_files', 'internal_notes'}

SKU_PATTERN = re.compile(r'^MAD-[A-Z0-9]+-[0-9]{3}$')


def load_products():
    out = []
    seen_slugs = set()
    seen_skus = {}
    for fname in sorted(os.listdir('_products')):
        if not fname.endswith('.md'):
            continue
        slug = fname[:-3]
        if slug in seen_slugs:
            raise ValueError(f'Duplicate slug: {slug}')
        seen_slugs.add(slug)
        with open(f'_products/{fname}', encoding='utf-8') as f:
            raw = f.read()
        m = re.match(r'^---\s*\n(.*?)\n---\s*', raw, re.DOTALL)
        if not m:
            continue
        data = yaml.safe_load(m.group(1)) or {}

        sku = str(data.get('sku') or '').strip()
        if not sku:
            raise ValueError(f"Produkt '{slug}' mangler påkrævet SKU")
        if not SKU_PATTERN.match(sku):
            raise ValueError(
                f"Produkt '{slug}' har ugyldig SKU '{sku}' — "
                f"forventet format: MAD-XXXX-001 (fx MAD-VASE-001)"
            )
        if sku in seen_skus:
            raise ValueError(
                f"Duplikeret SKU '{sku}' — bruges af både '{slug}' og '{seen_skus[sku]}'"
            )
        seen_skus[sku] = slug

        if data.get('published', True):
            data['sku'] = sku
            data['slug'] = slug
            data['images'] = collect_images(data)
            data['internal_files_count'] = len(data.get('internal_files') or [])
            out.append(data)
    return out


def public_product(p):
    return {k: v for k, v in p.items() if k not in INTERNAL_KEYS}


def collect_images(data):
    primary = str(data.get('image', '') or '').strip()
    extras_raw = data.get('extra_images') or []
    if not isinstance(extras_raw, list):
        extras_raw = []
    extras = []
    for item in extras_raw:
        if isinstance(item, dict):
            v = str(item.get('image', '') or '').strip()
        else:
            v = str(item or '').strip()
        if v and v not in extras and v != primary:
            extras.append(v)
    result = []
    if primary:
        result.append(primary)
    result.extend(extras)
    return result


def render_card(p):
    slug = escape(str(p.get('slug', '')).strip(), quote=True)
    title_da_raw = str(p.get('title', '')).strip()
    title_en_raw = str(p.get('title_en') or '').strip() or title_da_raw
    title_da = escape(title_da_raw, quote=True)
    title_en = escape(title_en_raw, quote=True)
    category_da_raw = str(p.get('category', '')).strip()
    category_en_raw = CATEGORY_EN.get(category_da_raw, category_da_raw)
    category_da = escape(category_da_raw, quote=True)
    category_en = escape(category_en_raw, quote=True)
    cat_key = CATEGORY_KEY.get(category_da_raw.lower(), 'voksne')
    desc_da_raw = str(p.get('description', '')).strip()
    desc_en_raw = str(p.get('description_en') or '').strip() or desc_da_raw
    desc_da = escape(desc_da_raw, quote=True)
    desc_en = escape(desc_en_raw, quote=True)
    try:
        price = int(p.get('price') or 0)
    except (TypeError, ValueError):
        price = 0
    img = escape(str(p.get('image', '')).strip(), quote=True)

    if img:
        img_html = (
            f'<img src="{img}" alt="{title_da}" loading="lazy" decoding="async" '
            f'onerror="this.parentElement.innerHTML=\'📸 Billede kommer snart\'">'
        )
    else:
        img_html = '📸 Billede kommer snart'

    detail_url = f'produkt.html?slug={slug}'

    return (
        f'<article class="product-card" data-category="{cat_key}" data-slug="{slug}">'
        f'<a href="{detail_url}" class="product-card-link" tabindex="-1" aria-hidden="true">'
        f'<div class="product-img">{img_html}</div>'
        f'</a>'
        f'<div class="product-info">'
        f'<span class="product-badge" data-da="{category_da}" data-en="{category_en}">{category_da}</span>'
        f'<a href="{detail_url}" class="product-name-link">'
        f'<h3 class="product-name" data-da="{title_da}" data-en="{title_en}">{title_da}</h3>'
        f'</a>'
        f'<p class="product-desc" data-da="{desc_da}" data-en="{desc_en}">{desc_da}</p>'
        f'<div class="product-footer">'
        f'<span class="product-price">{price} kr</span>'
        f'<button type="button" class="add-to-cart" '
        f'data-title="{title_da}" data-price="{price}">Læg i kurv</button>'
        f'</div></div></article>'
    )


def main():
    products = load_products()
    blocks = '\n'.join(render_card(p) for p in products)
    shop = open('shop.html', encoding='utf-8').read()
    new = re.sub(
        r'<!-- PRODUCTS-START -->.*?<!-- PRODUCTS-END -->',
        f'<!-- PRODUCTS-START -->\n{blocks}\n<!-- PRODUCTS-END -->',
        shop, flags=re.DOTALL,
    )
    with open('shop.html', 'w', encoding='utf-8') as f:
        f.write(new)
    with open('products.json', 'w', encoding='utf-8') as f:
        json.dump([public_product(p) for p in products], f, ensure_ascii=False, indent=2)
    print(f'✅ {len(products)} produkter opdateret!')


if __name__ == '__main__':
    main()

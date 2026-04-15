import os, re

products = []
for f in os.listdir('_products'):
    if not f.endswith('.md'): continue
    txt = open(f'_products/{f}').read()
    d, desc, in_d = {}, [], False
    for line in txt.split('\n'):
        if line == '---': continue
        if line.startswith('description: |-'): in_d = True; continue
        if in_d:
            if line.startswith(' '): desc.append(line.strip()); continue
            else: in_d = False; d['description'] = ' '.join(desc)
        if ':' in line and not in_d:
            k, _, v = line.partition(':')
            d[k.strip()] = v.strip()
    if desc and 'description' not in d: d['description'] = ' '.join(desc)
    if d.get('published','true') == 'true': products.append(d)

cats = {'børn':'born','voksne':'voksne','erhverv':'erhverv'}
blocks = ''
for p in products:
    t = p.get('title','')
    pr = p.get('price','0')
    c = cats.get(p.get('category','').lower(),'voksne')
    desc = p.get('description','')
    img = p.get('image','')
    img_html = f'<img src="{img}" alt="{t}" onerror="this.parentElement.innerHTML=\'📸 Billede kommer snart\'">' if img else '📸 Billede kommer snart'
    blocks += f'<div class="product-card" data-category="{c}"><div class="product-img">{img_html}</div><div class="product-info"><span class="product-badge">{p.get("category","")}</span><div class="product-name">{t}</div><div class="product-desc">{desc}</div><div class="product-footer"><span class="product-price">{pr} kr</span><button class="add-to-cart" onclick="addToCart(\'{t}\',{pr},null)">Læg i kurv</button></div></div></div>\n'

shop = open('shop.html').read()
new = re.sub(r'<!-- PRODUCTS-START -->.*?<!-- PRODUCTS-END -->', f'<!-- PRODUCTS-START -->\n{blocks}<!-- PRODUCTS-END -->', shop, flags=re.DOTALL)
open('shop.html','w').write(new)
print(f'✅ {len(products)} produkter opdateret!')

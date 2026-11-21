"""Native SVG contact sheet of the eight finished design references."""
from pathlib import Path
from html import escape
from build import ROOT, PRODUCTS, Type

out=ROOT/'previews'
out.mkdir(exist_ok=True)
t=Type()
parts=['<rect width="2000" height="2600" fill="#F1F6FA"/>']
parts.append(t.text('RAMCAD / АЙСБЕРГ',60,63,16,weight=700,spacing=2))
parts.append(t.text('Восемь товаров. Один стиль.',60,134,49,serif=True))
parts.append(t.text('Рыба на льду соответствует изображению на каждой этикетке.',60,177,22,'#416B87'))
for i,p in enumerate(PRODUCTS):
    x=60+(i%2)*950;y=220+(i//2)*575
    parts.append(f'<rect x="{x}" y="{y}" width="930" height="550" rx="20" fill="#FFFFFF" stroke="#CDDCE6"/>')
    parts.append(f'<image href="../{p["preview"]}" x="{x+12}" y="{y+12}" width="906" height="453"/>')
    title='Сельдь '+p['subtitle']
    parts.append(t.text(title,x+24,y+503,25,serif=True,max_width=710))
    parts.append(t.text(p['format'],x+24,y+533,15,'#416B87'))
    parts.append(f'<rect x="{x+775}" y="{y+480}" width="130" height="42" rx="21" fill="{p["accentTint"]}"/>')
    parts.append(t.text(p['weightLabel'],x+799,y+509,21,weight=700))
parts.append(t.text('8 макетов · 8 страниц · отдельные слои · общий конструктор · задание для Claude',60,2561,20,'#416B87'))
svg='<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2600" viewBox="0 0 2000 2600"><title>Восемь карточек Айсберг — RAMCAD</title><defs>'+''.join(t.defs.values())+'</defs>'+''.join(parts)+'</svg>'
(out/'collection-overview.svg').write_text(svg)
print('Overview SVG created')

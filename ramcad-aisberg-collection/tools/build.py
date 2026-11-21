"""Build the eight editable HTML pages and vector layout references.

No photograph is recolored or repainted here. The code places supplied layers,
as an HTML/SVG layout engine does. Plates were removed with image generation.
The exact original label is a separate image on the packaging component.
"""
from pathlib import Path
from html import escape
import json, os, re
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = json.loads((ROOT / "products.json").read_text())
TEMPLATE = ROOT / "tools/product-template.html"

def relative(asset, document):
    return Path(os.path.relpath(ROOT / asset, document.parent)).as_posix()

def composition_style(p):
    fx,fy,fw,_=p['fishBox'];px,py,pw,_=p['packBox']
    return f'--fish-x:{fx/1774*100:.4f}%;--fish-y:{fy/887*100:.4f}%;--fish-width:{fw/1774*100:.4f}%;--pack-x:{px/1774*100:.4f}%;--pack-y:{py/887*100:.4f}%;--pack-width:{pw/1774*100:.4f}%;--variant-tint:{p["accentTint"]};--gold:{p["accent"]}'

def photo_html(p,mobile=False):
    mode='mobile' if mobile else 'desktop'
    bg='<img class="composition-backdrop" src="../../assets/studio/ice-background.png" width="1774" height="887" alt="">' if mobile else ''
    return f'''<div class="photo-composition photo-composition--{mode}" aria-hidden="true">
      {bg}
      <div class="photo-pack"><img class="pack-base" src="../../assets/packaging/tub-blank.png" width="1254" height="1254" alt=""><img class="pack-label" src="label.png" alt=""><span class="pack-sheen"></span></div>
      <img class="photo-fish" src="../../{p['fish']}" alt="">
    </div>'''

def make_page(p):
    h=TEMPLATE.read_text()
    h=h.replace('href="assets/','href="../../assets/').replace('src="assets/','src="../../assets/')
    h=h.replace('href="tokens.css"','href="../../styles/tokens.css"').replace('href="styles.css"','href="../../styles/page-base.css"')
    h=h.replace('<script src="site-config.js" defer></script>','<link rel="stylesheet" href="../../styles/collection.css"><script src="../../scripts/site-config.js" defer></script>')
    h=h.replace('<script src="app.js" defer></script>','<script src="../../scripts/page.js" defer></script>')
    h=h.replace('data-gallery="scene"','data-gallery="scene" style="'+composition_style(p)+'"',1)
    h=h.replace('../../assets/images/hero-scene-clean.png','../../assets/studio/ice-background.png')
    h=h.replace('<!-- Слой 3: отдельный редактируемый векторный паттерн. -->',photo_html(p)+'\n<!-- Отдельный векторный паттерн. -->')
    h=re.sub(r'<div class="mobile-scene".*?</div>',photo_html(p,True),h,flags=re.S)
    h=re.sub(r'<div class="gallery-cutout".*?</div>','',h,flags=re.S)
    h=h.replace('Сельдь кусочками на колотом льду и упаковка Айсберг.', 'Сельдь '+escape(p['subtitle'])+' на колотом льду рядом с упаковкой Айсберг.')
    h=h.replace('Сельдь кусочками в масле, 500 г — RAMCAD',f'Сельдь {escape(p["subtitle"])}, {p["weightLabel"]} — RAMCAD')
    h=h.replace('Сельдь Айсберг — филе кусочками в масле, 500 г.',f'Сельдь Айсберг — {escape(p["subtitle"])}, {p["weightLabel"]}.')
    h=h.replace('<span class="title-detail">кусочками в масле</span>',f'<span class="title-detail">{escape(p["subtitle"])}</span>')
    h=h.replace('Филе сельди в масле. Масса нетто — 500 г.',escape(p['shortDescription']))
    h=h.replace('<dd>Филе кусочками</dd>',f'<dd>{escape(p["format"])}</dd>')
    h=h.replace('<dd>500 г</dd>',f'<dd>{p["weightLabel"]}</dd>')
    h=h.replace('Сельдь филе кусочками в масле.<br>',escape(p['about'])+'<br>')
    h=h.replace('Сельдь кусочками в масле.</p>',f'Сельдь {escape(p["subtitle"])}.</p>')
    h=h.replace('aria-label="Кусочки сельди на льду"', 'aria-label="Рыба на льду крупным планом"')
    h=h.replace('АЙСБЕРГ · 500 Г',f'АЙСБЕРГ · {p["weightGrams"]} Г')
    h=h.replace('<span aria-current="page">Сельдь в масле</span>',f'<span aria-current="page">Сельдь · {p["weightLabel"]}</span>')
    h=h.replace('href="/catalog/"','href="../../index.html#catalog"').replace('href="/"','href="../../index.html"')
    (ROOT/p['page']).write_text(h)

# Native vector type. Outlines keep PNG reference typography deterministic.
class Type:
    def __init__(self):
        self.serif=TTFont(ROOT/'assets/fonts/Prata-Regular.ttf')
        self.sans=TTFont(ROOT/'assets/fonts/Manrope-Variable.ttf')
        self.defs={}
    def glyph(self,char,serif,weight):
        font=self.serif if serif else self.sans
        key=f'g_{"p" if serif else "m"}_{weight}_{ord(char)}'
        glyph_name=font.getBestCmap().get(ord(char))
        if not glyph_name: raise ValueError(f'Missing glyph {char!r}')
        glyphs=font.getGlyphSet(location=None if serif else {'wght':weight})
        if key not in self.defs:
            pen=SVGPathPen(glyphs);glyphs[glyph_name].draw(pen)
            self.defs[key]=f'<path id="{key}" d="{pen.getCommands()}"/>'
        return key,glyphs[glyph_name].width,font['head'].unitsPerEm
    def width(self,text,size,serif=False,weight=400,spacing=0):
        return sum(self.glyph(c,serif,weight)[1]/self.glyph(c,serif,weight)[2]*size for c in text)+max(0,len(text)-1)*spacing
    def text(self,text,x,y,size,fill='#082F46',serif=False,weight=400,spacing=0,max_width=None):
        width=self.width(text,size,serif,weight,spacing)
        if max_width and width>max_width:
            size*=max_width/width
        uses=[];cursor=x
        for c in text:
            key,advance,upm=self.glyph(c,serif,weight)
            uses.append(f'<use href="#{key}" transform="translate({cursor:.3f},{y}) scale({size/upm:.7f},{-size/upm:.7f})"/>')
            cursor+=advance/upm*size+spacing
        return f'<g fill="{fill}" aria-label="{escape(text,quote=True)}">'+''.join(uses)+'</g>'

def image(asset,box,doc,extra=''):
    x,y,w,h=box
    return f'<image href="{relative(asset,doc)}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="none" {extra}/>'

def pack(p,doc):
    x,y,w,h=p['packBox'];lx,ly,lw,lh=p['labelBoxInPack'];s=w/1254
    bx,by,bw,bh=x+lx*s,y+ly*s,lw*s,lh*s
    clip=f'pack-label-{p["id"]}'
    return (f'<defs><clipPath id="{clip}"><ellipse cx="{bx+bw/2}" cy="{by+bh/2}" rx="{bw/2}" ry="{bh/2}"/></clipPath></defs>'
       +image('assets/packaging/tub-blank.png',[x,y,w,h],doc)
       +image(p['label'],[bx,by,bw,bh],doc,f'clip-path="url(#{clip})"'))

def photo(p,doc):
    return image('assets/studio/ice-background.png',[0,0,1774,887],doc)+pack(p,doc)+image(p['fish'],p['fishBox'],doc,'filter="url(#fish-shadow)"')

def shape_rect(x,y,w,h,fill='url(#glass)',rx=18,stroke='#FFFFFF',opacity=None):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="1.3"'+(f' opacity="{opacity}"' if opacity else '')+'/>'

def arrow(x,y,d,color='#082F46',scale=1):
    return f'<path d="{d}" transform="translate({x},{y}) scale({scale})" fill="none" stroke="{color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'

DEFS='''<linearGradient id="glass" x2="1" y2="1"><stop stop-color="#F4FAFF" stop-opacity=".94"/><stop offset="1" stop-color="#DDECF6" stop-opacity=".90"/></linearGradient><filter id="fish-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#092F46" flood-opacity=".18"/></filter>'''

def mockup(p):
    doc=ROOT/'products'/p['id']/'layout.svg';t=Type();parts=[photo(p,doc)]
    parts.append(image('assets/patterns/waves.svg',[965,0,809,887],doc,'opacity=".35"'))
    parts.append(shape_rect(100,12,163,53,rx=23));parts.append(t.text('RAMCAD',118,47,27,serif=True))
    parts.append(shape_rect(678,12,418,53,rx=27))
    parts.append(shape_rect(778,17,96,43,p['accentTint'],22,stroke='none'))
    for txt,x in [('Главная',700),('Каталог',795),('О компании',890),('Контакты',1009)]:parts.append(t.text(txt,x,44,13,weight=500))
    parts.append(shape_rect(1483,12,190,50,'#082F46',25,opacity='.72'))
    parts.append(t.text('8 (938) 904-23-23',1505,44,15,'#FFFFFF',weight=700))
    parts.append(t.text('Главная',100,108,13,'#345F7B'))
    parts.append(arrow(169,98,'m4 1 4 5-4 5',scale=.7))
    parts.append(t.text('Каталог',190,108,13,'#345F7B'))
    parts.append(arrow(259,98,'m4 1 4 5-4 5',scale=.7))
    parts.append(t.text(f'Сельдь · {p["weightLabel"]}',280,108,13,'#345F7B'))
    parts.append(t.text('АЙСБЕРГ',114,158,16,weight=700))
    for i in range(3):parts.append(f'<circle cx="{103+i*22}" cy="825" r="{5.5 if i==0 else 4.5}" fill="{"#082F46" if i==0 else "#86A8C2"}"/>')
    parts.append(shape_rect(968,131,704,246))
    parts.append(t.text('АЙСБЕРГ · РЫБНЫЕ ПРЕСЕРВЫ',997,169,14,'#416B87',weight=500))
    parts.append(t.text('Сельдь',995,244,72,serif=True))
    parts.append(t.text(p['subtitle'],997,307,57,serif=True,spacing=-.6,max_width=643))
    parts.append(t.text(p['shortDescription'],997,345,18,'#416B87',max_width=643))
    parts.append(shape_rect(968,389,704,135))
    parts.append(t.text('Для вашего магазина, кафе или сети',997,417,14,'#416B87'))
    parts.append(shape_rect(994,427,651,51,'#003E50',26,stroke='none'))
    parts.append(t.text('Узнать оптовую цену',1016,459,15,'#FFFFFF',weight=600))
    parts.append(arrow(1606,440,'M2 16 16 2M2 2h14v14','#FFFFFF'))
    parts.append(t.text('+7 (938) 904-23-23',997,504,15,weight=700))
    facts=[('Бренд','Айсберг'),('Формат',p['format']),('Масса нетто',p['weightLabel'])]
    for i,(label,value) in enumerate(facts):
        x=968+i*239
        parts.append(shape_rect(x,536,226,78));parts.append(t.text(label,x+27,566,14,'#416B87'))
        parts.append(t.text(value,x+27,595,21,serif=True,max_width=182))
    parts.append(shape_rect(968,626,704,127))
    parts.append(t.text('О продукте',997,661,18,weight=700))
    parts.append(arrow(1626,649,'m1 8 7-7 7 7'))
    parts.append(t.text(p['about'],997,700,17,'#416B87',max_width=640))
    parts.append(t.text('Состав и условия хранения — на упаковке.',997,727,17,'#416B87',max_width=640))
    parts.append(shape_rect(968,765,704,51))
    parts.append(t.text('Заказ и поставка',997,797,17,weight=700))
    parts.append(arrow(1626,784,'m1 1 7 7 7-7'))
    parts.append(arrow(975,832,'M20 10H2m7-7-7 7 7 7','#FFFFFF'))
    parts.append(t.text('Весь каталог',1015,849,14,'#FFFFFF'))
    parts.append('<path d="M1015 852h100" stroke="#FFFFFF" stroke-width=".7"/>')
    defs=DEFS+''.join(t.defs.values())
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1774 887" width="1774" height="887"><title>{escape(p["title"]+" "+p["subtitle"]+" · "+p["weightLabel"])}</title><defs>{defs}</defs>'+''.join(parts)+'</svg>'
    doc.write_text(svg)
    # Photo layers are an editable vector composition, with linked source assets.
    scene=ROOT/'products'/p['id']/'photo-layers.svg'
    scene.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1774 887" width="1774" height="887"><defs>{DEFS}</defs>'+photo(p,scene)+'</svg>')
    # Standalone packaging component at native size, original label as a layer.
    packdoc=ROOT/'products'/p['id']/'packshot.svg'
    pp=dict(p);pp['packBox']=[0,0,1254,1254]
    packdoc.write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254" width="1254" height="1254">'+pack(pp,packdoc)+'</svg>')

def catalog():
    cards=[]
    for p in PRODUCTS:
        cards.append(f'''<article class="product-tile"><a class="tile-image" href="{p['page']}"><img src="{p['preview']}" width="1774" height="887" loading="lazy" alt="Карточка: сельдь {escape(p['subtitle'])}, {p['weightLabel']}"></a><div class="tile-copy"><span class="tile-weight" style="background:{p['accentTint']}">{p['weightLabel']}</span><h2>Сельдь {escape(p['subtitle'])}</h2><div class="tile-links"><a href="{p['page']}">Открыть страницу ↗</a><a href="{p['preview']}" download>Макет PNG ↓</a><a href="constructor.html?product={p['id']}">Слои ↗</a></div></div></article>''')
    h='''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Айсберг — 8 карточек RAMCAD</title><link rel="stylesheet" href="styles/tokens.css"><link rel="stylesheet" href="styles/catalog.css"><link rel="icon" href="assets/brand/favicon.svg"></head><body><header><a class="wordmark" href="index.html">RAMCAD</a><a href="constructor.html">Конструктор слоёв ↗</a></header><main><div class="catalog-intro"><p class="eyebrow">КОЛЛЕКЦИЯ / 08 ТОВАРОВ</p><h1>Вся линейка.<br>В одном стиле.</h1><p>Сельдь «Айсберг»: рыба на льду соответствует изображению на каждой этикетке.</p><div class="intro-links"><a href="constructor.html">Открыть конструктор</a><a href="CLAUDE_PROMPT.md" download>Задание для Claude ↓</a></div></div><section class="catalog-grid" id="catalog">'''+''.join(cards)+'''</section></main><footer>RAMCAD · Конструктор восьми карточек · <a href="START_HERE.md" download>Инструкция ↓</a></footer></body></html>'''
    (ROOT/'index.html').write_text(h)

if __name__=='__main__':
    (ROOT/'scripts/products.js').write_text('window.RAMCAD_PRODUCTS = '+json.dumps(PRODUCTS,ensure_ascii=False,indent=2)+';\n')
    for p in PRODUCTS:
        (ROOT/'products'/p['id']/'product.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
        make_page(p);mockup(p)
    catalog()
    print('Built 8 product pages, 8 layouts, 8 photo compositions, 8 packaging components and catalog.')

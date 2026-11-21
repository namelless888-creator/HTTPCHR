"""Static integrity checks. This does not run a browser."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from collections import Counter
import hashlib,json,re,subprocess,xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
errors=[];references=0
products=json.loads((ROOT/'products.json').read_text())
expected={'herring-oil-180':180,'herring-oil-500':500,'herring-steaks-725':725,'herring-fillet-900':900,'herring-fillet-2000':2000,'herring-spices-180':180,'herring-spices-500':500,'herring-ruby-500':500}
def require(ok,message):
    if not ok: errors.append(message)
def check_ref(value,file):
    global references
    u=urlsplit(value)
    if u.scheme or value.startswith(('#','/')) or not u.path: return
    references+=1
    target=(file.parent/unquote(u.path)).resolve()
    require(target.is_file(),f'Missing reference: {file.relative_to(ROOT)} -> {value}')
class HTML(HTMLParser):
    def __init__(self,file):
        super().__init__();self.file=file;self.ids=[];self.h1=0
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if 'id' in attrs:self.ids.append(attrs['id'])
        if tag=='h1':self.h1+=1
        if tag=='img':require('alt' in attrs,f'Image without alt: {self.file}')
        for key in ('href','src'):
            if attrs.get(key):check_ref(attrs[key],self.file)

htmlfiles=[ROOT/'index.html',ROOT/'constructor.html']+[ROOT/p['page'] for p in products]
for file in htmlfiles:
    parser=HTML(file);parser.feed(file.read_text())
    require(parser.h1==1,f'Expected one h1: {file.name}')
    require(len(parser.ids)==len(set(parser.ids)),f'Duplicate ids: {file}')
for file in (ROOT/'styles').glob('*.css'):
    for url in re.findall(r'url\(["\']?([^\)"\']+)',file.read_text()):check_ref(url,file)
svgfiles=list(ROOT.rglob('*.svg'))
for file in svgfiles:
    tree=ET.parse(file)
    for el in tree.iter():
        for key,value in el.attrib.items():
            if key in ('href','{http://www.w3.org/1999/xlink}href'):check_ref(value,file)
require({p['id']:p['weightGrams'] for p in products}==expected,'SKU/weight mapping differs')
for p in products:
    require(json.loads((ROOT/'products'/p['id']/'product.json').read_text())==p,'Product JSON out of sync: '+p['id'])
    for key in ('fish','label','sourcePdf','page','preview','fishReferenceSource'):require((ROOT/p[key]).is_file(),p['id']+' missing '+key)
    text=(ROOT/p['page']).read_text()
    require(f'<dd>{p["weightLabel"]}</dd>' in text,p['id']+' incorrect weight')
    require(f'<dd>{p["format"]}</dd>' in text,p['id']+' incorrect format')
    require(f'src="../../{p["fish"]}"' in text,p['id']+' incorrect fish reference')
    require(text.count('src="label.png"')==2,p['id']+' desktop/mobile labels missing')
    require(len(p['fishBox'])==4 and all(isinstance(n,(int,float)) for n in p['fishBox']),p['id']+' invalid geometry')
    require('aria-label="Рыба на льду крупным планом"' in text,p['id']+' incorrect gallery label')
jsdata=(ROOT/'scripts/products.js').read_text()
require(json.loads(jsdata.removeprefix('window.RAMCAD_PRODUCTS = ').strip().removesuffix(';'))==products,'products.js out of sync')
for file in list((ROOT/'scripts').glob('*.js'))+list((ROOT/'tools').glob('*.cjs')):
    run=subprocess.run(['node','--check',str(file)],capture_output=True,text=True)
    require(run.returncode==0,f'JS syntax: {file.name}: {run.stderr}')
result={'status':'passed' if not errors else 'failed','products':len(products),'htmlPages':len(htmlfiles),'svgDocuments':len(svgfiles),'localReferences':references,'errors':errors,'browserTested':False}
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(1 if errors else 0)

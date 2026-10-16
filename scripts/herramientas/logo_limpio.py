"""Limpia el logo original de El Chico Naturista.

El PNG original (-recursos/logo-ECN.png, 1024 x 1024, RGB) trae pintado el fondo a
cuadros de "transparencia". Este script:
  1. rellena de blanco el fondo a cuadros dentro del sello (anillo, cielo y el hueco
     de la O de CHICO), partiendo de puntos semilla y sin tocar el dibujo;
  2. recorta el círculo con transparencia real fuera del anillo;
  3. guarda logo-512/192/64 en .png y .webp, y una imagen de control sobre fondo
     claro y sobre salvia para revisarlo a ojo.

Uso (requiere Pillow y numpy):
  python scripts/herramientas/logo_limpio.py -recursos/logo-ECN.png <carpeta_salida> <control.png>

Las coordenadas (centro 512, radio 420, semillas) son las de ese archivo de 1024 px;
con otro original hay que ajustarlas. A public/ se copiaron: img/logo-192.webp,
img/logo-512.png, img/logo-512.webp y favicon.png (= logo-64.png).
"""
import sys
import numpy as np
from PIL import Image, ImageDraw
from collections import deque
src, dst_dir, check = sys.argv[1], sys.argv[2], sys.argv[3]
im = np.array(Image.open(src).convert('RGB')).astype(int)
H, W, _ = im.shape
fondo = (im.max(2) - im.min(2) <= 10) & (im.min(2) >= 185)
vis = np.zeros((H, W), bool)
# semillas: anillo blanco exterior y cielo del círculo interior
semillas = [(480,170),(480,820),(860,330),(170,512),(700,700),(300,300)]
semillas += [(y, x) for y in range(300, 470, 12) for x in range(330, 700, 12)]
semillas += [(y, x) for y in range(340, 440, 4) for x in range(720, 820, 4)]  # hueco de la O de CHICO
q = deque()
for y, x in semillas:
    if fondo[y, x] and not vis[y, x]:
        vis[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y+dy, x+dx
        if 0 <= ny < H and 0 <= nx < W and not vis[ny, nx] and fondo[ny, nx]:
            vis[ny, nx] = True; q.append((ny, nx))
out = im.copy(); out[vis] = 255
# píxeles de borde: grises claros neutros que tocan el relleno pasan a blanco
borde = (im.max(2) - im.min(2) <= 14) & (im.min(2) >= 170) & ~vis
vec = np.zeros_like(vis)
vec[1:] |= vis[:-1]; vec[:-1] |= vis[1:]; vec[:, 1:] |= vis[:, :-1]; vec[:, :-1] |= vis[:, 1:]
out[borde & vec] = 255
img = Image.fromarray(out.astype('uint8'), 'RGB').convert('RGBA')
cx = cy = 512; r = 420; S = 4
m = Image.new('L', (W*S, H*S), 0)
ImageDraw.Draw(m).ellipse([(cx-r-1)*S, (cy-r-1)*S, (cx+r+1)*S, (cy+r+1)*S], fill=255)
img.putalpha(m.resize((W, H), Image.LANCZOS))
img = img.crop((cx-r-2, cy-r-2, cx+r+3, cy+r+3))
for s in (512, 192, 64):
    o = img.resize((s, s), Image.LANCZOS)
    o.save(f'{dst_dir}/logo-{s}.png'); o.save(f'{dst_dir}/logo-{s}.webp', quality=92)
b = Image.new('RGBA', (1024, 512), (47, 93, 80, 255)); b.paste(Image.new('RGBA', (512, 512), (247, 247, 247, 255)), (0, 0))
o = img.resize((480, 480), Image.LANCZOS); b.alpha_composite(o, (16, 16)); b.alpha_composite(o, (528, 16))
b.convert('RGB').save(check)
print('relleno', int(vis.sum()))

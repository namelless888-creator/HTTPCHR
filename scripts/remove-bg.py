"""Cut the flat background out of each product photo, keeping the package itself.
Flood-fills from the image border inward so an isolated similar-colored patch
inside the product (a highlight, a pale label) is never touched — only the
background region connected to the edges becomes transparent.
"""
import os
from collections import deque

import numpy as np
from PIL import Image

SRC_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "products")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "products-cutout")
TOLERANCE = 70  # max summed per-channel distance from the seed background color


def remove_background(path, out_path, tolerance=TOLERANCE):
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.int16)
    alpha = arr[:, :, 3].copy()
    visited = np.zeros((h, w), dtype=bool)

    border_seeds = set()
    for x in range(w):
        border_seeds.add((0, x))
        border_seeds.add((h - 1, x))
    for y in range(h):
        border_seeds.add((y, 0))
        border_seeds.add((y, w - 1))

    bg_samples = np.array([rgb[y, x] for (y, x) in list(border_seeds)[:40]])
    bg_color = np.median(bg_samples, axis=0)

    dq = deque()
    for (y, x) in border_seeds:
        if not visited[y, x]:
            visited[y, x] = True
            dq.append((y, x))

    while dq:
        y, x = dq.popleft()
        diff = np.abs(rgb[y, x] - bg_color).sum()
        if diff > tolerance:
            continue
        alpha[y, x] = 0
        if y > 0 and not visited[y - 1, x]:
            visited[y - 1, x] = True
            dq.append((y - 1, x))
        if y < h - 1 and not visited[y + 1, x]:
            visited[y + 1, x] = True
            dq.append((y + 1, x))
        if x > 0 and not visited[y, x - 1]:
            visited[y, x - 1] = True
            dq.append((y, x - 1))
        if x < w - 1 and not visited[y, x + 1]:
            visited[y, x + 1] = True
            dq.append((y, x + 1))

    arr[:, :, 3] = alpha
    Image.fromarray(arr, "RGBA").save(out_path)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    names = sorted(f for f in os.listdir(SRC_DIR) if f.lower().endswith(".png"))
    for name in names:
        remove_background(os.path.join(SRC_DIR, name), os.path.join(OUT_DIR, name))
        print("done", name)


if __name__ == "__main__":
    main()

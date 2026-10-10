from PIL import Image

base = "/home/z/my-project/scripts/"

# هدر دسکتاپ (لوگو در RTL سمت راست-بالا)
img = Image.open(base + "v4-desktop.png")
w, h = img.size
header = img.crop((w - 420, 0, w, 110)).resize((420 * 3, 110 * 3), Image.LANCZOS)
header.save(base + "v4-zoom-header.png")

# فوتر (لوگو سمت راست بلوک برند)
f = Image.open(base + "v4-footer.png")
fw, fh = f.size
footer = f.crop((fw - 420, 0, fw, 200)).resize((420 * 3, 200 * 3), Image.LANCZOS)
footer.save(base + "v4-zoom-footer.png")

# موبایل (لوگوی هدر موبایل + منو لازم نیست)
m = Image.open(base + "v4-mobile.png")
mw, mh = m.size
mob = m.crop((mw - 220, 0, mw, 100)).resize((220 * 4, 100 * 4), Image.LANCZOS)
mob.save(base + "v4-zoom-mobile.png")

print("done", img.size, f.size, m.size)

#!/bin/bash
# تولید تصاویر سینمایی با پالت سبز-سفید
cd /home/z/my-project

echo "[1/2] Generating cinematic hero background (1344x768)..."
z-ai image -p "Cinematic wide architectural photograph of a luxurious modern dental clinic interior, bright white space with elegant emerald green accent wall, sleek dental chair, floor-to-ceiling windows with soft golden morning light streaming in, green plants, minimalist premium architecture, serene calming atmosphere, shallow depth of field, professional photography, high quality, detailed" -o "./public/images/hero-bg.png" -s 1344x768

echo "[2/2] Regenerating OG image with green palette (1344x768)..."
z-ai image -p "Elegant wide banner photograph for a premium dental clinic website, modern bright clinic interior with white and emerald green palette, soft bokeh background, clean minimal composition with open space on the left side, cinematic soft lighting, professional, high quality" -o "./public/images/og-clinic.png" -s 1344x768

echo "DONE"
ls -la public/images/

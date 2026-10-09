#!/bin/bash
cd /home/z/my-project

z-ai image -p "Ultra modern luxurious dental clinic interior, bright and airy, white and soft teal mint green color palette, sleek dental chair, floor to ceiling windows with warm natural sunlight, indoor plants, minimalist high-end medical architecture, photorealistic professional architectural photography, calming serene atmosphere, high quality, detailed" -o "./public/images/hero-clinic.png" -s 864x1152 && echo "OK1"

z-ai image -p "Professional portrait photograph of a friendly confident Middle Eastern male dentist in his mid 40s with salt and pepper hair, wearing pristine white medical coat over teal scrubs, warm genuine smile, modern bright dental clinic softly blurred in background, soft natural window lighting, shallow depth of field, professional corporate headshot photography, high quality, detailed" -o "./public/images/doctor-1.png" -s 864x1152 && echo "OK2"

z-ai image -p "Professional portrait photograph of a friendly Middle Eastern female dentist in her mid 30s wearing an elegant soft teal hijab and pristine white medical coat, warm confident smile, modern bright dental clinic softly blurred in background, soft natural window lighting, professional corporate headshot photography, high quality, detailed" -o "./public/images/doctor-2.png" -s 864x1152 && echo "OK3"

z-ai image -p "Professional portrait photograph of a cheerful young Middle Eastern male dentist in his early 30s with dark hair and trimmed beard, wearing pristine white medical coat over light teal scrubs, friendly approachable smile, modern bright dental clinic softly blurred background, soft natural lighting, professional corporate headshot photography, high quality, detailed" -o "./public/images/doctor-3.png" -s 864x1152 && echo "OK4"

z-ai image -p "Wide banner photograph of elegant modern dental clinic reception lobby, white and teal mint palette, curved reception desk, soft ambient lighting, green plants, spotless minimalist luxury medical interior, photorealistic architectural photography, high quality" -o "./public/images/og-clinic.png" -s 1440x720 && echo "OK5"

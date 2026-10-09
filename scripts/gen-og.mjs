import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const response = await zai.images.generations.create({
    prompt:
      'Wide banner photograph of an elegant modern dental clinic reception lobby, white and teal mint color palette, curved reception desk, soft ambient lighting, green plants, spotless minimalist luxury medical interior design, photorealistic architectural photography, high quality, detailed',
    size: '1408x736',
  });
  const buffer = Buffer.from(response.data[0].base64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/images/og-clinic.png', buffer);
  console.log('OG image saved:', buffer.length, 'bytes');
}

main().catch((e) => {
  console.error('failed:', e.message);
  process.exit(1);
});

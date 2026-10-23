import { mkdir, writeFile } from 'node:fs/promises';

const origin = 'https://wdphst.vercel.app/assets/wdphost-logo-G0NNk-OA.png';
const destination = 'public/wdphost-logo-original.png';

async function restoreOriginalLogo() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(origin, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'WDPHosting-BrandMigration/1.0' },
    });
    if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('image/png')) throw new Error(`Unexpected image type: ${contentType}`);
    const logo = Buffer.from(await response.arrayBuffer());
    if (logo.length < 2000 || logo.length > 5_000_000 || logo.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
      throw new Error('The downloaded file is not a valid WDP Hosting PNG asset');
    }
    await mkdir('public', { recursive: true });
    await writeFile(destination, logo);
    console.log(`WDP Hosting: original PNG restored locally (${logo.length} bytes) from older WDP Vercel deployment.`);
  } catch (error) {
    // Keep the site deployable. The header falls back to the archived original SVG.
    console.warn(`WDP Hosting: could not restore original PNG: ${error.message}; archived SVG fallback stays available.`);
  } finally {
    clearTimeout(timeout);
  }
}

await restoreOriginalLogo();

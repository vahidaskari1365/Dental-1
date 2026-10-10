import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const msgs = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") msgs.push(`[${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => msgs.push(`[pageerror] ${e.message}`));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const hydr = msgs.filter((m) => m.includes("hydrated") || m.includes("hydration"));
for (const m of hydr) {
  console.log("=== HYDRATION MESSAGE (full) ===");
  console.log(m.slice(0, 4000));
}
if (!hydr.length) console.log("NO HYDRATION ERRORS");
await browser.close();

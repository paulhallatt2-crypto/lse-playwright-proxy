import playwright from "playwright";

export default async function handler(request, response) {
  try {
    const browser = await playwright.chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto("https://www.lse.co.uk/share-prices/recent-directors-deals.html", {
      waitUntil: "networkidle",
    });

    await page.waitForSelector("table tbody tr");

    const rows = await page.$$eval("table tbody tr", trs =>
      trs.map(tr =>
        Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim())
      )
    );

    await browser.close();

    response.setHeader("Content-Type", "application/json");
    response.status(200).send(JSON.stringify({ rows }));
  } catch (err) {
    console.error(err);
    response.status(500).send("Playwright error");
  }
}

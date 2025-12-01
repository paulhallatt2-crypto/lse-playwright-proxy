import playwright from "playwright";

export default async function handler(request, response) {
  try {
    const browser = await playwright.chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    // Navigate to the LSE Directors Deals page
    await page.goto("https://www.lse.co.uk/share-prices/recent-directors-deals.html", {
      waitUntil: "networkidle"
    });

    // Wait for table rows
    await page.waitForSelector("table tbody tr");

    // Extract the table
    const rows = await page.$$eval("table tbody tr", trs =>
      trs.map(tr =>
        Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim())
      )
    );

    await browser.close();

    // Return as JSON
    response.setHeader("Content-Type", "application/json");
    response.status(200).send(JSON.stringify({ rows }));
  } catch (err) {
    console.error(err);
    response.status(500).send("Playwright error");
  }
}

const playwright = require("@playwright/test");
const fs = require("node:fs/promises");

(async () => {
  const browser = await playwright.chromium.launch({
    headless: true,
  });
  const context = await browser.newContext({ locale: "en-US" });

  const categories = [
    "aead_encryption_functions",
    "aggregate_functions",
    "approximate_aggregate_functions",
    "array_functions",
    "bit_functions",
    "table-functions-built-in",
    "conversion_functions",
    "date_functions",
    "datetime_functions",
    "debugging_functions",
    "federated_query_functions",
    "geography_functions",
    "hash_functions",
    "hll_functions",
    "interval_functions",
    "json_functions",
    "mathematical_functions",
    "navigation_functions",
    "net_functions",
    "numbering_functions",
    "search_functions",
    "security_functions",
    "statistical_aggregate_functions",
    "string_functions",
    "time_functions",
    "timestamp_functions",
    "utility-functions",
  ];

  for (const category of categories) {
    const url = `https://cloud.google.com/bigquery/docs/reference/standard-sql/${category}`;
    const filepath = `${process.cwd()}/list/${category}.txt`;
    const page = await context.newPage();

    await page.goto(url);
    const elements = await page.getByRole("navigation", {
      name: "on this page",
    });
    const functions = await elements.locator("ul>li");
    const count = await functions.count();
    await fs.writeFile(`${filepath}`, `total count: ${count - 1} at ${url}\n`);

    const func_names = await functions.allInnerTexts();
    for (const name of func_names) {
      if (name == "On this page") {
        continue;
      }
      await fs.appendFile(`${filepath}`, `- [ ] ${name}\n`);
    }
    console.info(`successfully generate: ${filepath}`);
  }

  await browser.close();
})();

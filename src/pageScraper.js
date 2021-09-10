const secrets = require("./secrets");

const scraperObject = {
  url: "https://online.fh-joanneum.at/",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);
    await page.waitForSelector("input[name='username']", { visible: true });
    await page.type("input[name='username']", secrets.username);
    await page.type("input[name='password']", secrets.password);
    await page.click("#id_brm-pm-dtop_login_submitbutton");
  },
};

module.exports = scraperObject;

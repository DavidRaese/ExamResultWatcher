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
    await page.click("#id_brm-pm-dtop_login_submitbutton"); // flaky

    // go to personal homescreen
    await page.waitForNavigation();
    await page.waitForSelector("#access-name-co_loc_zug_44698-st", {
      visible: true,
    }); // flaky
    await page.click("#access-name-co_loc_zug_44698-st"); // flaky

    // got to scores page
    await page.waitForSelector("ca-list-entry", {
      visible: true,
    });
    let currentNumberOfScores = await page.evaluate(() => {
      return document.querySelectorAll("ca-list-entry").length;
    });

    if (secrets.numberOfScores === currentNumberOfScores) {
      console.log("No new scores");
    }
  },
};

module.exports = scraperObject;

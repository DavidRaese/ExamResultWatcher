const secrets = require("./secrets");
const fs = require("fs");
const dayjs = require("dayjs");

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

    if (secrets.numberOfScores == -1) {
      updateNumberOfScores(currentNumberOfScores);
      appendToLogFile(
        `Initial number of scores where set to ${currentNumberOfScores}`
      );
    } else if (secrets.numberOfScores < currentNumberOfScores) {
      updateNumberOfScores(currentNumberOfScores);
      appendToLogFile(
        `FOUND NEW RESULT!!!. Number of results were set to ${currentNumberOfScores} in secrets.js`
      );
    } else {
      appendToLogFile(`no new results`);
    }
  },
};

const updateNumberOfScores = (newNumberOfScores) => {
  try {
    fs.readFile("./src/secrets.js", "utf8", (err, data) => {
      const updatedSecretsObject = data.replace(
        new RegExp("numberOfScores: -?[0-9]+"),
        `numberOfScores: ${newNumberOfScores}`
      );

      fs.writeFile(
        "./src/secrets.js",
        updatedSecretsObject,
        "utf8",
        (err) => {}
      );
    });
  } catch (err) {
    throw new Error(
      "Couldn't find secrets.js file, please provide on and enter correct data"
    );
  }
};

const appendToLogFile = (string) => {
  const dateString = dayjs().format("D.M.YYYY H:m");
  const completeString = `${dateString}: ${string}\n`;

  fs.appendFile("./log.txt", completeString, (err) => {
    if (err) throw err;
  });
};

module.exports = scraperObject;

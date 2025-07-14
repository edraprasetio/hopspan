const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra = require("puppeteer-extra");

puppeteerExtra.use(StealthPlugin());

let browser;

async function getBrowser() {
    if (!browser) {
        console.log("Made it here");
        browser = await puppeteer.launch({
            headless: true,
            executablePath: "/usr/bin/chromium",
            args: [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
              "--single-process",
              "--no-zygote",
            ],
          });
          console.log("Made it here too");
    }
    return browser;
}

module.exports = { getBrowser };
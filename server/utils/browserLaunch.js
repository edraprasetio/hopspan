const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra = require("puppeteer-extra");

puppeteerExtra.use(StealthPlugin());

let browser;

async function getBrowser() {
    browser = await puppeteer.launch({
        headless: 'new',            
        args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    
    return browser;
}

module.exports = { getBrowser };
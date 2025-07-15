const { getBrowser } = require("./browserLaunch");

async function getHtmlSize(rawUrl) {
    console.log("Fetching url:", rawUrl);
    const url =
        rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
        ? rawUrl
        : `https://${rawUrl}`;

    console.log("Clean url:", rawUrl);

    const browser = await getBrowser();
    const page = await browser.newPage();

    console.log("Can I get the puppeteer stuff?");

    let totalBytes = 0;

    page.on("response", async (response) => {
        try {
        const status = response.status();

        // Ignore redirect responses
        if (status >= 300 && status < 400) return;

        // Only process responses with a body
        const buffer = await response.buffer();
        totalBytes += buffer.length;
        } catch (err) {
        // Ignore unreadable responses
        }
    });

    try {
        console.log(`Navigating to ${url}`);
        await page.goto(url, { waitUntil: "networkidle2" });
    } catch (error) {
        console.error("Failed to load page:", error.message);
    }

    await browser.close();
    return totalBytes;
}

module.exports = { getHtmlSize };
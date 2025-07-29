const { getBrowser } = require("./browserLaunch");
const axios = require("axios");

async function getHtmlSize(rawUrl) {
    console.log("Fetching url:", rawUrl);
    const url =
        rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
        ? rawUrl
        : `https://${rawUrl}`;

    console.log("Clean url:", rawUrl);

    const browser = await getBrowser();
    const page = await browser.newPage();

    // console.log("Can I get the puppeteer stuff?");

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
        await page.waitForTimeout(3000);
    } catch (error) {
        console.error("Failed to load page:", error.message);
    }

    await browser.close();
    return totalBytes;
}

async function getContentLength(rawUrl) {

  const url =
    rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;

   try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });
    const sizeInBytes = response.data.length;
    console.log(`Size: ${sizeInBytes} bytes`);
    if (sizeInBytes == undefined) {
      return 0;
    } else {
      return sizeInBytes;
    }
    
  } catch (error) {
    console.error("Error fetching site:", error.message);
  }
}

module.exports = { getHtmlSize, getContentLength };
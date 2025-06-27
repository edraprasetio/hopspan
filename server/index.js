const express = require("express");
const axios = require("axios");
const dns = require("dns").promises;
const cors = require("cors");
const { chromium } = require("playwright");
const { estimateCO2 } = require("./utils/carbonEstimator");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra = require("puppeteer-extra");
const { connectToDB } = require("./utils/db");

const app = express();
app.use(cors());
app.use(express.json());

puppeteerExtra.use(StealthPlugin());

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getHtmlSize(rawUrl) {
  console.log("Fetching url:", rawUrl)
  const url =
    rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;

  console.log("Clean url:", rawUrl)

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium', // or wherever Chromium is installed
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote',
    ],
  });
  const page = await browser.newPage();

  console.log("Can I get the puppeteer stuff?")

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

async function getWebsiteSize(rawUrl) {
  const url =
    rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;

  console.log("Axios Fetched url:", url);

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
    return sizeInBytes;
  } catch (error) {
    console.error("Error fetching site:", error.message);
  }
}

app.get("/api/lookup", async (req, res) => {
  try {
    const db = await connectToDB();
    const collection = db.collection('calculations');

    const allCalculations = await collection
      .find({})
      .sort({ createdAt: -1 }) // optional: newest first
      .toArray();

    res.status(200).json(allCalculations);
  } catch (err) {
    console.error('Error fetching calculations:', err);
    res.status(500).json({ error: 'Failed to fetch calculations' });
  }
});

app.post("/api/lookup", async (req, res) => {
  const { domain } = req.body;
  // console.log("Incoming request body:", domain);
  // console.log("Response type:", typeof domain);

  const domainToLookUp = domain.replace(/^https?:\/\//, "").split("/")[0];

  try {
    let websiteSize = await getHtmlSize(domain);
    if (websiteSize === 0) {
      console.log("Fallback: using Axios to calculate website size...");
      websiteSize = await getWebsiteSize(domain);
    }
    console.log("Size of website is:", websiteSize);

    const carbonAmount = Number(estimateCO2(websiteSize));

    console.log("CO2:", carbonAmount.toFixed(3));

    const greenWeb = await axios.get(
      `https://api.thegreenwebfoundation.org/api/v3/greencheck/${domainToLookUp}`
    );

    const isGreen = greenWeb.data.green;

    console.log("Green Web:", isGreen);

    const { address: ip } = await dns.lookup(domainToLookUp);
    const serverInfo = await axios.get(`https://ipapi.co/${ip}/json/`);
    const clientInfo = await axios.get("https://ipapi.co/json/");

    const server = serverInfo.data;
    const client = clientInfo.data;

    const distance = haversine(
      parseFloat(client.latitude),
      parseFloat(client.longitude),
      parseFloat(server.latitude),
      parseFloat(server.longitude)
    );

    const result = {
      domainToLookUp,
      websiteSize,
      isGreen,
      carbonAmount,
      serverLocation: {
        city: server.city,
        country: server.country_name,
        latitude: server.latitude,
        longitude: server.longitude,
      },
      clientLocation: {
        city: client.city,
        country: client.country_name,
        latitude: client.latitude,
        longitude: client.longitude,
      },
      distance: distance.toFixed(2),
      createdAt: new Date()
    };
    
    const db = await connectToDB();
    const collection = db.collection('calculations');
    await collection.insertOne(result);
    
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

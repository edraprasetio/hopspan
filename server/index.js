const express = require("express");
const axios = require("axios");
const dns = require("dns").promises;
const cors = require("cors");
const { estimateCO2 } = require("./utils/carbonEstimator");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra = require("puppeteer-extra");
const { connectToDB } = require("./utils/db");
const { calculateLatency } = require("./utils/latencyEstimator");
const { getHtmlSize } = require("./utils/getHtmlSize");
const { haversine } = require("./utils/haversine");

const app = express();
app.use(cors());
app.use(express.json());

puppeteerExtra.use(StealthPlugin());

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
    const collection = db.collection("calculations");

    const allCalculations = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(allCalculations);
  } catch (err) {
    console.error("Error fetching calculations:", err);
    res.status(500).json({ error: "Failed to fetch calculations" });
  }
});

app.post("/api/lookup", async (req, res) => {
  const { domain, bandwidth } = req.body;

  const domainToLookUp = domain.replace(/^https?:\/\//, "").split("/")[0];

  try {
    const sizeUnavailable = 0
    
    let websiteSize = await getHtmlSize(domain);
    if (websiteSize === sizeUnavailable) {
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

    console.log("Bandwith is:", bandwidth);

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

    const latency = calculateLatency(bandwidth, websiteSize, distance);
    console.log("Latency is:", latency);

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
      latency: latency.toFixed(2),
      createdAt: new Date(),
    };

    console.log("Results:", result);

    const db = await connectToDB();
    const collection = db.collection("calculations");
    await collection.insertOne(result);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

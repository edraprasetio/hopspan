const express = require("express");
const axios = require("axios");
const dns = require("dns").promises;
const cors = require("cors");
const { estimateCO2 } = require("./utils/carbonEstimator");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra = require("puppeteer-extra");
const { connectToDB } = require("./utils/db");
const { calculateLatency } = require("./utils/latencyEstimator");
const { getHtmlSize, getContentLength } = require("./utils/getHtmlSize");
const { haversine } = require("./utils/haversine");

const app = express();
app.use(cors());
app.use(express.json());

puppeteerExtra.use(StealthPlugin());

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
    
    let websiteSize = await getContentLength(domain);
    console.log("Axios Result:", websiteSize);
    if (websiteSize === sizeUnavailable) {
      console.log("Fallback: using Puppeteer to calculate website size...");
      websiteSize = await getHtmlSize(domain);
    }
    console.log("Size of website is:", websiteSize);

    const carbonAmount = Number(estimateCO2(websiteSize));

    console.log("CO2:", carbonAmount.toFixed(3));

    console.log("Bandwith is:", bandwidth);
    const { address: ip } = await dns.lookup(domainToLookUp);

    const [
      { data: server},
      { data: client},
      { data : {green: isGreen}}
    ] = await Promise.all([
      axios.get(`https://ipapi.co/${ip}/json/`),
      axios.get("https://ipapi.co/json/"),
      axios.get(`https://api.thegreenwebfoundation.org/api/v3/greencheck/${domainToLookUp}`)
    ])

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

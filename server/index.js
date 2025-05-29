const express = require("express");
const axios = require("axios");
const dns = require("dns").promises;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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

async function getWebsiteSize(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const sizeInBytes = response.data.length;
    console.log(`Size: ${sizeInBytes} bytes`);
    return sizeInBytes;
  } catch (error) {
    console.error("Error fetching site:", error.message);
  }
}

app.post("/api/lookup", async (req, res) => {
  const { domain } = req.body;
  console.log("Incoming request body:", domain);
  console.log("Response type:", typeof domain);

  const domainToLookUp = domain.replace(/^https?:\/\//, "").split("/")[0];

  try {
    const websiteSize = await getWebsiteSize(domain);
    console.log("Size of website is:", websiteSize);

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

    res.json({
      websiteSize,
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
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

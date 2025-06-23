function estimateCO2(bytesTransferred) {
  const bytesToGB = bytesTransferred / 1024 ** 3; // convert bytes to GB
  const energyPerGB = 1.8; // kWh (average across devices/networks)
  const carbonPerKWh = 475; // gCO2/kWh (worldwide average, can vary)

  const energyUsed = bytesToGB * energyPerGB;
  const carbonProduced = energyUsed * carbonPerKWh; // in grams

  return carbonProduced; // return in grams of CO2
}

module.exports = { estimateCO2 };

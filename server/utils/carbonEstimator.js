function estimateCO2(bytesTransferred) {
  const bytesToGB = bytesTransferred / 1024 ** 3; // convert bytes to GB
  const energyPerGB = 1.8; // kWh (average across devices/networks)
  const carbonPerKWh = 475; // gCO2/kWh (worldwide average, can vary)

  const energyUsed = bytesToGB * energyPerGB;
  const carbonProduced = energyUsed * carbonPerKWh; // in grams

  return carbonProduced; // return in grams of CO2

  //   const bytesToGB = bytesTransferred / 1024 ** 3;
  //   const gridIntensity = 494; // gCO₂e per kWh

  //   // Operational energy intensities (kWh/GB)
  //   const opDC = 0.055;
  //   const opNet = 0.059;
  //   const opUser = 0.08;

  //   // Embodied energy intensities (kWh/GB)
  //   const emDC = 0.012;
  //   const emNet = 0.013;
  //   const emUser = 0.081;

  //   // Calculate emissions
  //   const opEmissions = bytesToGB * (opDC + opNet + opUser) * gridIntensity;
  //   const emEmissions = bytesToGB * (emDC + emNet + emUser) * gridIntensity;

  //   const totalEmissions = opEmissions + emEmissions; // in grams of CO₂ equivalent

  //   return totalEmissions;
}

module.exports = { estimateCO2 };

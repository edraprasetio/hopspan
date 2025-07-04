function calculateLatency(bandwidthMbps, payloadSizeBytes, distanceKm) {
  const SPEED_OF_LIGHT_KM_S = 200000;
  const payloadBits = payloadSizeBytes * 8;
  const bandwidthBps = bandwidthMbps * 1_000_000;

  const transmissionDelayMs = (payloadBits / bandwidthBps) * 1000;
  const oneWayDelayMs = (distanceKm / SPEED_OF_LIGHT_KM_S) * 1000;
  const propagationDelayMs = oneWayDelayMs * 2;

  return transmissionDelayMs + propagationDelayMs;
}

module.exports = { calculateLatency };

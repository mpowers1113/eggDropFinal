const distanceToEgg = (
  targetLatitude,
  targetLongitude,
  userLatitude,
  userLongitude
) => {
  const R = 6371;
  const dLat = deg2rad(targetLatitude - userLatitude);
  const dLon = deg2rad(targetLongitude - userLongitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(userLatitude)) *
      Math.cos(deg2rad(targetLatitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const eggDistance = {
    howFar: parseInt(R * c * 3280),
    claimable: false,
    metric: null,
  };
  if (eggDistance.howFar > 5280) {
    eggDistance.howFar = eggDistance.howFar / 5280;
    eggDistance.metric = "miles";
  } else if (eggDistance.howFar > 300) {
    eggDistance.metric = "feet";
  } else {
    eggDistance.metric = "feet";
    eggDistance.claimable = true;
  }
  return eggDistance;
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = distanceToEgg;

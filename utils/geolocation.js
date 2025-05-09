const geoip = require("geoip-lite");

const getCountryByIP = (ip) => {
  const geo = geoip.lookup(ip);
  return geo ? geo.country : null;
};

module.exports = { getCountryByIP };

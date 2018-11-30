const nodeSitemap = require('sitemap');
const axios = require('axios');

function getSitemap(data, res) {
  const sm = nodeSitemap.createSitemap(data);
  sm.toXML((err, xml) => {
    if (err) {
      return res.status(500).end();
    }
    res.type('application/xml');
    return res.send(xml);
  });
}

module.exports = function sitemap(app, serverInfo) {
  return function generateSitemap(publicEndpoint, dataEndpoint) {
    app.get(publicEndpoint, (req, res) => {
      res.setHeader('Server', serverInfo);
      axios.get(dataEndpoint)
        .then(({ data }) => getSitemap(data, res))
        .catch((err) => {
          console.log(`Failed to get site map from ${dataEndpoint}.`);
          console.log(err);
          return res.status(500).end();
        });
    });
  };
};

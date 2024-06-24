const shortid = require("shortid");
const URL = require("../models/url.js");

async function handleGenerateShortURL(req, res) {
  console.log("recieved post request");
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ err: "url is required" });
  }
  const shortID = shortid();
  await URL.create({
    shortId: shortID,
    redirectId: body.url,
    visitHistory: [],
  });
  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    Analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateShortURL,
  handleGetAnalytics,
};

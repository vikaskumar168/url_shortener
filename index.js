const express = require("express");
const urlRoute = require("./routes/url.js");
const { connectMongoDb } = require("./connectionDB.js");
const URL = require("./models/url.js");
const app = express();

const PORT = 8000;

connectMongoDb("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB connected")
);
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use(express.json());
app.use("/url", urlRoute);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectId);
});
app.listen(PORT, () => console.log(`app is listening on PORT: ${PORT}`));

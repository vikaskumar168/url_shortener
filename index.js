const express = require("express");
const urlRoute = require("./routes/url.js");
const { connectMongoDb } = require("./connectionDB.js");
const URL = require("./models/url.js");
const cors = require("cors");
const path = require("path");
const staticRoute = require("./routes/staticRouter.js");
const app = express();

const port = process.env.PORT || 8000;

connectMongoDb("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB connected")
);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
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
      },
      { new: true } // This option returns the modified document rather than the original
    );

    if (!entry) {
      return res.status(404).send("URL not found");
    }

    res.redirect(entry.redirectId);
  } catch (error) {
    console.error("Error during URL redirection:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => console.log(`app is listening on PORT: ${port}`));

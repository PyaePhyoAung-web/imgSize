import express from "express";
import multer from "multer";
import path from "path";
import serveStatic from "serve-static";
import imageSize from "image-size";

const PORT = process.env.PORT || 5000;
const app = express();
const __dirname = path.resolve();

app.use(express.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
});

var upload = multer({ storage: storage });

app.use("/", serveStatic(path.join(__dirname, "/public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/login", function (req, res) {
  res.send("pyae");
});

app.post(
  "/size2json",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    }
  ]),
  (req, res, next) => {
    const files = req.files;

    if (!files) {
      const error = new Error("Please choose files");
      error.httpStatusCode = 400;
      return next(error);
    }

    const dimensions = imageSize('uploads/image')

    res.send({width: dimensions.width, height: dimensions.height});
  },
);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

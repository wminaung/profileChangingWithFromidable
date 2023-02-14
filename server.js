// Load dependencies
const aws = require("aws-sdk");
const express = require("express");
const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
app.use(express.json());
// Views in public directory
app.use(express.static("public"));
// Set S3 endpoint to DigitalOcean Spaces

const s3 = new aws.S3({
  endpoint: "sgp1.digitaloceanspaces.com",
});

app.post("/upload", (request, response) => {
  const form = formidable();
  form.parse(request, function (error, fields, files) {
    console.log("**********************************************************");
    if (error) {
      console.log("error from form.parse", error);
    }

    const file = files.img;
    const destFileName = file.originalFilename;
    const fileStream = fs.createReadStream(file.filepath);

    s3.upload(
      {
        Bucket: "msquarefdc",
        Key: `wma/${uuidv4() + destFileName}`,
        ACL: "public-read",
        Body: fileStream,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          response.json({ message: "fail" });
        } else if (data) {
          console.log("File uploaded successfully.", data);
          const { Location, key } = data;
          const infoData = JSON.parse(
            fs.readFileSync(__dirname + "/info.json")
          );
          let id = 1;
          if (infoData.length === 0) {
            id = 1;
          } else {
            id = infoData[infoData.length - 1].id + 1;
          }

          infoData.push({ Location, key, id });
          fs.writeFileSync(__dirname + "/info.json", JSON.stringify(infoData));
          response.json({ message: "success" });
        }
      }
    );
  });
});

app.get("/getAllImages", (req, res) => {
  let fileUploadInfo = JSON.parse(fs.readFileSync(`${__dirname}/info.json`));

  res.status(200).json(fileUploadInfo);
});

app.get("/getProfile", (req, res) => {
  const infoData = JSON.parse(fs.readFileSync(__dirname + "/info.json"));
  res.status(200).json({ src: infoData[infoData.length - 1].Location });
});

app.listen(3001, function () {
  console.log("Server listening on port 3001.");
});

// const infoData = JSON.parse(fs.readFileSync(__dirname + "/info.json"));

// Load dependencies
const aws = require("aws-sdk");
const express = require("express");
const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
require("dotenv").config();
const app = express();
app.use(express.json());
// Views in public directory
app.use(express.static("public"));
// Set S3 endpoint to DigitalOcean Spaces

const s3 = new aws.S3({
  endpoint: "sgp1.digitaloceanspaces.com",
  accessKeyId: process.env.SPACES_ACCESS_KEY,
  secretAccessKey: process.env.SPACES_SECRET_KEY,
});
let infoData = [
  {
    Location:
      "https://msquarefdc.sgp1.digitaloceanspaces.com/wma/6a72934f-68d8-4790-b26c-53bccfe1e0e0aeiougg.jpg",
    key: "wma/6a72934f-68d8-4790-b26c-53bccfe1e0e0aeiougg.jpg",
    id: 1,
  },
  {
    Location:
      "https://msquarefdc.sgp1.digitaloceanspaces.com/wma/09a754ac-ad09-4210-8826-418311b23f95wp5332094.jpg",
    key: "wma/09a754ac-ad09-4210-8826-418311b23f95wp5332094.jpg",
    id: 2,
  },
  {
    Location:
      "https://msquarefdc.sgp1.digitaloceanspaces.com/wma/6872c2f7-25f8-4e73-a4d6-5d14f18a95c5ogger.jpg",
    key: "wma/6872c2f7-25f8-4e73-a4d6-5d14f18a95c5ogger.jpg",
    id: 3,
  },
  {
    Location:
      "https://msquarefdc.sgp1.digitaloceanspaces.com/wma/e5c82890-8bff-44ce-b82a-f88d1da073d3ggg333.jpg",
    key: "wma/e5c82890-8bff-44ce-b82a-f88d1da073d3ggg333.jpg",
    id: 4,
  },
  {
    Location:
      "https://msquarefdc.sgp1.digitaloceanspaces.com/wma/5e10ea2c-b862-435f-863e-a5487f4528b4niceView.jpg",
    key: "wma/5e10ea2c-b862-435f-863e-a5487f4528b4niceView.jpg",
    id: 5,
  },
  {
    Location:
      "https://msquarefdc.sgp1.digitaloceanspaces.com/wma/1718e2ff-8d83-4f8b-a3c0-c0a0b2823d7dxicOqN.jpg",
    key: "wma/1718e2ff-8d83-4f8b-a3c0-c0a0b2823d7dxicOqN.jpg",
    id: 6,
  },
  {
    Location:
      "https://msquarefdc.sgp1.digitaloceanspaces.com/wma/28b45926-28ee-4f5c-945b-5860d31ee76arrreee.jpg",
    key: "wma/28b45926-28ee-4f5c-945b-5860d31ee76arrreee.jpg",
    id: 7,
  },
  {
    Location:
      "https://msquarefdc.sgp1.digitaloceanspaces.com/wma/0462f563-1874-4fa6-bfc7-338ab84a2c25zzzggg.jpg",
    key: "wma/0462f563-1874-4fa6-bfc7-338ab84a2c25zzzggg.jpg",
    id: 8,
  },
];

app.post("/api/upload", (request, response) => {
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

          let id = 1;
          if (infoData.length === 0) {
            id = 1;
          } else {
            id = infoData[infoData.length - 1].id + 1;
          }

          infoData.push({ Location, key, id });

          response.json({ message: "success" });
        }
      }
    );
  });
});

app.get("/api/getProfile", (req, res) => {
  res.status(200).json({ src: infoData[infoData.length - 1].Location });
});

app.listen(3012, function () {
  console.log("Server listening on port 3012.");
});

// const infoData = JSON.parse(fs.readFileSync(__dirname + "/info.json"));

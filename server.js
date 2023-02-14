// Load dependencies
const aws = require("aws-sdk");
const express = require("express");
const formidable = require("formidable");

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
// Views in public directory
app.use(express.static("public"));
// Set S3 endpoint to DigitalOcean Spaces

const s3 = new aws.S3({
  endpoint: "sgp1.digitaloceanspaces.com",
});

// Change bucket property to your Space name
// function uploadToS3(file, destFileName, callback) {
//   let uploadParams = {
//     Bucket: "msquarefdc",
//     Key: destFileName,
//     ACL: "public-read",
//     Body: "",
//   };
//   console.log(file.filepath);

//   let fileStream = fs.createReadStream(file.filepath);
//   fileStream.on("error", function (err) {
//     console.log("File Error", err);
//   });

//   uploadParams.Body = fileStream;
//   s3.upload(uploadParams, callback);
// }

app.post("/upload", function (request, response, next) {
  const form = formidable();
  form.parse(request, function (error, fields, files) {
    console.log("**********************************************************");
    if (error) {
      console.log("error from form.parse", error);
    }
    const file = files.upload;
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

// Main, error and success views

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/success", function (request, response) {
  response.sendFile(__dirname + "/public/success.html");
});

app.get("/error", function (request, response) {
  response.sendFile(__dirname + "/public/error.html");
});

app.listen(3001, function () {
  console.log("Server listening on port 3001.");
});
// uploadToS3(file, destFileName, (err, data) => {
//   if (err) {
//     console.log(error);
//     return response.redirect("/error");
//   } else if (data) {
//     console.log("File uploaded successfully.", data);
//     response.redirect("/success");
//   } else {
//     console.log("else");
//     response.write(
//       '{"status": 442, "message": "Yikes! Error saving your photo. Please try again."}'
//     );
//     return response.end();
//   }
// });
/*
{
  ETag: '"162cf8c76e442cc7576f673e06321e69"',
  Location: 'https://msquarefdc.sgp1.digitaloceanspaces.com/wma/38cb207d-5b0c-4b52-af89-5e11ce2880edwp5332094.jpg',
  key: 'wma/38cb207d-5b0c-4b52-af89-5e11ce2880edwp5332094.jpg',
  Key: 'wma/38cb207d-5b0c-4b52-af89-5e11ce2880edwp5332094.jpg',
  Bucket: 'msquarefdc'
}
*/
const infoData = JSON.parse(fs.readFileSync(__dirname + "/info.json"));

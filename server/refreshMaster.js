const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const split = require("split2");
const storage = new Storage();
const bucketName = "hd-www-prod-catalog-data";
const bucket = storage.bucket(bucketName);
const remoteFileName = "catalog-master/ItemAttributes-master.del";
const through2 = require("through2");
const prodName = "PRODUCT-NAME.del";
const brandName = "PRODUCT-BRAND.del";

const parseLine = through2.obj(function(c, e, cb) {
  //put it in array and clear stream
  cb(null, c.split("|"));
});

const filterForProdName = through2.obj(function(c, e, cb) {
  var dat = c;

  var op = {
    itemid: dat[0],
    guid: dat[1],
    val: dat[2]
  };

  // not sure why we need to empty the stream.
  if (op.guid === "a40be0d3-5c49-446d-a835-ef6af29c016e") {
    //cb(null, JSON.stringify(op)+"\n");
    const line = [op.itemid, op.val].join("|");
    cb(null, line + "\n");
  } else {
    cb(null, null);
  }
});

const filterForMFG = through2.obj(function(c, e, cb) {
  var dat = c;

  var op = {
    itemid: dat[0],
    guid: dat[1],
    val: dat[2]
  };

  // not sure why we need to empty the stream.
  if (op.guid === "29d438d9-64f2-4623-8f4e-09f9368e93bb") {
    //cb(null, JSON.stringify(op)+"\n");
    const line = [op.itemid, op.val].join("|");
    cb(null, line + "\n");
  } else {
    cb(null, null);
  }
});

function getRemoteReadStream(bucket, remoteFileName) {
  return (
    bucket
      .file(remoteFileName)
      //   .createReadStream({ start: 10000, end: 20000 })
      .createReadStream()
      .on("response", function(response) {
        console.log("Response Received from GCS for " + remoteFileName);
      })
      .on("data", function(x) {
        // console.log("We have Data! This will execute for every chunk!!");
      })
      .on("end", function(x) {
        console.log("file read complete..");
      })
  );
}
// Refresh - ProductName
//get a stream of remote file
getRemoteReadStream(bucket, remoteFileName)
  .pipe(split())
  .pipe(parseLine)
  .pipe(filterForProdName)
  .pipe(
    fs.createWriteStream(prodName).on("close", () => {
      console.log(`${prodName} Refreshed!`);
    })
  );

// Refresh - ProductBrand
//get a stream of remote file
getRemoteReadStream(bucket, remoteFileName)
  // fs.createReadStream(
  //   "C:\\QA\\0.Catalog\\showSavingsPy\\showSavingsApp\\PRODUCT-NAME.del"
  // )
  .pipe(split())
  .pipe(parseLine)
  .pipe(filterForMFG)
  .pipe(
    fs.createWriteStream(brandName).on("close", () => {
      console.log(`${brandName} Refreshed!`);
    })
  );

module.exports = getRemoteReadStream;

/////
// const attr = bucket.file(remoteFileName);
// attr
//   //   .createReadStream({ start: 10000, end: 20000 })
//   .createReadStream()
//   .on("response", function(response) {
//     console.log("Response Received from GCS for " + attr.name);
//   })
//   .on("data", function(x) {
//     console.log("We have Data! This will execute for every chunk!!");
//   })
//   .on("end", function(x) {
//     console.log("file read complete..");
//   })
//   .pipe(
//     fs.createWriteStream("local.del").on("close", function(x) {
//       console.log("downloaded!");
//       console.log(getRemoteReadStream(null, null));
//     })
//   );

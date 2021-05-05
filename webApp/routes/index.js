const express = require('express');
const router = express.Router();
const http = require("http")
const url = require("url")
const path = require("path")
const fs = require("fs")
const mimeTypes = require("mime-types")
const config = require("../config")


//file upload
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline
} = require('@azure/storage-blob');



const { v1: uuidv1} = require('uuid');
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const getStream = require('into-stream');
const { response } = require('express');
const containerName = 'seedpics';
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;

const sharedKeyCredential = new StorageSharedKeyCredential(
  config.storageAccountName
  ,config.accountKey
  );
const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
  `https://kasidevstorage.blob.core.windows.net`,
  pipeline
);

const getBlobName = originalName => {
  // Use a random number to generate a unique file name, 
  // removing "0." from the start of the string.
  const identifier =  uuidv1();
  return `${identifier}-${originalName}`;
};


router.get('/viewData', async (req, res, next) => {

  let viewData;

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const listBlobsResponse = await containerClient.listBlobFlatSegment();

    for await (const blob of listBlobsResponse.segment.blobItems) {
      console.log(`Blob: ${blob.name}`);
    }

    viewData = {
      title: 'Home',
      viewName: 'index',
      accountName: "kasidevstorage",
      containerName: containerName
    };

    if (listBlobsResponse.segment.blobItems.length) {
      viewData.thumbnails = listBlobsResponse.segment.blobItems;
    }
  } catch (err) {
    viewData = {
      title: 'Error',
      viewName: 'error',
      message: 'There was an error contacting the blob storage container.',
      error: err
    };
    res.status(500);
    console.log(err)
  } finally {
    res.send(viewData);
  }
});

router.post('/uploadData', uploadStrategy, async (req, res) => {
  console.log("upload requested")
  const blobName = getBlobName(req.file.originalname);
  const stream = getStream(req.file.buffer);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadPicture = async() =>{
    try {
    const response = blockBlobClient.uploadStream(
      stream,
      uploadOptions.bufferSize, 
      uploadOptions.maxBuffers,
      { blobHTTPHeaders: { blobContentType: "image/jpg" } })


      
    } catch (error) {
      res.status(500)
      console.log(error)
      res.send("file upload failed" + error.name + error.message)
      
    }
    
  }
  uploadPicture().then(()=>{
    res.status(200)
    res.send(blockBlobClient.url)
  })

  

  /*try {
    await blockBlobClient.uploadStream(stream,
      uploadOptions.bufferSize, uploadOptions.maxBuffers,
      { blobHTTPHeaders: { blobContentType: "image/jpg" } });
    res.send('success', { message: 'File uploaded to Azure Blob storage.' });
  } catch (err) {
    res.send('error', { message: err.message });
  }
*/
});





/* GET home page */
router.get('/', function(req, res, next) {
  res.send('Hello World')})

router.get('/test', function(req, res, next) {
  res.send('This is a test')})


router.post('/SendInvoices',function(req,res,next){
  res.send('test test')
  console.log(req.body)
  console.log(req.headers)
})



module.exports = router

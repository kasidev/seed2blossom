//file upload
const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
  } = require('@azure/storage-blob');
  
const config = require("../config")
const { v1: uuidv1} = require('uuid');
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('eventImage');
const getStream = require('into-stream');
const containerName = 'seedpics';
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;

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




module.exports.uploadImage = async function uploadImage(req, res) {
    console.log("upload requested")
    uploadStrategy(req,res,(err) =>{
        if(err){
            console.log(err)
        }
        else{
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
            console.log("sucess")
            res.send("eiji")
        })
        }
    })
}



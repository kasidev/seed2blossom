const CosmosClient = require('@azure/cosmos').CosmosClient
 const config = require('./config')
 const TaskList = require('./routes/tasklist')
 const TaskDao = require('./models/taskDao')

 const express = require('express')
 const path = require('path')
 const logger = require('morgan')
 const cookieParser = require('cookie-parser')
 const bodyParser = require('body-parser')
 const public = require('./routes/index')
 const users = require("./routes/users")


 const app = express()

 // view engine setup
 app.set('views', path.join(__dirname, 'views'))
 app.set('view engine', 'ejs')

 // uncomment after placing your favicon in /public
 //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 app.use(logger('dev'))
 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(cookieParser())
 //app.use(express.static('public'))
 app.use(express.static(path.join(__dirname, 'public')))

 //Todo App:
 const cosmosClient = new CosmosClient({
   endpoint: config.host,
   key: config.authKey
 })
 const taskDao = new TaskDao(cosmosClient, config.databaseId, config.containerId)
 const taskList = new TaskList(taskDao)
 taskDao
   .init(err => {
     console.error(err)
   })
   .catch(err => {
     console.error(err)
     console.error(
       'Shutting down because there was an error settinig up the database.'
     )
     process.exit(1)
   })

   app.use(public)
   app.use('/users',users)
  
   
 
 app.post('/getNOTAM',(req, res, next) =>taskList.getNOTAM(req, res).catch(next))
 app.post('/addNew',(req, res, next) =>taskList.addNew(req, res).catch(next))
 app.post('/notamFilterQuery',(req, res, next) =>taskList.notamFilterQuery(req, res).catch(next))
 app.post('/notamFilterQueryAllStatus',(req, res, next) =>taskList.notamFilterQueryAllStatus(req, res).catch(next))
 app.post('/notamUpdate',(req, res, next) =>taskList.notamUpdate(req, res).catch(next))
 app.get('/findItem', (req, res, next) =>taskList.findItem(req, res).catch(next))

 app.get('/dbTest', (req, res, next) =>taskList.dbTest(req, res).catch(next))
 app.get('/findItemsOfType', (req, res, next) =>taskList.findItemsOfType(req, res).catch(next))
 app.post('/findWithProp', (req, res, next) =>taskList.findWithProp(req, res).catch(next))
 app.post('/updateItem',(req, res, next) =>taskList.itemUpdate(req, res).catch(next))
 app.post('/addItem',(req, res, next) =>taskList.addNew(req, res).catch(next))
 app.post('/deleteItem',(req, res, next) =>taskList.deleteItem(req, res).catch(next))


 
 //app.set('view engine', 'jade')

 // catch 404 and forward to error handler 
 app.use(function(req, res, next) {
   const err = new Error('Not Found')
   err.status = 404
   next(err)
 })

 // error handler
 app.use(function(err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message
   res.locals.error = req.app.get('env') === 'development' ? err : {}

   // render the error page
   res.status(err.status || 500)
   res.send('error')
 })

//file upload
  const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline
} = require('@azure/storage-blob');

const containerName1 = 'thumbnails';
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const getStream = require('into-stream');
const containerName2 = 'seedpics';
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;

const sharedKeyCredential = new StorageSharedKeyCredential(
  {
    accountName: config.storageAccountName
    ,accountKey: config.storageAccountKey
  });
const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
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
    const containerClient = blobServiceClient.getContainerClient(containerName1);
    const listBlobsResponse = await containerClient.listBlobFlatSegment();

    for await (const blob of listBlobsResponse.segment.blobItems) {
      console.log(`Blob: ${blob.name}`);
    }

    viewData = {
      title: 'Home',
      viewName: 'index',
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
      containerName: containerName1
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
  } finally {
    res.render(viewData.viewName, viewData);
  }
});

router.post('/uploadData', uploadStrategy, async (req, res) => {
  const blobName = getBlobName(req.file.originalname);
  const stream = getStream(req.file.buffer);
  const containerClient = blobServiceClient.getContainerClient(containerName2);;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.uploadStream(stream,
      uploadOptions.bufferSize, uploadOptions.maxBuffers,
      { blobHTTPHeaders: { blobContentType: "image/jpeg" } });
    res.render('success', { message: 'File uploaded to Azure Blob storage.' });
  } catch (err) {
    res.render('error', { message: err.message });
  } 
});




 module.exports = app
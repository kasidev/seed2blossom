const express = require('express');
const router = express.Router();
const http = require("http")
const url = require("url")
const path = require("path")
const fs = require("fs")
const mimeTypes = require("mime-types")

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

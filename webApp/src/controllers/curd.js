"use strict"
const axios = require('axios');
const apiStrings = require('../utils/apiStrings.json')




module.exports.queryAll = function queryAll(test) {
  return axios
  .get('https://kasidevnotam.azurewebsites.net/query?type=task')
    .then(function (response) {
      // handle success
      //console.log(test,response.data);
      return response.data
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}

module.exports.findItem = function findItem(itemID) {
  return axios
  .get(apiStrings.url+'/findItem?itemID='+itemID)
    .then(function (response) {
      // handle success
      //console.log("item Found",response.data);
      return response.data
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}

module.exports.findItemsOfType = function findItem(typeID) {
  return axios
  .get(apiStrings.url+'/findItemsOfType?typeID='+typeID)
    .then(function (response) {
      // handle success
      //console.log("item Found",response.data);
      return response.data
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}

module.exports.findWithProp = function findWithProp(property,value) {
  let body={prop: property,
            value : value}
  return axios
  .post(apiStrings.url+'/findWithProp', body)
    .then(function (response) {
      // handle success
      //console.log("item Found",response.data);
      return response.data
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}


module.exports.setToComplete = function setToComplete(taskID) {
  let body={"taskID": taskID}
  return axios
  .post(apiStrings.url+'/closeTask',body)
    .then(function (response) {
      // handle success
      console.log('task closed',taskID);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}

module.exports.addItem = function addItem(itemData) {
  console.log(itemData)
  return axios
  .post(apiStrings.url+'/addItem',itemData)
    .then(function (response) {
      
      // handle success
      //console.log(response.data,"item added");
      return response.data
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}

module.exports.updateItem = function updateItem(updateParams) {
  console.log("send update", updateParams)
  return axios
  .post(apiStrings.url+'/updateItem',updateParams)
    .then(function (response) {
      // handle success
      console.log(response.data, "item updated");
    })
    .catch(function (error) {
      // handle error
      console.log("an error occured")
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}

module.exports.deleteItem = function deleteItem(itemId) {
  
  return axios
  .post(apiStrings.url+'/deleteItem',{itemId})
    .then(function (response) {
      // handle success
      //console.log('item deleted',itemId);
    })
    .catch(function (error) {
      // handle error
      console.log("an error occured while trying to delete",itemId)
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}

module.exports.deleteBlob = function deleteBlob(blobID) {
  
  return axios
  .post(apiStrings.url+'/deleteImage',{blobID})
    .then(function (response) {
      // handle success
      //console.log('item deleted',itemId);
    })
    .catch(function (error) {
      // handle error
      console.log("an error occured while trying to delete",blobID)
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}















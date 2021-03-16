"use strict"
const axios = require('axios');
const devurl = "http://localhost:8080"
const produrl ="http://localhost:8080" 
//"https://seed2blossom.azurewebsites.net"

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
  .get(produrl+'/findItem?itemID='+itemID)
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
  .get(produrl+'/findItemsOfType?typeID='+typeID)
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
  return axios
  .get(produrl+'/findWithProp?prop='+ property +'&value='+value)
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
  .post(produrl+'/closeTask',body)
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
  .post(produrl+'/addItem',itemData)
    .then(function (response) {
      
      // handle success
      console.log(response.data,"item added");
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
  
  return axios
  .post(produrl+'/updateItem',updateParams)
    .then(function (response) {
      // handle success
      console.log('item updated',updateParams.key,updateParams.value);
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





module.exports.checkAndSave = function checkAndSave(notamObj) {

  return axios
  .post(produrl+'/addNew',notamObj)
    .then(function (response) {
      // handle success
      //console.log('checkAndSave sucess')
    })
    .catch(function (error) {
      // handle error
      console.log('checkAndSave fail');
    })
    .finally(function () {
      // always executed
    })
}













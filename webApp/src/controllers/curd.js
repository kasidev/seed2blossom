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

module.exports.addTask = function addTask(taskData) {
  let body=taskData
  return axios
  .post(produrl+'/addTask',body)
    .then(function (response) {
      
      // handle success
      console.log(response.data);
      console.log('task added');
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    })
}

module.exports.updateTask = function updateTask(taskID,key,value) {
  let body= { "taskID"  : taskID,
              "key"     : key,
              "value"   : value}
  
  return axios
  .post(produrl+'/updateTask',body)
    .then(function (response) {
      // handle success
      console.log('task updated');
    })
    .catch(function (error) {
      // handle error
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













const TaskDao = require("../models/TaskDao");
const moment = require("moment")
const axios = require('axios');
const apiStrings = require('../src/utils/apiStrings.json')
const icaoAPIString = apiStrings.icaoNotamApi
const {checkAndSave} = require('../src/controllers/curd');
const { isEmpty, max, indexOf } = require("lodash");






 class TaskList {
   /**
    * Handles the various APIs for displaying and managing tasks
    * @param {TaskDao} taskDao
    */
   constructor(taskDao) {
     this.taskDao = taskDao;
   }
   
   //find a specific item in Database
   async findItem(req, res) {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @itemID",
      parameters: [
        {
          name: "@itemID",
          value: req.query.itemID
        }
      ]
    };
    //console.log(querySpec)
    const items = await this.taskDao.find(querySpec)

    res.status(200).send(items)
  }

  async dbTest(req, res) {
    const querySpec = {
      query: "SELECT * FROM c",
      parameters: [
        {
          name: "@itemID",
          value: req.query.itemID
        }
      ]
    };
    //console.log(querySpec)
    const items = await this.taskDao.find(querySpec)

    res.status(200).send(items)
  }

  async findItemsOfType(req, res) {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.typeID = @typeID",
      parameters: [
        {
          name: "@typeID",
          value: req.query.typeID
        }
      ]
    };
    console.log(querySpec)
    const items = await this.taskDao.find(querySpec)

    res.status(200).send(items)
  }
  

  async findWithProp(req, res) {
    const querySpec = {
      query: `SELECT * FROM c WHERE c.${req.body.prop} = @value`,
      parameters: [
        {
          name: "@value",
          value: req.body.value
        }
      ]
    };
    //onsole.log("find with prop",querySpec)
    const items = await this.taskDao.find(querySpec)

    res.status(200).send(items)
  }

  //update item
  async itemUpdate(req, res) {
    console.log("start updating")
    try {
      
  
      const updatedItem = await this.taskDao.updateItem(req.body.itemId,req.body.key,req.body.value)
      
      res.status(200).send(updatedItem)
      
    } catch (error) {
      console.log("update item error")
      console.log(error)
      
    }
    
  }

  //add item to database
  async addNew(req,res){
    const response = await this.taskDao.addItem(req.body)
    
    res.status(200).send(response)
  }

  //delete item from database
  async deleteItem(req,res){
    const response = await this.taskDao.deleteItem(req.body.itemId)
    
    res.status(200).send(response)
  }

  
 



 }

 module.exports = TaskList;
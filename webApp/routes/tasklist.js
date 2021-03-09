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
    //console.log(querySpec)
    const items = await this.taskDao.find(querySpec)

    res.status(200).send(items)
  }
  


  //add NOTAM to database
  async addNew(req,res){
    const querySpec = {
      query: "SELECT * FROM c WHERE c.key = @notamKey AND  STARTSWITH(c.message, @notamStartText,true)",
      parameters: [
        {
          name: "@notamKey",
          value: req.body.key
        },
        {
          name: "@notamStartText",
          value: req.body.message.substring(0,11)
        }
      ]
    };
    //console.log(querySpec)
    const items = await this.taskDao.find(querySpec)
    //console.log(isEmpty(items))
    if (isEmpty(items)) {
      //console.log('notam', req.body.key, ' not in database')
      req.body.storedInDatabaseAt = moment.unix()
      req.body.storedInDatabaseBy = 'user'
      req.body.initalCheckAt = null
      req.body.initalCheckBy = null
      req.body.lastEditAt = null
      req.body.lastEditBy = null
      req.body.remark = null
      req.body.assesmentStatus = 0
      req.body.startdate = moment.utc(req.body.startdate,'YYYY-MM-DDTHH:mm:ss.SSS').unix()
      req.body.enddate = moment.utc(req.body.enddate,'YYYY-MM-DDTHH:mm:ss.SSS').unix()
      req.body.Created = moment.utc(req.body.Created,'YYYY-MM-DDTHH:mm:ss.SSS').unix()
      req.body.notamID = req.body.id
      delete req.body.id
      //console.log("item to create",req.body)
      await this.taskDao.addItem(req.body)
      
    } else {
      //console.log('notam', req.body.key, ' already in database')
      
    }
    res.redirect('/')

  }
 



 }

 module.exports = TaskList;
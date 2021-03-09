"use strict"

const moment = require("moment")
const momentTZ = require('moment-timezone')
const EventEmitter = require("eventemitter3")
const {on} = require("../../utils/domListener")
const {notamQuery} = require('../curd')

/**
 * @param {JSON} input_Elements
 * @param {HTMLTableElement} taskTable
 */

function notamData(){
        
      

}

notamData.prototype.init=function(){



    on(".checkNOTAMButton","click",(event)=>{
        console.log('check NOTAM')
         this.getNotamData() 
    })
}

notamData.prototype.getNotamData=function(){
    const userAirportData=  
    {
    "ICAO" : document.getElementById("inputICAOCodes").value,
    }
    notamQuery(userAirportData)
    /* let notamDATAJSON = {}
    queryOne(0)
        .then((config)=>{

            const notamDATAID = config[0].currentID
            notamDATAJSON = templateJSON
            notamDATAJSON.name=taskData.taskName
            notamDATAJSON.description=taskData.taskDescription
            notamDATAJSON.dueDate = taskData.taskDueDate
            notamDATAJSON.taskID = notamDATAID
            addTask(notamDATAJSON)
            console.log(notamDATAJSON)
            updateTask(config[0].id,"currentID",config[0].currentID+1)

        }) */
    }







    


module.exports = notamData
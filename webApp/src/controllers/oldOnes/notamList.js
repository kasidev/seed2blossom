"use strict"

const moment = require("moment")
const momentTZ = require('moment-timezone')
const EventEmitter = require("eventemitter3")
const {on} = require("../utils/domListener")
const {onPrevDef} = require("../utils/domListener")
const {notamUpdate} = require('./curd')
const {notamFilterQuery} = require('./curd')
const notamDisplayTemplate=require("../views/notamCard.ejs")


/**
 * @param {JSON} input_Elements
 * @param {HTMLTableElement} notamTable
 */

function notamList(notamTable){
    this.notamTable = notamTable
        
      

}

notamList.prototype.init=function(){


    on(".updateNotamListButton","click",(event)=>{
        console.log('start updating list')
         this.getNotamfromDb()
    })


    onPrevDef(".asStatus1","click",(event)=>{
        console.log(event.handleObj.dataset.notamid)
        
        notamUpdate({
            notamId     :   event.handleObj.dataset.notamid,
            key         :   "assesmentStatus",
            value       :   1    
        })
        //setToComplete(taskID)

    })
}

notamList.prototype.getNotamfromDb=function(){
    let notamTable=this.notamTable
    const userFilterData=  
    [{
    "icao"  :   "EDDF",
    "from"  :   1604188855,
    "to"    :   1609459199
    }]
    notamFilterQuery(userFilterData)
    .then(function (response) {
        // handle success
        console.log("notamFilterQuery response",response);
        response.forEach(notamObject => {
            const notamHtml = notamDisplayTemplate({
                key         :   notamObject.key
                ,subject    :   notamObject.Subject
                ,subarea    :   notamObject.Subarea
                ,condition    :   notamObject.Condition
                ,modifier    :   notamObject.Modifier
                ,start    :   moment.unix(notamObject.startdate).utc().format('DDMMMYYYY HH:mm z')
                ,end    :   moment.unix(notamObject.enddate).utc().format('DDMMMYYYY HH:mm z')
                ,notamText    :   notamObject.all
                ,remark    :   notamObject.remark
                ,notamId   :   notamObject.id
            })
        
            notamTable.insertAdjacentHTML('beforeend',notamHtml)
              

        });
        
      })
    }


notamList.prototype.getNotamfromDbReact=function(){
    const userFilterData=  
    [{
    "icao"  :   "EDDF",
    "from"  :   1604188855,
    "to"    :   1609459199
    }]
    notamFilterQuery(userFilterData)
        .then(function (response) {
        // handle success
        return response
        
        })
    }

notamList.prototype.appendNotam=function(notamObject,notamTable){
    const notamHtml = notamDisplayTemplate({
        key         :   notamObject.key
        ,subject    :   notamObject.subject
        ,subarea    :   notamObject.subarea
        ,condition    :   notamObject.condition
        ,modifier    :   notamObject.modifier
        ,start    :   notamObject.startdate
        ,end    :   notamObject.endate
        ,notamText    :   notamObject.all
        ,remark    :   notamObject.remark
    })

    notamTable.insertAdjacentHTML('beforeend',notamHtml)

}


    


module.exports = notamList
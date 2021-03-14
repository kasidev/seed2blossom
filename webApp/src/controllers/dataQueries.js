const moment = require("moment")
const {findItemsOfType} = require('./curd')
const {findWithProp} = require('./curd')




module.exports.getGenusData = async function getGenusData(){
    const response = await findItemsOfType(1)
    const obj = response
    return obj
    }

module.exports.getItemData = async function getItemData(property,value){
    const response = await findWithProp(property,value)
    const obj = response
    return obj
    }
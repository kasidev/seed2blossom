const moment = require("moment")
const {findItemsOfType} = require('./curd')




module.exports.getGenusData = async function getGenusData(){
    const response = await findItemsOfType(1)
    const obj = response
    return obj
    }
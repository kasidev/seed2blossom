const moment = require("moment")
const {findItemsOfType} = require('./curd')




module.exports.getGenusData = async function getConfigFromDb(){
    const response = await findItemsOfType(1)
    const obj = response[0]
    return obj
    }
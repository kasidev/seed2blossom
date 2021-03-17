const moment = require("moment")
const {findItemsOfType} = require('./curd')
const {findWithProp} = require('./curd')
const {updateItem} = require('./curd')




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

module.exports.addNewProp = async function addNewProp(newPropParams){
    console.log(newPropParams)
    const allItemsOfType = await findWithProp("typeID",newPropParams.typeId)
    allItemsOfType.map((item)=>{
        updateItem({
            itemId: item.id,
            key : newPropParams.key,
            value : null
        })
    })


    
    return 
    }
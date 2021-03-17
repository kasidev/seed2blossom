const apiStrings = require('../utils/apiStrings.json')
const {getItemData} = require('./dataQueries')
const {addItem} = require('./curd')

module.exports.createNewItem= function createNewItem(typeID) {
    const cleanTemplate = {}
    const getTemplate = async () =>{
        const dbQuery = await getItemData("typeID",typeID)
        return dbQuery[0]}

    getTemplate().then((template)=>{
        for (const key in template) {
        
            const noEdit = ["typeName","typeID","id","_rid","_self","_etag","_attachments","_ts"]
            if(noEdit.indexOf(key) === -1){
                cleanTemplate[key]=null
            }

            const fixValues = ["typeName","typeID"]
            if(fixValues.indexOf(key) != -1){
                cleanTemplate[key]=template[key]
            }
        }
        addItem(cleanTemplate).then((response)=>{
            console.log("new item id", response.id)
            window.location.replace(`${apiStrings.url}/pages/edit.html?id=${response.id}&?type=genus`)
            
        })            
    })
    
} 
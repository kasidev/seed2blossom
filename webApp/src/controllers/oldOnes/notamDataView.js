const moment = require("moment")
const {notamFilterQuery} = require('./curd')
const {notamFilterQueryAllStatus} = require('./curd')
const {findItem} = require('./curd')
const {airsupportGetAirportNotams} = require('./curd')


module.exports.getNotamfromDbToCheck = async function getNotamfromDbToCheck(){

    const configObj = await findItem("c3e75bb2-903f-43d7-a56f-6cb167c642db")
    let obj = []  
     const result = await      
        configObj[0].configData.map(async (adData)=>{
            const newNotam = await airsupportGetAirportNotams(adData.icao)
            const filterData=[{
                "icao" : adData.icao.toUpperCase()
                ,"from" : adData.from
                ,"to" : adData.to}]
            const notamsfilterd = await notamFilterQuery(filterData)
            //console.log(adData.icao,notamsfilterd)
            notamsfilterd.map((notam)=>{
                obj.push(notam)
                //console.log(notam.location)
            })
        })
    const filteredList = await Promise.all(result)


    //console.log(filteredList)
        
    return obj
    }

module.exports.getNotamfromDbAllStatus = async function getNotamfromDbAllStatus(){

    const configObj = await findItem("c3e75bb2-903f-43d7-a56f-6cb167c642db")
    let obj = []  
        const result = await      
        configObj[0].configData.map(async (adData)=>{
            const newNotam = await airsupportGetAirportNotams(adData.icao)
            const filterData=[{
                "icao" : adData.icao.toUpperCase()
                ,"from" : adData.from
                ,"to" : adData.to}]
            const notamsfilterd = await notamFilterQueryAllStatus(filterData)
            //console.log(adData.icao,notamsfilterd)
            notamsfilterd.map((notam)=>{
                obj.push(notam)
                //console.log(notam.location)
            })
        })
    const filteredList = await Promise.all(result)


    //console.log(filteredList)
        
    return obj
    }

module.exports.getConfigFromDb = async function getConfigFromDb(){
    const response = await findItem("c3e75bb2-903f-43d7-a56f-6cb167c642db")
    const obj = response[0].configData
    return obj
    }

module.exports.getDashboardObj = async function getDashboardObj(){
    const response = await findItem("c3e75cf2-9b3f-43d7-a74f-6cb167c642db")
    return response
    }
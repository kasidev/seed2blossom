'use strict'

const e = React.createElement;
const moment = require('moment-timezone')
const {notamUpdate} = require('./curd')
const {getConfigFromDb} = require('./notamDataView')

let adObj=[{
    icao : "EDDF",
    from :  1577836800,
    to  : 1609372800
},
{
    icao : "LSZH",
    from :  1577836800,
    to  : 1609372800
},{
    icao : "LSZH",
    from :  1577836800,
    to  : 1609372800
}]

export class adConfigMenu extends React.Component{
    constructor(props){
        super(props)
        this.saveDateTimeInput=this.saveDateTimeInput.bind(this)
        this.saveIcaoInput=this.saveIcaoInput.bind(this)
        this.saveDateTimeChange=this.saveDateTimeChange.bind(this)
        this.saveConfig=this.saveConfig.bind(this)
        this.addAerodrome=this.addAerodrome.bind(this)
        this.deleteAerodrome=this.deleteAerodrome.bind(this)
        this.state = {
            adConfigData : adObj
        }
    }

    saveDateTimeChange(e){
        const stateData = this.state.adConfigData
        const index = parseInt(e.target.dataset.listindex)

        if (e.target.type === "time"){
            const timeInput=e.target.value
            if(e.target.dataset.startend === "from"){
                stateData[index].fromTimeString= timeInput
            }
            else{stateData[index].toTimeString= timeInput}
            
        }
        if (e.target.type === "date"){
            const dateInput=e.target.value
            if(e.target.dataset.startend === "from"){
                stateData[index].fromDateString= dateInput
            }
            else{stateData[index].toDateString= dateInput}
        }
        this.setState ({
            adConfigData : stateData
        })
    }
    
    
    saveDateTimeInput(e){
        const stateData = this.state.adConfigData
        const index = parseInt(e.target.dataset.listindex)
        let date = e.target.dataset.startend === "from" ? stateData[index].from : stateData[index].to
        date=moment.unix(date).utc()
        if (e.target.type === "time"){
            const timeInput=moment(e.target.value + " +00:00" , "HH:mm ZZ").utc()
            if(timeInput.isValid()){
                date = date.minutes(timeInput.minutes())
                date = date.hours(timeInput.hours())
            }
        }
        if (e.target.type === "date"){
            const dateInput=moment(e.target.value + " +00:00" , "YYYY-MM-DD ZZ").utc()
            if(dateInput.isValid()){
                date = date.year(dateInput.year())
                date = date.month(dateInput.month())
                date = date.date(dateInput.date())
            }
        }
        if(e.target.dataset.startend === "from")
            {stateData[index].from= date.unix()}
        else{stateData[index].to= date.unix()}
        
        this.setState ({
            adConfigData : stateData
        })
        
    }

    saveIcaoInput(e){
        const stateData = this.state.adConfigData
        stateData[parseInt(e.target.dataset.listindex)].icao= e.target.value
        this.setState ({
            adConfigData : stateData
        })
    }

    saveConfig(){
        console.log("go")
        const configData = this.state.adConfigData
        const updateParams = {
            notamId     :   "c3e75bb2-903f-43d7-a56f-6cb167c642db",
            key         :   "configData",
            value       :   configData   
        }
        notamUpdate(updateParams)
        location.reload()
        return 
    }

    addAerodrome(){
        const stateData = this.state.adConfigData
        const newAd = {
            icao : "KJFK",
            from :  1577836800,
            to  : 1609372800
        }
        stateData.push(newAd)
        this.setState ({
            adConfigData : stateData
        })
        
    }

    deleteAerodrome(e){
        const stateData = this.state.adConfigData
        const index = parseInt(e.target.dataset.listindex)
        stateData.splice(index,1)
        this.setState ({
            adConfigData : stateData
        })
        

    }

      
    render(){
        const renderAdRow = this.state.adConfigData.map((obj,index)=>{
            obj.listIndex = index
            const propsObj = {adSetting : obj
                , key : index
                ,onDateTimeChange : this.saveDateTimeChange
                ,onIcaoChange : this.saveIcaoInput
                ,onDateTimeBlur : this.saveDateTimeInput
                ,deleteAerodrome : this.deleteAerodrome}
            return    e(adRow,propsObj)
        })
        return e("div", 
        {className: "container"},
            e("div",{className: "row"},"Aerodrome config"),
            e("div",{},renderAdRow),
            e("div",{className: "row"},
                e("div",{className: "col-6"},
                    e("button",{onClick : this.saveConfig},"save config"),
                    e("button",{onClick : this.addAerodrome},"add airport")))
        )
    }
}

class adRow extends React.Component{
     constructor(props){
        super(props)
    }

    

    render(){
        return e("div", 
        {className: "row"}
            ,e("div",{className : "col-2 "},
                e("input",{type : "text",
                value : this.props.adSetting.icao
                ,onChange : this.props.onIcaoChange
                ,"data-listindex": this.props.adSetting.listIndex}))
            ,e("div",{className : "col-3"},
                e(dateTimeInput,
                    {rowData : this.props
                    ,startEnd : "from"}))
            ,e("div",{className : "col-3"},
                e(dateTimeInput,
                    {rowData : this.props
                    ,startEnd : "to"}))
            ,e("button",{onClick : this.props.deleteAerodrome},"delete airport")
        )
    }
}

class dateTimeInput extends React.Component{
    constructor(props){
        super(props)
    }

    /* setTimeValue(){
        const adsettings=this.props.rowData.adSetting
        let timestring = this.startEnd === "from" ? adsettings.fromTimeString : adsettings.toTimeString
        console.log(adsettings.fromTimeString)
        if(timestring){return timestring}

        const dateUnix = this.startEnd === "from" ? adsettings.from : adsettings.to
        timestring = moment.unix(dateUnix).utc().format("HH-mm")
        return timestring
    }

    setDateValue(){
        let dateString = this.startEnd === "from" ? adsettings.fromTimeString : adsettings.toTimeString
        if(dateString){return dateString}

        const dateUnix = this.startEnd === "from" ? adsettings.from : adsettings.to
        dateString = moment.unix(dateUnix).utc().format("YYYY-MM-DD")
        console.log(dateString)
        return dateString
    } */

    render(){
        const index = this.props.rowData.adSetting.listIndex
        const startEnd = this.props.startEnd
        return  e("div",{},
                    e("input",{
                        type : "date" 
                        ,onBlur : this.props.rowData.onDateTimeBlur
                        ,onChange : this.props.rowData.onDateTimeChange
                        ,"data-listindex": index
                        ,"data-startend": startEnd}),
                    e("input",{
                        type : "time"
                        ,onBlur : this.props.rowData.onDateTimeBlur
                        ,onChange : this.props.rowData.onDateTimeChange
                        ,"data-listindex": index
                        ,"data-startend": startEnd})
        )
    }
}



const domContainer = document.querySelector('#reactContainerADconfig')

export const getconfig = async (adMenuContainer) => {
    if(adMenuContainer){
        adObj = await getConfigFromDb()
        ReactDOM.render(e(adConfigMenu), adMenuContainer)
    }
    return adObj
}

getconfig(domContainer)


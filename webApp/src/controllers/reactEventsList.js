'use strict'
const {getItemData} = require('./dataQueries')
const {addNewProp} = require('./dataQueries')
const {updateItem} = require('./curd')
const {addItem} = require('./curd')
const moment = require('moment')
const queryString = require('query-string');
const apiStrings = require('../utils/apiStrings.json')
const {deleteItem} = require('./curd')

const e = React.createElement;

let newEvent= {}
let dataObject = [
    {
        "SubArea": "Database Error",
        "Condition": "No Notams found to display",
        "Subject": "Try again",
        "Modifier": "",
        "key": "ERR 420",
        "message" : "loading"
      },
]


class eventList extends React.Component{
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.goBackUrl = this.goBackUrl.bind(this);
        this.familyString = this.familyString.bind(this);
    
    
        this.state={
        dataObject
        }
    }

    goBackUrl(){
       const type = this.state.dataObject.itemData.typeID
        
        switch (type) {
            case 1:
                return `${apiStrings.url}/pages/index.html`
            case 2:
                return `${apiStrings.url}/pages/varietyList.html?id=${this.state.dataObject.itemData.genus}`
            case 3:
                return `${apiStrings.url}/pages/batchList.html?id=${this.state.dataObject.itemData.variety}`
            case 4:
                return `${apiStrings.url}/pages/seedList.html?id=${this.state.dataObject.itemData.batch}`
        
            default:
                return `${apiStrings.url}/pages/index.html`
        }
    }

    familyString(){
        const type = this.state.dataObject.itemData.typeID
        switch (type) {
            case 1:
                return ``
            case 2:
                return `${this.state.dataObject.parentData.genus.genus} - ${this.state.dataObject.itemData.name}`
            case 3:
                return `${this.state.dataObject.parentData.genus.genus} - ${this.state.dataObject.parentData.variety.name} - ${this.state.dataObject.itemData.name}`
            case 4:
                return `${this.state.dataObject.parentData.genus.genus} - 
                ${this.state.dataObject.parentData.variety.name} - 
                ${this.state.dataObject.parentData.batch.name} - 
                ${this.state.dataObject.itemData.callsign}`
        
            default:
                return `${apiStrings.url}/pages/index.html`
        }

    }

    
    handleDateChange(dateInput){
        newEvent.inputDate=moment(dateInput,"YYYY-MM-DD").unix()

    }
    
    handleChange(event) {
    event.target.id != "inputDate" 
    ? 
    newEvent[event.target.id] = event.target.value : this.handleDateChange(event.target.value)
        
    }

    addEvent(){
        const createEvent = async () => {
            addItem({
                typeName: "event",
                typeID: 5,
                parentID: this.state.dataObject.itemData.id,
                action: newEvent.inputAction,
                actionID: null,
                dateTime: newEvent.inputDate,
                remark: newEvent.inputRemark,
                customAttachments: {
                    picture: null
                },

            })
            return Promise
        }
        createEvent().then(()=>{
            alert("update complete")
        })

    }


    render(){
   
        const events = this.state.dataObject.eventData.map((event,index)=>{

            return e(renderEvent,
                {action: event.action,
                attachements: event.customAttachments,
                datetime : event.dateTime,
                remark : event.remark,
                key : event.id,
                id: event.id})
            

        })
            
        return e("div", 
        {className: "container"},
        e("div",{className : "row justify-content-center"},

            e("div",{className : "col-4 align-items-center"},
                e("a",
                {className: "h3", href: this.goBackUrl()}
                ,`Eventlist`) 
            )
        )
        ,e("div",{className : "row justify-content-center"},

            e("div",{className : "col-12 align-items-center"},
                e("h5",
                {className: "h5"}
                ,this.familyString()) 
            )
        )
        
        ,e("div",{},events)
        ,e("div",{className : "row justify-content-center"}
              
            ,e("div",{className : "col-2"},
                e("input",{className : "form-control", id: "inputAction", onBlur : this.handleChange, placeholder: "action"})
            )
            ,e("div",{className : "col-2"},
                e("input",{className : "form-control",id: "inputRemark", onBlur : this.handleChange, placeholder: "remark"})
            )
            ,e("div",{className : "col-2"},
                e("input",{className : "form-control",type: "date",id: "inputDate", onBlur : this.handleChange})
            )
            ,e("div",{className : "col-2"},
                e("input",{className : "form-control",type: "file",id:"file-picker",name:"image"})
            )
            ,e("div",{className : "col-3"},
                e("a",{className : "btn btn-success", onClick : this.addEvent},"Add")
            )
        )
        
        )
    }
}


class renderEvent extends React.Component{
     constructor(props){
        super(props)
        this.delete = this.delete.bind(this)
        this.state={
        }
    }

    
    delete(){
        deleteItem(this.props.id)
        alert("item deleted")
      }
    

    

    render(){
     

        return e("div", 
        {className: "row justify-content-center"}
        ,e("div",{className : "col-2"}
            ,this.props.action)
        ,e("div",{className : "col-2"}
            ,this.props.remark)
        ,e("div",{className : "col-2"}
            ,moment.unix(this.props.datetime).format("DD-MMM-YYYY")   
        )
        ,e("div",{className : "col-3"},
                e("a",{className : "btn btn-danger", onClick : this.delete},"X")
        )

        )
        
    }
}




const domContainer2 = document.querySelector('#reactEventsList')





const getData = async () => {
    const urlQuery = queryString.parse(location.search);
    console.log("item id ",urlQuery.id);
    const itemData = await getItemData("id",urlQuery.id)
    const eventData = await getItemData("parentID",urlQuery.id)
    const parentData = {}
    switch (itemData[0].typeID) {
        case 1:
            
            break;
        case 2:
            const parDataGenus = await getItemData("id",itemData[0].genus)
            parentData.genus = parDataGenus[0]
            break;
        case 3:
            
            const parDataVariety = await getItemData("id",itemData[0].variety)
            parentData.variety = parDataVariety[0]

            const parDataGenus1 = await getItemData("id",parDataVariety[0].genus)
            parentData.genus = parDataGenus1[0]
            
            break;
        case 4:

            const parDataBatch = await getItemData("id",itemData[0].batch)
            parentData.batch = parDataBatch[0]
            
            const parDataVariety1 = await getItemData("id",parDataBatch[0].variety)
            parentData.variety = parDataVariety1[0]

            const parDataGenus2 = await getItemData("id",parDataVariety1[0].genus)
            parentData.genus = parDataGenus2[0]
            
            break;
    
        default:
            break;
    }
    
    dataObject={"itemData":itemData[0],eventData,parentData}
        return Promise
}
export function displayData (reactContainer) {
    if(reactContainer){
        getData().then(()=>{
            console.log(dataObject)
            ReactDOM.render(e(eventList), reactContainer)
            
        })
    }
    
}
displayData(domContainer2)



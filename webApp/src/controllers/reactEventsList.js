'use strict'

import { isNull } from 'lodash'

const {getItemData} = require('./dataQueries')
const {addNewProp} = require('./dataQueries')
const {updateItem} = require('./curd')
const {addItem} = require('./curd')
const {deleteBlob} = require('./curd')
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
        this.uploadImage = this.uploadImage.bind(this);
    
    
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

    uploadImage(event){
        newEvent.image=event.target.files[0]
        console.log(newEvent)
    }

    addEvent(){
        const createEvent = async () => {
            
            if (newEvent.image) {
                const fileForm = new FormData()
                fileForm.append('eventImage',newEvent.image,newEvent.image.name)
                fetch('/uploadImage',{method : 'POST',body : fileForm}).then(uploadResponse=>{
                    return uploadResponse.json()
                }).then(data =>{
                    newEvent.customAttachments = {picture : data}
                    console.log("event with picture",newEvent)

                    addItem({
                        typeName: "event",
                        typeID: 5,
                        parentID: this.state.dataObject.itemData.id,
                        action: newEvent.inputAction,
                        actionID: null,
                        dateTime: newEvent.inputDate,
                        remark: newEvent.inputRemark,
                        customAttachments : newEvent.customAttachments
        
                    })
                })
            }
            else{
            const newItemData = await addItem({
                typeName: "event",
                typeID: 5,
                parentID: this.state.dataObject.itemData.id,
                action: newEvent.inputAction,
                actionID: null,
                dateTime: newEvent.inputDate,
                remark: newEvent.inputRemark,
                //customAttachments : newEvent.customAttachments

            })
            console.log("new item",newItemData.id)
            }
            
            
           

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
                e("form",{id:"upload-form",action:"/uploadData",method:"POST",encType:"multipart/form-data"},
                    e("input",{className : "form-control",type: "file",id:"file-picker",name:"image",onChange : this.uploadImage})
                )
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
        this.imageUrl = this.imageUrl.bind(this)
        this.toggleImage = this.toggleImage.bind(this)
        this.state={
            showImage : "row justify-content-center d-none"
        }
    }

    
    delete(){
        deleteItem(this.props.id)
        if (this.state.hasImage) {
            deleteBlob(this.props.attachements.picture.blobName)
        }
        alert("item deleted")
      }
    imageUrl(){
        const state = this.state
        if (this.props.attachements != undefined && this.props.attachements.hasOwnProperty("picture") )  {
            if (!(isNull(this.props.attachements.picture))) {
                state.hasImage = true
                return this.props.attachements.picture.url
            }
            else{
                state.hasImage = false
                return "https://kasidevstorage.blob.core.windows.net/seedpics/empty_baslik.png"
            }
            
        }
        else{
            state.hasImage = false
            return "https://kasidevstorage.blob.core.windows.net/seedpics/empty_baslik.png"
        }

    }
    toggleImage(){
        if(this.state.showImage === "row justify-content-center"){
            this.setState({showImage : "row justify-content-center d-none"})
        }
        else{
            this.setState({showImage : "row justify-content-center"})
        }
    }
    

    

    render(){
     

        return e("div",{className: "container"}
            ,e("div", 
            {className: "row justify-content-center"}
            ,e("div",{className : "col-2"}
                ,e("button",{className : "btn btn-primary", onClick : this.toggleImage},this.props.action)
                )
            ,e("div",{className : "col-2"}
                ,this.props.remark)
            ,e("div",{className : "col-2"}
                ,moment.unix(this.props.datetime).format("DD-MMM-YYYY")   
            )
            ,e("div",{className : "col-3"},
                    e("a",{className : "btn btn-danger", onClick : this.delete},"X")
                )
            )
            ,e("div", {className: this.state.showImage}
                ,e("div",{className : "col-6"}
                ,   e("img", {src: this.imageUrl(), height: 300})
                )
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



'use strict'
const {getItemData} = require('./dataQueries')
const {addNewProp} = require('./dataQueries')
const {updateItem} = require('./curd')
const moment = require('moment')
const queryString = require('query-string');
const apiStrings = require('../utils/apiStrings.json')

const e = React.createElement;

let updateLog = []
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


class editForm extends React.Component{
    constructor(props){
        super(props)
        this.commitChanges = this.commitChanges.bind(this)
        this.newProp = this.newProp.bind(this)
    
        this.state={
        itemData : dataObject[0]
        }
    }

    goBackUrl(type){
        type = this.state.itemData.typeName
        switch (type) {
            case "genus":
                return `${apiStrings.url}/pages/index.html`
            case "variety":
                return `${apiStrings.url}/pages/varietyList.html?id=${this.state.itemData.genus}`
            case "batch":
                return `${apiStrings.url}/pages/batchList.html?id=${this.state.itemData.variety}`
            case "seed":
                return `${apiStrings.url}/pages/seedList.html?id=${this.state.itemData.batch}`
        
            default:
                return `${apiStrings.url}/pages/index.html`
        }
    }

    newProp(e){
        const newProp = e.target.value
        const typeId = this.state.itemData.typeID
        if (newProp && confirm("add new property ?", newProp)) {
        const allProps=Object.keys(this.state.itemData)
                if (allProps.indexOf(newProp) === -1) {

                    const newPropParams = {
                        typeId: typeId,
                        key : newProp,
                        value : null
                    }
                    addNewProp(newPropParams)
                    
                    
                }
            }
        
    }


    commitChanges (){
        console.log(updateLog)
        
        const excecuteUpdate = async () => {updateLog.map((updateObj)=>{
            updateItem(updateObj)})
            return Promise
        }
        excecuteUpdate().then(()=>{
           // window.location.replace(this.goBackUrl())
          alert("update complete")
        })
    }

    render(){

   
        const renderProp = Object.keys(this.state.itemData).map((propName,index)=>{
            const noEdit = ["id","_rid","_self","_etag","_attachments","_ts"]
            if(noEdit.indexOf(propName) === -1){
                return e(itemProp,
                    {key: propName,
                    label: propName,
                    data: this.state.itemData[propName],
                    itemId : this.state.itemData.id})
            }

        })
            
        return e("div", 
        {className: "container"},
        e("div",{className : "row justify-content-center"},

            e("div",{className : "col-4 align-items-center"},
                e("a",
                {className: "h1", href: this.goBackUrl()}
                ,`edit`)
            )
        )
        ,e("div",{},renderProp)
        ,e("div",{className : "row justify-content-center"},
                            
            e("div",{className : "col-6 align-items-center"},
                e("input",{className : "form-control",
                            placeholder: "new property name",
                            onBlur: this.newProp})
                )
            )

        ,e("div",{className : "row justify-content-center"},
            e("div",{className : "col-4 align-items-center"},
                e("button",{className : "btn btn-primary", onClick : this.commitChanges},"update")
                )
            )
        )
    }
}


class itemProp extends React.Component{
     constructor(props){
        super(props)
        this.updateField = this.updateField.bind(this)
        this.state={
        }
    }

    updateField(e){
        const itemId = this.props.itemId
        const newValue = e.target.value != "" ? e.target.value : e.target.placeholder
        const property = this.props.label
        const updateParams = {
            itemId: itemId,
            key : property,
            value : newValue
        }
        const index = updateLog.findIndex((updateInstr)=>{
              if(updateInstr.itemId === updateParams.itemId
              &&
              updateInstr.key === updateParams.key){
                  return true
              }
            })
        
        console.log("updatefield",index)
        if (index != -1) {
            updateLog[index] = updateParams
          }else{updateLog.push(updateParams)} 
          console.log(updateLog)
        }

    

    

    render(){
     

        return e("div", 
        {className: "row"}
        ,e("div",{className : "col-6"}
            ,this.props.label),
        e("div",{className : "col-6"}
            ,e("input",
                {className : "form-control",
                placeholder: this.props.data,
                onBlur: this.updateField})    
        )
        )
        
    }
}




const domContainer2 = document.querySelector('#reactEdit')





const getData = async () => {
    const urlQuery = queryString.parse(location.search);
    console.log("item id ",urlQuery.id);
    const itemData = await getItemData("id",urlQuery.id)
    dataObject=itemData
        return Promise
}
export function displayData (reactContainer) {
    if(reactContainer){
        getData().then(()=>{
            console.log(dataObject)
            ReactDOM.render(e(editForm), reactContainer)
            
        })
    }
    
}
displayData(domContainer2)



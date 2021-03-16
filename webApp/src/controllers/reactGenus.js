'use strict'

import { template } from 'lodash';

const {getGenusData} = require('./dataQueries')
const {getItemData} = require('./dataQueries')
const {addItem} = require('./curd')
const moment = require('moment')
const queryString = require('query-string');
const url ="http://localhost:8080" 
//"https://seed2blossom.azurewebsites.net"
//http://localhost:8080

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


class genusList extends React.Component{
    constructor(props){
        super(props)
    
        this.state={
        status : 'test'
        ,data : dataObject
        }
    }

    newItem() {
        const typeID = 1
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
                window.location.replace(`${url}/pages/edit.html?id=${response.id}&?type=genus`)
                
            })            
        })
        
    } 


    render(){
        const genusElement = this.state.data.map((obj,index)=>{
            return    e(renderGenusElement,{genusData : obj, key : obj.id})
        })
        return e("div", 
        {className: "container"},
        e("div",{className : "row justify-content-center"},

            e("div",{className : "col-4 align-items-center"},
                e("h1",
                {className: ""}
                ,'Genus List')
            )
        )
        ,e("div",{},genusElement)
        ,e("div",{className : "row justify-content-center"},
            e("div",{className : "col-4 align-items-center"},
                e("button",{className : "btn btn-primary", onClick: this.newItem},"new")
                )
            )
        )
        
    }
}



class renderGenusElement extends React.Component{
     constructor(props){
        super(props)
        this.state={
            isChecked : false
        }
    }


    

    render(){
        const renderFirstRow = e(genusRow1,{
            key : this.props.genusData.id.concat("row1"),
            genusID : this.props.genusData.id,
            genusKey : this.props.genusData.key,
            genusName : this.props.genusData.genus,

            description: "Description"
        })

        return e("div", 
        {className: ""}
        ,e("div",{className : "col-12"}
            ,renderFirstRow))
        
    }
}


class genusRow1 extends React.Component{
       constructor(props){
          super(props)

      } 


      render(){

          return e("div", 
          {className: "row genusRow1"},
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-primary", href : `${url}/pages/varietyList.html?id=${this.props.genusID}`},this.props.genusName)),
            e("div",{className : "col-4"},this.props.description),
            e("div",{className : "col-4"},
                e("a",{className : "btn btn-primary", href : `${url}/pages/edit.html?id=${this.props.genusID}&?type=genus`},"Edit"))
            )
      }
  }



const domContainer2 = document.querySelector('#reactGenusSelect')



const getData = async () => {
    dataObject = await getGenusData()
    const parsed = queryString.parse(location.search);
    console.log(parsed);

    return Promise
}
export function displayData (reactContainer) {
    if(reactContainer){
        getData().then(()=>{
            ReactDOM.render(e(genusList), reactContainer)
            console.log("data received")
            console.log(dataObject)
        })
    }
    
}
displayData(domContainer2)



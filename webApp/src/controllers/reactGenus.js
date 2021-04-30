'use strict'

import { template } from 'lodash';

const {getItemData} = require('./dataQueries')
const moment = require('moment')
const {createNewItem} = require('./newItem')
const apiStrings = require('../utils/apiStrings.json')
const queryString = require('query-string');
const {deleteItem} = require('./curd')


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



    newItem(){
        createNewItem(1,null)
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
            commonName : this.props.genusData.commonName,

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
          this.delete = this.delete.bind(this)

      }
      
      delete(){
        deleteItem(this.props.genusID)
      }


      render(){

          return e("div", 
          {className: "row genusRow1"},
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-primary", href : `${apiStrings.url}/pages/varietyList.html?id=${this.props.genusID}`},
                `${this.props.genusName} - ${this.props.commonName}`)),
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-success", href : `${apiStrings.url}/pages/events.html?id=${this.props.id}`},"+")),
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-primary", href : `${apiStrings.url}/pages/edit.html?id=${this.props.genusID}&?type=genus`},"Edit")),
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-danger", onClick : this.delete},"Delete"))
            )
      }
  }



const domContainer2 = document.querySelector('#reactGenusSelect')



const getData = async () => {
    dataObject = await getItemData("typeID",1)
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



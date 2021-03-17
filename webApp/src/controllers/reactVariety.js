'use strict'
const {getItemData} = require('./dataQueries')
const moment = require('moment')
const queryString = require('query-string');
const {createNewItem} = require('./newItem')
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


class varietyList extends React.Component{
    constructor(props){
        super(props)
    
        this.state={
        status : 'test'
        ,varietyData : dataObject[1]
        ,genusData : dataObject[2]
        }
    }

    
    newItem(){
        createNewItem(2)
    }

    render(){
        const varietyElement = this.state.varietyData.map((obj,index)=>{
            return    e(renderVarietyElement,{botanicalData : obj, key : obj.id})
        })
        return e("div", 
        {className: "container"},
        e("div",{className : "row justify-content-center"},

            e("div",{className : "col-4 align-items-center"},
                e("a",
                {className: "h1", href: `${apiStrings.url}/pages/index.html`}
                ,`${this.state.genusData[0].genus} List`)
            )
        )
        ,e("div",{},varietyElement)
        ,e("div",{className : "row justify-content-center"},
            e("div",{className : "col-4 align-items-center"},
                e("button",{className : "btn btn-primary", onClick: this.newItem},"new")
                )
            )
        )
        
    }
}


class renderVarietyElement extends React.Component{
     constructor(props){
        super(props)
        this.state={
            isChecked : false
        }
    }


    

    render(){
        const renderFirstRow = e(varietyRow1,{
            reactkey : this.props.botanicalData.id.concat("row1"),
            id : this.props.botanicalData.id,
            key : this.props.botanicalData.key,
            name : this.props.botanicalData.name,

            description: "Description"
        })

        

        return e("div", 
        {className: ""}
        ,e("div",{className : "col-12"}
            ,renderFirstRow))
        
    }
}


class varietyRow1 extends React.Component{
       constructor(props){
          super(props)

      } 


      render(){

          return e("div", 
          {className: "row notamRow1"},
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-primary", href : `${apiStrings.url}/pages/batchList.html?id=${this.props.id}`},this.props.name)),
            e("div",{className : "col-4"},this.props.description),
            e("div",{className : "col-4"},
                e("a",{className : "btn btn-primary", href : `${apiStrings.url}/pages/edit.html?id=${this.props.id}&?type=variety`},"Edit"))
            )
      }
  }



const domContainer2 = document.querySelector('#reactVariety')





const getData = async () => {
    const urlQuery = queryString.parse(location.search);
    console.log("variety id ",urlQuery.id);
    const varietyData = await getItemData("genus",urlQuery.id)
    const genusData = await getItemData("id",urlQuery.id)
    dataObject.push(varietyData)
    dataObject.push(genusData)
        return Promise
}
export function displayData (reactContainer) {
    if(reactContainer){
        getData().then(()=>{
            console.log(dataObject)
            ReactDOM.render(e(varietyList), reactContainer)
            
        })
    }
    
}
displayData(domContainer2)



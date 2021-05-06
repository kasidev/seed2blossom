'use strict'
const {getItemData} = require('./dataQueries')
const moment = require('moment')
const queryString = require('query-string');
const {createNewItem} = require('./newItem')
const apiStrings = require('../utils/apiStrings.json')
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


class seedList extends React.Component{
    constructor(props){
        super(props)
        this.newItem=this.newItem.bind(this)
    
        this.state={
        status : 'test'
        ,seedData : dataObject[1]
        ,batchData : dataObject[2]
        ,varietyData : dataObject[3]
        ,genusData : dataObject[4]
        }
    }

    
    newItem(){
        createNewItem(4,this.state.batchData[0].id)
    }

    render(){
        const seedElement = this.state.seedData.map((obj,index)=>{
            return    e(renderSeedElement,{botanicalData : obj, key : obj.id})
        })
        return e("div", 
        {className: "container"},
        e("div",{className : "row justify-content-center"},

            e("div",{className : "col-12 align-items-center"},
                e("a",
                {className: "h2", href : `${apiStrings.url}/pages/batchList.html?id=${this.state.batchData[0].variety}`}
                ,`${this.state.genusData[0].genus} - ${this.state.varietyData[0].name} - ${this.state.batchData[0].name}`)
            )
        )
        ,e("div",{},seedElement)
        ,e("div",{className : "row justify-content-center"},
            e("div",{className : "col-4 align-items-center"},
                e("button",{className : "btn btn-primary", onClick: this.newItem},"new")
                )
            )
        )
        
    }
}


class renderSeedElement extends React.Component{
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
            name : this.props.botanicalData.callsign,

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
          this.delete = this.delete.bind(this)

      } 

      delete(){
        deleteItem(this.props.genusID)
      }



      render(){

          return e("div", 
          {className: "row notamRow1"},
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-primary", href : `${apiStrings.url}/pages/events.html?id=${this.props.id}`},this.props.name)),
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-success", href : `${apiStrings.url}/pages/events.html?id=${this.props.id}`},"+")),
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-primary", href : `${apiStrings.url}/pages/edit.html?id=${this.props.id}&?type=variety`},"Edit")),
            e("div",{className : "col-3"},
                e("a",{className : "btn btn-danger", onClick : this.delete},"Delete"))
            )
      }
  }



const domContainer2 = document.querySelector('#reactSeed')





const getData = async () => {
    const urlQuery = queryString.parse(location.search);
    console.log("variety id ",urlQuery.id);
    const seedData = await getItemData("batch",urlQuery.id)
    const batchData = await getItemData("id",urlQuery.id)
    const varietyData = await getItemData("id",batchData[0].variety)
    const genusData = await getItemData("id",varietyData[0].genus)
    dataObject.push(seedData)
    dataObject.push(batchData)
    dataObject.push(varietyData)
    dataObject.push(genusData)
        return Promise
}
export function displayData (reactContainer) {
    if(reactContainer){
        getData().then(()=>{
            console.log(dataObject)
            ReactDOM.render(e(seedList), reactContainer)
            
        })
    }
    
}
displayData(domContainer2)



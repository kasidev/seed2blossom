'use strict'
const {getGenusData} = require('./dataQueries')
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
                e("a",{className : "btn btn-primary", href : `${url}/edit?id=${this.props.genusID}&?type=genus`},"Edit"))
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



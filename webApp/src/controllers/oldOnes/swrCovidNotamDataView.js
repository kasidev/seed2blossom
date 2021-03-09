'use strict'

const moment = require("moment")
const {swrFirNotams} = require('../controllers/curd')
const e = React.createElement




const domContainer = document.querySelector('#swrCovidNotamDataView')
let xmlData={}

const getData =async function(){
    if(domContainer){
        xmlData = await swrFirNotams()
        //ReactDOM.render(e(swrDataView), domContainer)
    }
}
function renderDataView(){
    if(domContainer){
        console.log("data view")
        getData().then(()=>{
            console.log("promise resolved")
            ReactDOM.render(e(swrDataView), domContainer)
        })
    }
}

renderDataView()

class swrDataView extends React.Component{
    constructor(props){
        super(props)
        this.state={}
    }
    render(){
        //console.log("render",xmlData)
        
        return (
        e("div",{className : "container"},
                    e("h5",{},"NOTAM DATA LX COVID Ops-Support")
                

                    ,e("div",{className : "container"},
                        e("textarea",{className : "xmlData", rows : "10", cols : "50", defaultValue : xmlData})
                    )
                )
        )
    }
}
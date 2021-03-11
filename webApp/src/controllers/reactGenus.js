'use strict'
const {getGenusData} = require('./dataQueries')
const moment = require('moment')
const queryString = require('query-string');

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


export class notamList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            notamsData : notamDataObject,
            update : false,
            notamCount : notamDataObject.length
        }
    }
    commitChanges (){
        const excecuteUpdate = async () => {updateLog.map((updateObj)=>{
            notamUpdate(updateObj)})
            return Promise
        }
        excecuteUpdate().then((response)=>{
            setTimeout(()=>{
                getNotams().then(()=>{
                    this.setState({
                        notamsData : notamDataObject,
                        update : !this.state.update,
                        notamCount : notamDataObject.length
                    })
                })
            },500)
            
        })
        updateLog = []
        
        
    }
    
    render(){
        const renderNotam = this.state.notamsData.map((obj,index)=>{
            return    e(notamElement,{notamData : obj, key : obj.id})
        })
        return e("div", 
        {className: "container"},
        e("div",{className : "row justify-content-center"},

            e("div",{className : "col-4 align-items-center"},
                e("button",
                {onClick: () => this.commitChanges()
                ,className: "btn btn-outline-primary"}
                ,'Update List')
            )
        )
        ,e("div",{},renderNotam)
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

            description: "Description"
        })

        /* const renderSecondRow = e(notamRow2,{
            key : this.props.notamData.id.concat("row2"),
            startdate : this.props.notamData.startdate,
            enddate : this.props.notamData.enddate,
            notamID : this.props.notamData.id
        })

        const renderThirdRow = e(notamRow3,{
            key : this.props.notamData.id.concat("row3"),
            remark : this.props.notamData.remark,
            all : this.props.notamData.all,
            notamID : this.props.notamData.id
        }) */

        return e("div", 
        {className: ""}
        ,e("div",{className : "col-12"}
            ,renderFirstRow))
        /*    
        ,e("div",{className : "col-12"}
            ,renderSecondRow)
        ,e("div",{className : "col-12"}
            ,renderThirdRow)
        )*/
    }
}


class genusRow1 extends React.Component{
       constructor(props){
          super(props)

      } 


      render(){

          return e("div", 
          {className: "row notamRow1"},
            e("div",{className : "col-3"},this.props.genusKey),
            e("div",{className : "col-6"},this.props.description),
            e("div",{className : "col-3"}, 
                e("div",{className : "row"},
                    e("div",{className : "col-8"},
                        e("button",
                            {}
                            ,"Go")),
                    /* e("div",{className : "col-6"},
                        e("button",
                        {onClick: () => this.actionReq()}
                        ,"further action needed")) */
                )
            )
          )
      }
  }

/* class notamRow2 extends React.Component{
constructor(props){
    super(props)
    this.changeAssessment=this.changeAssessment.bind(this)
    }

    formatDate(unixTimestamp){
        const dateMoment = moment.unix(unixTimestamp).utc()
        const dateString = dateMoment.format("DD-MMM HH:mm")
        return dateString
    }

    changeAssessment(e){
        const id=this.props.notamID
        const statusId = e.target.value
         const updateParams = {
            notamId     :   id,
            key         :   "assesmentStatus",
            value       :   statusId   
        }
        const index = updateLog.findIndex((updateInstr)=>updateInstr.id===updateParams.id)
        if (index != -1) {
            updateLog[index] = updateParams
          }else{updateLog.push(updateParams)}           
        }

    render(){
        return e("div", 
        {className: "row notamRow2"},
            e("div",{className : "col-3"},this.formatDate(this.props.startdate)),
            e("div",{className : "col-3"},this.formatDate(this.props.enddate)),
            e("div",{className : "col-6", onChange:  this.changeAssessment},
                e("select",{className : "custom-select"},
                    e("option",{value : 0},"Not checked"),
                    e("option",{value : 420},"Not relevant"),
                    e("option",{value : 421},"Relevant"),
                    e("option",{value : 422},"Advice Flight crew"),
                    e("option",{value : 423},"Restricts operation")
                )
            )
        
        )
    
    }
}

class notamRow3 extends React.Component{
    constructor(props){
        super(props)
        this.changeRemark = this.changeRemark.bind(this)
        }

        changeRemark(e){
            const id=this.props.notamID
            const remarkString = e.target.value
             const updateParams = {
                notamId     :   id,
                key         :   "remark",
                value       :   remarkString   
            }
            const index = updateLog.findIndex((updateInstr)=>updateInstr.id===updateParams.id)
            if (index != -1) {
                updateLog[index] = updateParams
              }else{updateLog.push(updateParams)}
              console.log(updateLog)           
            }
    
        render(){
            return e("div", 
            {className: "row notamRow3"},
                e("div",{className: "col-12"},
                    e("div",{className: "row notamBody"}
                        ,e("div",{className: "col-12"},
                            e("p",{},this.props.all))
                    ),
                    e("div",{className: "row notamRemark"}
                        ,e("div",{className: "col-12"},
                            e("textarea",
                                {className : "form-control",
                                onBlur : this.changeRemark,
                                defaultValue : this.props.remark ? this.props.remark : ""}))
                    )
                )
            )
        
        }
    } */


const domContainer2 = document.querySelector('#reactGenusSelect')



const getData = async () => {
    dataObject = await getGenusData()

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



'use strict'
const {getNotamfromDbToCheck} = require('./notamDataView')
const {getNotamfromDbAllStatus} = require('./notamDataView')
const {notamUpdate} = require('./curd')
const moment = require('moment')

const e = React.createElement;

let updateLog = []
let notamDataObject = [
    {
        "SubArea": "Database Error",
        "Condition": "No Notams found to display",
        "Subject": "Try again",
        "Modifier": "",
        "key": "ERR 420",
        "message" : "loading"
      },
]


class loading extends React.Component{
    constructor(props){
        super(props)
    
        this.state={
        status : notamDataObject[0].message
        }
    }

    render(){
        console.log("loading")
        if(this.state.status = "loading"){
            return e("h1",{className : "display"},"Loading Data")
        }else{
            return e("h1",{className : "display"},"")
        }
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

class notamElement extends React.Component{
     constructor(props){
        super(props)
        this.onCheckOkButton=this.onCheckOkButton.bind(this)
        this.state={
            isChecked : false
        }
    }
    
    onCheckOkButton(){
        const id=this.props.notamData.id
        const updateParams = {
            notamId     :   id,
            key         :   "assesmentStatus",
            value       :   1   
        }
        const index = updateLog.findIndex((updateInstr)=>updateInstr.id===updateParams.id)
        if (index != -1) {
            updateLog[index] = updateParams
          }else{updateLog.push(updateParams)}
          this.setState({isChecked : true})
                     
    }

    render(){
        const checkOkClass = this.state.isChecked ? 'checked' : 'test'
        const renderFirstRow = e(notamRow1,{
            key : this.props.notamData.id.concat("row1"),
            notamID : this.props.notamData.id,
            notamKey : this.props.notamData.key,
            onCheckOkButton : this.onCheckOkButton,

            description: [  this.props.notamData.SubArea,
                            this.props.notamData.Condition,
                            this.props.notamData.Subject,
                            this.props.notamData.Modifier].join("-")
        })

        const renderSecondRow = e(notamRow2,{
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
        })

        return e("div", 
        {className: `row ${checkOkClass}`}
        ,e("div",{className : "col-12"}
            ,renderFirstRow)
        ,e("div",{className : "col-12"}
            ,renderSecondRow)
        ,e("div",{className : "col-12"}
            ,renderThirdRow)
        )
    }
}


class notamRow1 extends React.Component{
       constructor(props){
          super(props)

      } 

    actionReq(){
        const id=this.props.notamID
        const updateParams = {
            notamId     :   id,
            key         :   "assesmentStatus",
            value       :   2   
        }
        const index = updateLog.findIndex((updateInstr)=>updateInstr.id===updateParams.id)
        if (index != -1) {
            updateLog[index] = updateParams
          }else{updateLog.push(updateParams)}            
        }

      render(){

          return e("div", 
          {className: "row notamRow1"},
            e("div",{className : "col-3"},this.props.notamKey),
            e("div",{className : "col-6"},this.props.description),
            e("div",{className : "col-3"}, 
                e("div",{className : "row"},
                    e("div",{className : "col-8"},
                        e("button",
                            {onClick: () => this.props.onCheckOkButton()}
                            ,"check Ok")),
                    /* e("div",{className : "col-6"},
                        e("button",
                        {onClick: () => this.actionReq()}
                        ,"further action needed")) */
                )
            )
          )
      }
  }

class notamRow2 extends React.Component{
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
    }


const domContainer2 = document.querySelector('#reactContainerCheckNotam')
const domContainer3 = document.querySelector('#loadingCheckNotam')



const getNotams = async (filter) => {
    console.log("filger",filter)
    if(filter){
        notamDataObject = await getNotamfromDbToCheck()
        return Promise
    }else{
        notamDataObject = await getNotamfromDbAllStatus()
        return Promise
    }
}
export function updateList (filter,reactContainer) {
    if(reactContainer){
        getNotams(filter).then(()=>{
            ReactDOM.render(e(notamList), reactContainer)
        })
    }
    
}
updateList(true,domContainer2)



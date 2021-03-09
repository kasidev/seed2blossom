'use strict'

const moment = require("moment")
const {flightDashboardData} = require('../controllers/curd')
const e = React.createElement


const domContainer = document.querySelector('#opsDashboard')
let dasboardData={}
const getData =async function(){
    if(domContainer){
        console.log("refresh request send")
        dasboardData = await flightDashboardData()
        ReactDOM.render(e(opsDashboard), domContainer)
    }
}
function renderDasboard(){
    if(domContainer){
        getData().then(()=>{
            ReactDOM.render(e(opsDashboard), domContainer)
        })
    }
}

renderDasboard()

class opsDashboard extends React.Component{
    constructor(props){
        super(props)
        this.state={
            aerodromeData : dasboardData.aerodromeData,
            flights : dasboardData.flights
        }
    }
    render(){
        console.log("render",dasboardData)
        const renderFlightDiv = this.state.flights.map((fltObj)=>{
            return e(flightElement,{
                fltData : fltObj ,
                aerodromeData : this.state.aerodromeData, 
                key : fltObj.GUFI["_text"]})
        })

        return (
        e("div",{className : "container"},
                    e("h5",{},"opsDashboard")
                

                    ,e("div",{className : "container"},
                        e("div",{className : "flightCards"},renderFlightDiv)
                    )
                )
        )
    }
}

class flightElement extends React.Component{
    constructor(props){
        super(props)
    }

    displayAlt1(){
        if(this.props.fltData.Alt1["_text"]){
            console.log("3")
            return "btn btn-primary"
        }else{
            return "btn btn-primary hideAlt"
        }
    }
    displayAlt2(){
        if(this.props.fltData.Alt2["_text"]){
            return "btn btn-primary"
        }else{
            return "btn btn-primary hideAlt"
        }
    }

    renderAd(icao){
        return e(adComponent,{
            icao : icao,
            data : this.props.aerodromeData[icao], 
            key : this.props.fltData.GUFI["_text"]+icao,
            modalkey : this.props.fltData.GUFI["_text"]+icao+"modal"})

    }
    

    render(){
        const endInt = this.props.fltData.FlightlogID["_text"].indexOf("(")
        const flightName = this.props.fltData.FlightlogID["_text"].slice(3,endInt)
        const depAp = this.props.fltData.DEP["_text"]
        const desAp = this.props.fltData.DEST["_text"]
        const alt1Ap = this.props.fltData.Alt1["_text"]
        const alt2Ap = this.props.fltData.Alt2["_text"]
    
            
        return e("div",{className : "row"},
                    e("div",{className : "col-sm"},
                        e("div",{className : "card adCard"},
                            e("div",{className : "card-header"},
                                e("div",{className : "container"},
                                    e("div",{className : "row"},
                                        e("button",{className : "btn btn-primary"},flightName)
                                        ,e("button",{className : "btn btn-primary"},"WX")
                                        ,e("button",{className : "btn btn-primary"},"NOTAM")
                                        ,e("button",{className : "btn btn-primary"},depAp)
                                       ,e("button",{className : "btn btn-primary"},desAp)
                                       ,e("div",{className : "adDiv"},this.renderAd(alt1Ap))
                                       ,e("button",{className : this.displayAlt2()},alt2Ap)
                                    )
                                )
                            )
                            ,e("h5",{className : "card-body flightBody"},
                                e("div",{className : "container"},
                                    e("div",{className : "row"},
                                       e("p",{className : "btn btn-primary"},"info about the flith")
                                    )
                                )
                            )
                        )
                    )
        )
    }
}


class adComponent extends React.Component{
    constructor(props){
        super(props)
        this.closeModal=this.closeModal.bind(this)
        this.state = { modalState: false }
    }

    renderModal(icao){
        return e(adModal,{
            icao : icao,
            data : this.props.data, 
            key : this.props.modalkey,
            show : this.state.modalState,
            close : this.closeModal})

    }
    showModal(){
        this.setState({ modalState: true })
        console.log(this.state)
    }

    closeModal(){
        this.setState({ modalState: false })
    }

    render(){
        return e("div",{className: "adDiv2"},
                    e("button",{
                        className : "btn btn-primary",
                        onClick : () => this.showModal()},this.props.icao)
                    ,e("div",{className: "modalDiv"},this.renderModal(this.props.icao))
                )
    }

}

class adModal extends React.Component{
    constructor(props){
        super(props)
    }

    checkDisplay(){
        if(this.props.show){
            return "myModal showModal"
        }else{
            return "myModal hideModal"
        }
    }

    


    render(){
        return e("div",{className: this.checkDisplay()},
                    e("div",{className: "myModalContent"},
                        e("div",{className: "myModal-title"},this.props.icao)    
                        ,e("button",{onClick : this.props.close},"X")    
                    )
                )
    }

}
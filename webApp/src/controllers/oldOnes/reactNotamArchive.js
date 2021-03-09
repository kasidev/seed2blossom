'use strict'
const moment = require('moment')
const {getconfig} = require('./reactADconfig')
const {updateList} = require('./reactCheckNotam')

const e = React.createElement;



const domContainer1 = document.querySelector('#loadingNotamArchive')
const domContainer2 = document.querySelector('#reactContainerNotamArchive')
const domContainer3 = document.querySelector('#reactSearchBar')


getconfig(domContainer3)

updateList(false,domContainer2)



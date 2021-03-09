"use strict"
/**
 * 
 * @param {} selector CSS Selector on which you want to add an EventListener
 * @param {EventTarget} eventType The Event Type that you want to listen to
 * @param {*} cb The callback function which is triggered
 *
 */

module.exports.on = function on (selector, eventType, cb){
    document.addEventListener(eventType, (event) =>{
        /**@type {HTMLElement} */
        let element = event.target
        while (element) {
            if (element.matches(selector)) {
                return cb({
                    handleObj: element,
                    originalEvent: event
                })
            }
            element =element.parentElement
        }
    } )
}

module.exports.onPrevDef = function on (selector, eventType, cb){
    document.addEventListener(eventType, (event) =>{
        /**@type {HTMLElement} */
        let element = event.target
        while (element) {
            if (element.matches(selector)) {
                return cb({
                    handleObj: element,
                    originalEvent: event
                })
            }
            element =element.parentElement
        }
        event.preventDefault()
    } )
}
import React from 'react'

const Slots = (props) => {
    return (

        <div className=" col-md-6 m-auto p-4 rounded-lg" style={{ backgroundColor: "rgb(247 202 95)", border: "9px solid #f9ac24", boxShadow: "0px 1px 4px 1px" }} >
            <div className="row">
                <div id="slot1" ref={props.slot1} className="C"></div>
                <div id="slot2" ref={props.slot2} className="C"></div>
                <div id="slot3" ref={props.slot3} className="C"></div>
            </div>
        </div>
    )
}

export default Slots;
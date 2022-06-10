import React, { useRef } from 'react'
import axios from "axios";
import { deleteLocalstorage, setLocalstorage } from "../../../middlewares/session.js";
const Setting = (props) => {
    // cashout button hover for randomly move.
    const cashoutButton = useRef(null);
    const cashoutHover = () => {
        let mathRandom = Math.floor(Math.random() * 100);
        let element = cashoutButton.current
        if (mathRandom > 50) {
            element.style.position = "absolute";
            element.style.marginLeft = (Math.random() * 300) + "px";
            element.style.marginTop = (Math.random() * -300) + "px";
            element.disabled = false;
        } else if (mathRandom < 40) {
            element.removeAttribute("style");
            element.disabled = true;
        } else {
            element.disabled = false;
        }
    }

    // Transfer session total to bank total
    const cashOut = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/roll/cashout`).then(result => {
            let element = cashoutButton.current;

            if (result.data.status === 200) {
                deleteLocalstorage("session_total");
                setLocalstorage("bank_total", result.data.bank_total);
                props.setStatus(result.data.message);
                props.setCredit(result.data.session_total);
                props.setBankTotal(result.data.bank_total);
                element.removeAttribute("style");
                element.removeAttribute("disabled");
            } else {
                props.setStatus(result.data.message);
                element.removeAttribute("style");
                element.removeAttribute("disabled");
            }
        }).catch(err => {
            props.setStatus("SOMETHING WRONG!")
            console.log(err)
        })
    }
    // reset for backend and fronnted 
    const reset = () => {
        if (window.confirm("Are you sure you wish to reset all?")) {
            axios.get(`${process.env.REACT_APP_API_URL}/roll/reset`).then(result => {
                let element = cashoutButton.current;

                if (result.data.status === 200) {
                    deleteLocalstorage("session_total");
                    deleteLocalstorage("bank_total",);
                    props.setStatus("WELCOME!");
                    props.setCredit(result.data.session_total);
                    props.setBankTotal(result.data.bank_total);
                    element.removeAttribute("style");
                    element.removeAttribute("disabled");
                } else {
                    props.setStatus("Something Wrong!");
                    element.removeAttribute("style");
                    element.removeAttribute("disabled");
                }
            }).catch(err => {
                props.setStatus("SOMETHING WRONG!")
                console.log(err)
            })
        }

    }
    return (
        <div className=" infobox col-md-6 m-auto p-2" style={{ margin: 0 }}  >
            <div className="row">
                <div className="col-8 ">
                    <div className="row m-0 creditText p-2" style={{ height: "94px" }}>
                        <div className="col-9 pl-0">
                            <h5>BANK TOTAL : {props.bankTotal}</h5>
                            <div onMouseOver={cashoutHover}>
                                <button id="cashout" ref={cashoutButton} className="btn btn-sm btn-warning" onClick={cashOut} >CASH OUT</button> <br />
                            </div>
                        </div>
                        <div className="col-3 text-center p-0">
                            <button className="btn btn-sm btn-success mt-1"><img src={`./res/icons/audio${props.audioImage}.png`} style={{ height: "20px" }} alt="" id="audio" className="option" onClick={props.toggleAudio} /></button>
                        </div>
                    </div>
                </div>
                <div className="col-4 pl-0">
                    <div className="pt-4 text-center" style={{ height: "94px" }}>
                        <button className="btn btn-lg btn-warning" onClick={reset}>RESET</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Setting;
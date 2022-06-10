import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./main.css";
import Info from "./Info/info.js"
import Setting from "./setting/setting.js";
import Slots from "./slots/slot.js"
import { getLocalstorage, setLocalstorage } from "../../middlewares/session.js";

function Main() {
    const [doing, setDoing] = useState(false)
    const [spin] = useState([new Audio("./res/sounds/spin.mp3"), new Audio("./res/sounds/spin.mp3"), new Audio("./res/sounds/spin.mp3"), new Audio("./res/sounds/spin.mp3"), new Audio("./res/sounds/spin.mp3"), new Audio("./res/sounds/spin.mp3"), new Audio("./res/sounds/spin.mp3")]);
    const [coin] = useState([new Audio("./res/sounds/coin.mp3"), new Audio("./res/sounds/coin.mp3"), new Audio("./res/sounds/coin.mp3")])
    const [win] = useState(new Audio("./res/sounds/win.mp3"));
    const [lose] = useState(new Audio("./res/sounds/lose.mp3"));
    const [vol, setVol] = useState(true);
    const slot1 = useRef(null);
    const slot2 = useRef(null)
    const slot3 = useRef(null)
    const [audioImage, setAudioImage] = useState("On");
    const [status, setStatus] = useState("WELCOME!");
    const [credit, setCredit] = useState(10);
    const [bankTotal, setBankTotal] = useState(0);

    useEffect((sessionTotal, BankTotal) => {
        sessionTotal = getLocalstorage("session_total");
        BankTotal = getLocalstorage("bank_total")

        if (sessionTotal && sessionTotal > 10) {
            setCredit(sessionTotal);
        }
        if (BankTotal) {
            setBankTotal(BankTotal);
        }
    }, [credit, bankTotal]);

    //submit for spin
    const doSlot = () => {
        if (credit < 1) {
            setStatus("YOUR SESSION TOTAL 0");
            return null;
        }
        setDoing(true)
        setStatus("PLEASE WAIT!");
        slot1.current.className = "X";
        slot2.current.className = "X";
        slot3.current.className = "X";
        axios.get(`${process.env.REACT_APP_API_URL}/roll/doSpin/${credit}`).then(result => {
            console.log(result.data);
            setLocalstorage("session_total", result.data.session_total);
            setTimeout(
                function () {
                    setStatus("SPINNING...");
                    if (result.data.status === 200 || result.data.status === 202) {
                        doSpin(result.data);
                    } else {
                        setStatus("SOMETHING WRONG!");
                        slot1.current.className = "C";
                        slot2.current.className = "C";
                        slot3.current.className = "C";
                        return null
                    }
                },
                2500
            );

        }).catch(err => {
            setStatus("SOMETHING WRONG!");
            slot1.current.className = "C";
            slot2.current.className = "C";
            slot3.current.className = "C";
            setDoing(false)
            console.log(err)
        });

    }

    // after server response display result with a random spin for user experience
    const doSpin = (data) => {
        const arr = ["C", "L", "O", "W"];
        const slottest1 = setInterval(spin1, 55);
        const slottest2 = setInterval(spin2, 55);
        const slottest3 = setInterval(spin3, 55);
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let sound = 0;

        //spin for slot1
        function spin1() {
            count1++
            let element1 = slot1.current;

            if (count1 > 60) {
                element1.className = data.slot1.symbolName;
                coin[0].play()
                clearInterval(slottest1);
                return null;
            }

            let value1 = Math.floor(Math.random(1, 4) * 4)
            element1.className = arr[value1];
        }

        //spin for slot2
        function spin2() {
            count2++
            let element2 = slot2.current

            if (count2 > 80) {
                element2.className = data.slot2.symbolName;
                coin[1].play()
                clearInterval(slottest2);
                return null;
            }

            let value2 = Math.floor(Math.random(1, 4) * 4)
            element2.className = arr[value2];
        }

        //spin for slot3
        function spin3() {
            count3++
            let element3 = slot3.current

            if (count3 > 100) {
                element3.className = data.slot3.symbolName;
                coin[2].play();
                testWin(data);
                clearInterval(slottest3);
                return null;
            }

            let value3 = Math.floor(Math.random(1, 4) * 4);
            sound++;

            if (sound === spin.length) {
                sound = 0;
            }

            spin[sound].play();
            element3.className = arr[value3];
        }
    }

    //check user lose or winnig state.
    const testWin = (data) => {
        setDoing(false);

        if (data.status === 200) {
            win.play();
            setStatus(data.message);
            setCredit(data.session_total);
        } else {
            lose.play();
            setStatus(data.message);
            setCredit(data.session_total);
        }
    }
    // Audio sound vloume set
    const toggleAudio = () => {
        if (vol === false) {
            setVol(true);
            setAudioImage("On");
            for (let x of spin) {
                x.volume = 0.5;
            }
            for (let y of coin) {
                y.volume = 0.5;
            }
            win.volume = 1.0;
            lose.volume = 1.0;

        } else {
            setVol(false);
            setAudioImage("Off");

            for (let i of spin) {
                i.volume = 0;
            }
            for (let j of coin) {
                j.volume = 0;
            }

            win.volume = 0;
            lose.volume = 0;
        }
    }

    return (
        <div className="App" >
            <div className="conatainer-fluid p-2">
                <div className="row m-1" >
                    <div className=" col-md-6  m-auto" >
                        <div className="col-8">
                            <img src="./res/images/preloader_logo.png" alt="" className="img-fluid" />

                        </div>
                        <div className="col-4"></div>
                    </div>
                </div>
                <div className="row m-1">
                    <Slots slot1={slot1} slot2={slot2} slot3={slot3} />
                </div>
                <div className="row m-1 ">
                    <Info credit={credit} status={status} />
                </div>
                <div className="row m-1 mt-1">
                    <Setting
                        bankTotal={bankTotal}
                        toggleAudio={toggleAudio}
                        setBankTotal={setBankTotal}
                        setStatus={setStatus}
                        setCredit={setCredit}
                        audioImage={audioImage}
                    />
                </div>
                <div className="row m-1 mt-1">
                    <div className="col-md-6 m-auto p-2 rounded-lg text-center" style={{ margin: 0, background: "rgb(247 202 95)", border: "9px solid #f9ac24", boxShadow: "0px 1px 4px 1px" }}  >
                        <button className="btn btn-lg btn-secondary  submitLogo" onClick={doSlot} disabled={doing}> </button>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Main;
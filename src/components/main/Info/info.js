import React from 'react';

const Info = (props) => {
    return (

        <div className=" infobox col-md-6 m-auto p-2"  >
            <div className="row">
                <div className="col-4 ">
                    <h5> SESSION TOTAL </h5>
                    <div className="creditText p-2" >
                        <h5 style={{ textAlign: "center" }}>{props.credit}</h5>
                    </div>

                </div>
                <div className="col-8 ">
                    <h5> MESSAGE</h5>
                    <div className="creditText p-2" >
                        <h5 style={{ textAlign: "center" }}>{props.status}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Info;
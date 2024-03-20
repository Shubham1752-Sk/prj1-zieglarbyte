import React from "react";
import Template from "../components/CORE/AUTH/Template";
import {FORM_TYPE} from "../UTILS/constants"

const Signup = () =>{
    return(
        <Template
            form_type = {FORM_TYPE.SIGNUP}
            title = "Create Your Account"
        />
    )
}

export default Signup;
import React from "react";
import Template from "../components/CORE/AUTH/Template";
import { FORM_TYPE } from '../UTILS/constants'

const Login = () =>{
    return(
        <Template
            form_type = {FORM_TYPE.LOGIN}
            title = "Login"
        />
    )
}

export default Login;
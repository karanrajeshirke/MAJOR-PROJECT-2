import { useState,useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

//! if we are here means the base path is /dashboard and the nested is /user or /user/profile or /user/order
//! assume the path we wanted is /dashboard/user
//!but to access that we have to go through /dashboard and outlet will contain  -->   /user
 function UserRoute()
{
    const [auth,setAuth]=useAuth()
    const [ok,setOk]=useState(false)

    useEffect(()=>
    {
       
        const authCheck= async ()=>
        {
            try
            {
                const response=await axios.get('http://localhost:8080/api/v1/auth/user-auth',{
                    headers:
                    {
                        "Authorization":auth.token
                    }
                })
                if(response.data.ok===true)
                setOk(true)
            
            }
            catch(err)
            {
                if(err.response)
                console.log(err.response.data)
                else
                console.log(err)
            }
        }

        if(auth.token)
        {
            authCheck()
        }

    },[auth.token])

    //!any error  then please pass auth.token here

    return ok===true ? <Outlet/> :<Spinner/>
}

//! outlet is the page which you wanted to access


export  {UserRoute}
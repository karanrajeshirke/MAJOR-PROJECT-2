import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

//!Spinner has no URL / path therefore the location.pathname is going to contain 


const Spinner = ({path="login"}) => {

    let [count,setCount]=useState(3)
    let navigate=useNavigate()
    let location=useLocation()
    useEffect(()=>
    {
        const intervalId=setInterval(()=>
        {
            setCount((prevCount)=>
            {
                return prevCount-1
            })
        },1000)

        if(count===0)
        {
            console.log(`the path is this brother ${path}`)
            console.log(location.pathname)
            navigate(`/${path}`,{state:location.pathname})
        }

        return () => {
            clearInterval(intervalId);
          };
    },[count,navigate,path,location])
    //! if any error happens put navigate in depedency array
  return (
    <>
      <div className="spr d-flex flex-column justify-content-center align-items-center" style={{height:"100vh"}}>
      
      <h3>Redirecting you to Login Page in {count}</h3>
      

      <div className="spinner-border text-primary " role="status" style={{height:"3rem" ,width:"3rem"}}>
        <span className="sr-only">Loading...</span>
      </div>
   
      </div>
    </>
  );
};

export default Spinner
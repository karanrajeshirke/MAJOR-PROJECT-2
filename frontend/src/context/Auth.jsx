import { useContext,useState,createContext, useEffect} from "react";

//! here are making the data to be accessed over all routes

const AuthContext=createContext()


const AuthProvider=({children})=>
{

    const [auth,setAuth]=useState(
        {
            user:"",
            token:"" 
        }
    )

    useEffect(()=>
    {
        let data=localStorage.getItem('auth')

        if(data)
        {
            let parsedData=JSON.parse(data)

            setAuth((prevAuth)=>
            {
               
               return{
                ...prevAuth,
                user:parsedData.user,
                token:parsedData.token
               }
            })
        }
    },[])
    //! bcoz of this our login will be persisent
    
    return(
        <AuthContext.Provider value={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}


const useAuth=()=>
{
    return useContext(AuthContext)
}


export {useAuth,AuthProvider}
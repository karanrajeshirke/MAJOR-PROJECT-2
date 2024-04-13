import { createContext,useContext,useState } from "react";


const SearchContext=createContext()


const SearchProvider=({children})=>
{
    const [search,setSearch]=useState(
        {
            query:"",
            results:[]
        }
    )
    return(
       <SearchContext.Provider value={[search,setSearch]}>

        {children}

       </SearchContext.Provider>
    )
}

const useSearch=()=>
{
    return useContext(SearchContext)
}

export {useSearch,SearchProvider}

import Layout from "../../src/components/layout/Layout"
import AdminMenu from "../../src/components/layout/AdminMenu"
const Users=()=>
{

    return(
        <Layout>
        <div className="row">
            <div className="col-3">
                <AdminMenu/>
            </div>
            <div className="col-9">
               <h1>Users</h1>
    

            </div>

        </div>
    </Layout>
    )
}

export default Users
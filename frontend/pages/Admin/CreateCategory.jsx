import Layout from "../../src/components/layout/Layout";
import AdminMenu from "../../src/components/layout/AdminMenu";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../src/context/Auth";
import { Modal } from 'antd';
const CreateCategory = () => {
  //! all categories


  const [allCategories, setAllCategories] = useState([]);
  const [auth,setAuth]=useAuth()
  const getData = async () => {
    let response = await axios.get(
      "http://localhost:8080/api/v1/category/get-allcategory"
    );
    setAllCategories(response.data.allCategory);
  };

  useEffect(() => {
    getData();
  }, []);

  //! add a new category

  const [addCategory,setAddCategory]=useState("")

  const handleForm=async(event)=>
  {
    event.preventDefault()
    try
    {
      let response=await axios.post('http://localhost:8080/api/v1/category/create-category',{name:addCategory},
      {
        headers:
        {
          "Authorization":auth.token
        }
      })
     alert(response.data.message)
     setAddCategory("")
     getData()
    }
    catch(error)
    {
        if(error.response.data.message)
        {
          alert(error.response.data.message)
        }
        else
        {
          alert("Something went wrong ")
        }
    }
  }


  //!edit an category

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat,setSelectedCat]=useState({})


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const handleInput=(event)=>
  {
    setSelectedCat((prev)=>
    {
      return{
        ...prev,[event.target.name]:event.target.value
      }
    })
  }

  const handleEdit=async(cat)=>
  {
    showModal()
    setSelectedCat(cat)
  }

  const handleForm2=async(event)=>
  {
    event.preventDefault()
    try
    {
      let response=await axios.put(`http://localhost:8080/api/v1/category/update-category/${selectedCat._id}`,{name:selectedCat.name},
      {
        headers:
        {
          "Authorization":auth.token
        }
      })
      alert(response.data.message)
      getData()
    }
    catch(error)
    {
      if(error.response.data.message)
        {
          alert(error.response.data.message)
        }
        else
        {
          alert("Something went wrong ")
        }
    }
    handleOk()
  }
  

  //! delete a cateogry


  async function handleDelete(id)
  {
    try
    {
      let response=await axios.delete(`http://localhost:8080/api/v1/category/delete-category/${id}`,
      {
        headers:
        {
          "Authorization":auth.token
        }
      })
      alert(response.data.message)
      getData()
    }
    catch(error)
    {
      if(error.response.data.message)
        {
          alert(error.response.data.message)
        }
        else
        {
          alert("Something went wrong ")
        }

        console.log(error.response)
    }

  }

  return (
    <Layout>
      <div className="row ">
        <div className="col-md-3 ">
          <AdminMenu />
        </div>
        <div className="col-md-9 ">
          <div className="row">
            <div className="col-12 col-sm-12 col-xs-12">
              <h1>Create Category</h1>

              <div className="category-form ">
                <form onSubmit={handleForm}>
                  <div className="form-group w-50">
                    Enter Category name
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Shoes" onChange={(event)=>setAddCategory(event.target.value)}
                      value={addCategory}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>

            <div className="category-table  w-75">
            <div className="table-responsive ">
            <table className="table table-striped">
    <thead>
      <tr>
        <th scope="col">SR NO</th>
        <th scope="col">Name</th>
        <th scope="col">EDIT</th>
        <th scope="col">DELETE</th>

      </tr>
    </thead>
    <tbody>
      {allCategories &&
        allCategories.map((cat, index) => {
          return (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{cat.name}</td>
              <td>
                <button className="btn btn-primary"  onClick={()=>handleEdit(cat)}>Edit</button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={()=>handleDelete(cat._id)}>Delete</button>
              </td>
            </tr>
          );
        })}
    </tbody>
  </table>
    </div>
            </div>
          </div>
        </div>
      </div>

      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
      <form onSubmit={handleForm2}>
                  <div className="form-group">
                    Update Category name
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Shoes" 
                      name="name"
                      value={selectedCat.name}
                      onChange={handleInput}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
      </Modal>
    </Layout>
  );
};

export default CreateCategory;



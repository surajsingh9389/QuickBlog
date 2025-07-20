import React, { useEffect, useState } from 'react'
import { blog_data } from '../../assets/assets'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'


const ListBlog = () => {
  const [blogs, setBlogs] = useState([])
  const {axios} = useAppContext();
  
  const fetchBlogs = async () => {
     try{
        const res = await axios.get('/api/admin/blogs');
        setBlogs(res.data);
     }catch(error){
       toast.error(error.response.data.message);
     }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])
  
  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <h1>All blogs</h1>

     <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white my-4">
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-gray-600 text-left uppercase">
              <tr>
                <th scope="col" className="px-2 py-4 xl:px-6">
                  #
                </th>
                <th scope="col" className="px-2 py-4">
                  Blog Title
                </th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">
                  Date
                </th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">
                  Status
                </th>
                <th scope="col" className="px-2 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {blogs.map((blog, index)=>{
                 return <BlogTableItem key={index} blog={blog} fetchBlogs={fetchBlogs} index={index+1}/>
              })}
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default ListBlog

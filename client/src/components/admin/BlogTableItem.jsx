import React, { useEffect } from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({blog, fetchBlogs, index}) => {
    const {title, createdAt} = blog;
    const BlogDate = new Date(createdAt);
    const { axios } = useAppContext();

    const deleteBlog = async()=>{
        const message = window.confirm("Are sure you want to delete this blog?");
        if(!message) return;
        try{
          const res = await axios.post('/api/blog/delete', {blogId: blog._id});
          toast.success(res.data.message);
          await fetchBlogs()
        }catch(error){
          toast.error(error.response.data.message);
        }
    }

    const togglePublish = async () =>{
      try{
        const res = await axios.post('/api/blog/toggle-publish', {blogId: blog._id});
        toast.success(res.data.message);
        await fetchBlogs()
      }catch(error){
        toast.error(error.response.data.message);
      }
    }
    

  return (
    <tr className='border-y border-gray-300'>
       <th className='px-2 py-4'>{ index }</th>
       <td className='px-2 py-4'> {title} </td>
       <td className='px-2 py-4 mx-sm:hidden'> {BlogDate.toDateString()} </td>
       <td className='px-2 py-4 mx-sm:hidden'>
        <p className={`${blog.isPublished ? "text-green-600": "text-orange-700"}`}>
            {blog.isPublished ? 'Published': 'Unpublished'}
        </p>
       </td>
       <td className='px-2 py-4 flex text-xs gap-3'>
        <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>{blog.isPublished ? 'Unpublish': 'Publish'}</button>

       <img onClick={deleteBlog} src={assets.cross_icon} alt="cross" className='w-8 hover:scale-110 transition-all cursor-pointer'/>
       </td>
    </tr>
  )
}

export default BlogTableItem

import React from 'react'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Header/>
      <BlogList/>
      <NewsLetter/>
      <Footer/>
    </div>
  )
}

export default Home

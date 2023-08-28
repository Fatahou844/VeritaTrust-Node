import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import Footer from './components/Footer';
import Blog from  './pages/Blog';
import Create from './pages/Create';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Resources from './pages/Resources';
import ReviewProduct from './pages/ReviewProduct';
import { useParams } from 'react-router-dom'
import SearchResult from './pages/SearchResult';
import ReviewMerchant from './pages/ReviewMerchant';
import UserDashboard from './pages/UserDashboard';
import ReviewsPage from './pages/ReviewsPage';
import OrgReviewForm from './components/OrgReviewForm';
import OrgReviewFormPage from './pages/OrgReviewFormPage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <React.StrictMode>
      
       <Router>
      
      <Header />
      <Routes>
        <Route path="/" element = {<Home />} />
        <Route path="Explore" element = {<Explore />} />
        <Route path="Resources" element = {<Resources/>} />

        <Route path="Blog" element = {<Blog />} />


        <Route path="Create" element = {<Create />} />
       
        <Route path="review-product/:product_name" element={ <ReviewProduct/>}  />
        <Route path="review-merchant/:website" element={ <ReviewMerchant/>}  />
        <Route path="search" element={ <SearchResult/>}  />
        <Route path="user-dashboard" element={ <UserDashboard/>}  />
        <Route path="all-reviews" element={ <ReviewsPage/>}  />
        <Route path="listings/write-review/:product_name" element={ <OrgReviewFormPage/>}  />
       

      </Routes>
      <Footer></Footer>
    </Router>
  </React.StrictMode>
);


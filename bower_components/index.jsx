import React, { useState } from "react"; 
import '../../styles/bootstrap.css'
import '../../styles/style.css'
import '../../styles/flaticon_veritatrust.css'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from "axios";
import OrgReviewForm from "../../components/OrgReviewForm";

function OrgReviewFormPage()
{

    let { product_name } = useParams();

    const [product, setProduct] = useState([]);

    useEffect(() => {
        let fetchReviews = async () => {
         
            const res = await axios.get("http://localhost:4000/api/products/"+product_name.toString());
            setProduct(res.data[0]);

            console.log(res.data[0]);
            
        };
        fetchReviews();
    }, []);

    return (<>
      <OrgReviewForm data={product} textAreaId="content"></OrgReviewForm>
    </>)
}

 export default OrgReviewFormPage;
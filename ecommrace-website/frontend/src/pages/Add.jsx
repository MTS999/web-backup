import React, { useState } from 'react';

const AddProduct = () => {

    const userID =JSON.parse(localStorage.getItem("user"))._id
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
    company: '',
    userId:userID
  });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleSubmit =async () => {
        // console.log('Product Data:', productData);

        let result= await fetch("http://localhost:5000/addproduct",{

            method:"post",
            body:JSON.stringify(productData),
            headers: {
                'Content-Type': 'application/json',
                authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`


            }
        }
        )

        result =await result.json()
        console.log(result)
        setProductData({
            name: '',
            price: '',
            category: '',
            company: '',
            userId: userID
        });
    };

    return (
        <div>
            <h2>Add Product</h2>
            <div >
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={productData.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="text" name="price" value={productData.price} onChange={handleChange} />
                </div>
                <div>
                    <label>Category:</label>
                    <input type="text" name="category" value={productData.category} onChange={handleChange} />
                </div>
                <div>
                    <label>Company:</label>
                    <input type="text" name="company" value={productData.company} onChange={handleChange} />
                </div>
                <button onClick={handleSubmit}>Add Product</button>
            </div>
        </div>
    );
};

export default AddProduct;

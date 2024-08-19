import React, { useEffect, useState } from 'react';
import { useParams ,useNavigate} from 'react-router-dom';


const Update = () => {

  const navigate=useNavigate()
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        category: '',
        company: '',
    });
    const params = useParams()

    // console.log(params)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleUpdate = async () => {
            // console.log('Product Data:', productData);

            let result= await fetch(`http://localhost:5000/update/${params.id}`,{

                method:"put",
                body:JSON.stringify(productData),
                headers: {
                    'Content-Type': 'application/json',
                    authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`


                }            }
            )

            result =await result.json()
            console.log(result)
            navigate("/")

            setProductData({
                name: '',
                price: '',
                category: '',
                company: '',
            });
    };

    useEffect(() => {
        getProduct()
    }, [])
    const getProduct = async () => {
        let result = await fetch(`http://localhost:5000/product/${params.id}`
            , {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`


                }
            }
        )

        result = await result.json()

        setProductData(result)
    }
    return (
        <div>
            <h2>Update Product</h2>
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
                <button onClick={handleUpdate}>update Product</button>
            </div>
        </div>
    );
};

export default Update;

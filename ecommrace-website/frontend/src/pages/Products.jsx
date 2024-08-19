
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import React from "react"


const Products = () => {

    const [products, setProduct] = React.useState([])
    console.log(products)
    useEffect(() => {
        getProduct()
    }, [])

    const getProduct = async () => {
        try {
            const result = await fetch("http://localhost:5000/product", {
                method: "GET",
                headers: {
                    // 'Content-Type': 'application/json',
                    authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`

                }
            });
            const data = await result.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    async function deleteItem(id) {

        let result = await fetch(`http://localhost:5000/delete/${id}`, {
            method: "delete",
            headers:{
                authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`

            }
        })

        result = await result.json()

        console.log(result)

        if (result) {
            getProduct()
        }

    }

    const handleSearch = async (e) => {
        const key = e.target.value
        if (key) {
            const result = await fetch(`http://localhost:5000/search/${key}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`

                }
            });
            const data = await result.json();
            setProduct(data);

        }
        else{
            getProduct()
        }

    }

    return (

        <>
            <div className="products">

                <input type="text" onChange={handleSearch} placeholder="search product" className="search" />
                <ul className="product-list">
                    <li>S.NO</li>
                    <li>name</li>
                    <li>Price</li>
                    <li>Category</li>
                    <li>ooperation</li>

                </ul>


                {
                   products.length>0 ? products.map((item, index) => (
                        <ul className="product-list" key={index}>
                            <li>{index + 1}</li>
                            <li>{item.name}</li>
                            <li>{item.price}</li>
                            <li>{item.category}</li>
                            <li><button onClick={() => deleteItem(item._id)}>delete</button></li>
                            <li><Link to={`/update/${item._id}`}>update</Link></li>


                        </ul>
                    ))
                    :
                    <h1>not product found</h1>
                }



            </div>

        </>
    )
}

export default Products
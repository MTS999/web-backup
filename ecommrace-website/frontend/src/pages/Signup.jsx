import React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
const Signup = () => {


    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    // console.log(name, email, password);
    const navigate = useNavigate()
    useEffect(() => {
        const auth = localStorage.getItem("user")
        if (auth) {
            navigate("/")
        }
    })

    const handleClick = async () => {
        let result = await fetch("http://localhost:5000/signup", {
            method: 'post',
            body: JSON.stringify({
                name, email, password
            }),
            headers: {
                'Content-Type': 'application/json'

            }

        });
        result = await result.json()
        localStorage.setItem("user", JSON.stringify(result.result))
        localStorage.setItem("token", JSON.stringify(result.auth))
        if (result) {
            navigate("/")
        }
        console.log(result);

    }
    return (
        <>
            <div className="form">


                <input
                    className="name input"
                    type="text"
                    name=""
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name"
                />
                <input
                    className="email input"

                    type="email"
                    name=""
                    id="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}

                />
                <input
                    className="password input"

                    type="password"
                    name=""
                    id="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="input" onClick={handleClick}> Signup</button>
            </div>
        </>
    )
}

export default Signup
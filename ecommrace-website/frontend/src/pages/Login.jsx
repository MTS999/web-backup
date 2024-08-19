import React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
const Signup = () => {


    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    const navigate = useNavigate()
    useEffect(() => {
        const auth = localStorage.getItem("user")
        if (auth) {
            navigate("/")
        }
    })

    const handleClick = async () => {
        let result = await fetch("http://localhost:5000/login", {
            method: 'post',
            body: JSON.stringify({
                email, password
            }),
            headers: {
                'Content-Type': 'application/json'

            }

        });
        result = await result.json()
        if (result.auth) {

            localStorage.setItem("user", JSON.stringify(result.user))
            localStorage.setItem("token", JSON.stringify(result.auth))

            navigate("/")
        }
        console.log(result);

    }
    return (
        <>
            <div className="form">



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

                <button className="input" onClick={handleClick}> Login </button>
            </div>
        </>
    )
}

export default Signup
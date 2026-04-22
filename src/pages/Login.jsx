import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {

        e.preventDefault()

        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            alert(error.message)
        } else {
            navigate("/dashboard")
        }

        setLoading(false)

    }

    return (

        <div className="min-h-screen flex items-center justify-center">

            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl w-96 border border-white/10">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Login
                </h1>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 mb-4 rounded-lg bg-black/30 border border-white/10"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 mb-4 rounded-lg bg-black/30 border border-white/10"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>


                    <p className="text-center mt-4 text-gray-400">

                        Don't have an account ?

                        <Link
                            to="/signup"
                            className="text-blue-400 ml-2"
                        >
                            Signup
                        </Link>

                    </p>


                </form>



            </div>

        </div>

    )

}

export default Login
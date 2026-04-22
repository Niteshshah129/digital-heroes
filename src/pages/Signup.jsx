import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"

const Signup = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [country, setCountry] = useState("")
    const [loading, setLoading] = useState(false)

    const signup = async () => {

        setLoading(true)

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) {
            alert(error.message)
            setLoading(false)
            return
        }

        const user = data.user

        await supabase
            .from("profiles")
            .insert([
                {
                    id: user.id,
                    name,
                    phone,
                    country
                }
            ])

        alert("Signup Success")

        navigate("/login")

        setLoading(false)

    }

    return (

        <div className="min-h-screen flex items-center justify-center">

            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl w-[400px] border border-white/10 shadow-xl">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Create Account
                </h1>

                {/* Name */}

                <input
                    placeholder="Full Name"
                    className="w-full p-3 mb-3 rounded-lg bg-black/30 border border-white/10"
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Email */}

                <input
                    placeholder="Email"
                    className="w-full p-3 mb-3 rounded-lg bg-black/30 border border-white/10"
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password */}

                <input
                    placeholder="Password"
                    type="password"
                    className="w-full p-3 mb-3 rounded-lg bg-black/30 border border-white/10"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Phone */}

                <input
                    placeholder="Phone"
                    className="w-full p-3 mb-3 rounded-lg bg-black/30 border border-white/10"
                    onChange={(e) => setPhone(e.target.value)}
                />

                {/* Country */}

                <input
                    placeholder="Country"
                    className="w-full p-3 mb-4 rounded-lg bg-black/30 border border-white/10"
                    onChange={(e) => setCountry(e.target.value)}
                />

                <button
                    onClick={signup}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold"
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>

                <p className="text-center mt-4 text-gray-400">

                    Already have account ?

                    <Link
                        to="/login"
                        className="text-blue-400 ml-2"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    )

}

export default Signup




import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"

import ScoreForm from "../components/ScoreForm"
import ScoreList from "../components/ScoreList"
import CharitySelect from "../components/CharitySelect"
import Subscription from "../components/Subscription"
import DrawResult from "../components/DrawResult"
import Winners from "../components/Winners"
import MyWinnings from "../components/MyWinnings"
import UserProfile from "../components/UserProfile"

const Dashboard = () => {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [scores, setScores] = useState([])
    const [subscription, setSubscription] = useState(null)
    const [winnings, setWinnings] = useState(0)

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {

        const { data } = await supabase.auth.getUser()

        if (!data.user) {
            navigate("/login")
        } else {
            setUser(data.user)
            fetchScores(data.user)
            fetchSubscription(data.user)
            fetchWinnings(data.user)
        }

    }

    const fetchScores = async (currentUser) => {

        const { data } = await supabase
            .from("scores")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("date", { ascending: false })

        setScores(data)

    }

    const fetchWinnings = async (user) => {

        const { data } = await supabase
            .from("winners")
            .select("*")
            .eq("user_id", user.id)

        let total = 0

        data.forEach(item => {
            total += item.prize || 0
        })

        setWinnings(total)

    }


    const fetchSubscription = async (user) => {

        const { data } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

        if (data) {

            const expiry = new Date(data.expires_at)
            const today = new Date()

            if (today > expiry || data.status === "cancelled") {
                setSubscription(null)
            } else {
                setSubscription(data)
            }

        } else {
            setSubscription(null)
        }

    }

    const logout = async () => {
        await supabase.auth.signOut()
        navigate("/login")
    }

    return (

        <div className="min-h-screen p-8">

            {/* Header */}
            {user && <UserProfile user={user} />}

            <div className="flex justify-between items-center mb-8">



                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>



                <div className="flex gap-4">

                    <Link
                        to="/admin"
                        className="px-4 py-2 bg-purple-600 rounded-lg"
                    >
                        Admin
                    </Link>

                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-3 gap-6 mb-8">

                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-gray-400">Subscription</h3>
                    <p className="text-2xl font-bold mt-2">
                        {subscription ? subscription.plan : "Inactive"}
                    </p>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-gray-400">Scores</h3>
                    <p className="text-2xl font-bold mt-2">
                        {scores.length}
                    </p>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-gray-400">Winnings</h3>
                    <p className="text-2xl font-bold mt-2">
                        ${winnings}
                    </p>
                </div>

            </div>

            {/* Draw */}

            <div className="mb-8">
                <DrawResult />
            </div>

            {/* Main */}

            <div className="grid grid-cols-3 gap-6">

                {subscription ? (
                    <ScoreForm
                        user={user}
                        fetchScores={() => fetchScores(user)}
                    />
                ) : (
                    <div className="bg-white/5 p-6 rounded-xl">
                        <p className="text-gray-400">
                            Subscribe to add scores
                        </p>
                    </div>
                )}

                <ScoreList scores={scores} />

                {subscription && (
                    <CharitySelect user={user} />
                )}

            </div>

            {/* Subscription */}

            <div className="mt-8">

                {user && (
                    <Subscription
                        user={user}
                        refresh={() => fetchSubscription(user)}
                    />
                )}

            </div>

            {/* Winners */}

            <div className="mt-8">
                <Winners />
            </div>

            {/* My Winnings */}

            <div className="mt-8">

                {user && (
                    <MyWinnings user={user} />
                )}

            </div>

        </div>

    )

}

export default Dashboard
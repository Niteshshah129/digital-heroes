import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { checkMatch } from "../utils/matchLogic"
import { calculatePrize } from "../utils/prizeLogic"
import { Link } from "react-router-dom"
import AdminWinners from "../components/AdminWinners"
import { sendEmail } from "../utils/email"

const Admin = () => {

    const [numbers, setNumbers] = useState("")
    const [users, setUsers] = useState([])
    const [scores, setScores] = useState([])
    const [subscriptions, setSubscriptions] = useState([])
    const [simulation, setSimulation] = useState(null)
    const [profiles, setProfiles] = useState([])

    useEffect(() => {
        fetchUsers()
        fetchScores()
        fetchSubscriptions()
        fetchProfiles()
    }, [])



    // ---------------- USERS ----------------

    const fetchUsers = async () => {

        const { data } = await supabase
            .from("subscriptions")
            .select("user_id")

        setUsers(data || [])

    }


    // ---------------- SCORES ----------------

    const fetchScores = async () => {

        const { data } = await supabase
            .from("scores")
            .select("*")

        setScores(data || [])

    }


    // ---------------- SUBSCRIPTIONS ----------------

    const fetchSubscriptions = async () => {

        const { data } = await supabase
            .from("subscriptions")
            .select("*")

        setSubscriptions(data || [])

    }




    const fetchProfiles = async () => {

        const { data } = await supabase
            .from("profiles")
            .select("*")

        setProfiles(data)

    }



    // ---------------- SIMULATION ----------------

    const simulateDraw = async () => {

        const { data: lastDraw } = await supabase
            .from("draws")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)

        const jackpot = lastDraw?.[0]?.jackpot || 0

        const prize = calculatePrize(subscriptions, jackpot)

        const userMap = {}

        scores.forEach(item => {
            if (!userMap[item.user_id]) {
                userMap[item.user_id] = []
            }
            userMap[item.user_id].push(item.score)
        })

        let match5 = 0
        let match4 = 0
        let match3 = 0

        for (const userId in userMap) {

            const match = checkMatch(numbers, userMap[userId])

            if (match === 5) match5++
            if (match === 4) match4++
            if (match === 3) match3++

        }

        setSimulation({
            match5,
            match4,
            match3,
            prize
        })

    }


    // ---------------- CREATE DRAW ----------------

    const createDraw = async () => {

        const { data: lastDraw } = await supabase
            .from("draws")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)

        const jackpot = lastDraw?.[0]?.jackpot || 0

        const prize = calculatePrize(subscriptions, jackpot)

        const date = new Date()

        const { data: drawData } = await supabase
            .from("draws")
            .insert([
                {
                    numbers,
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                }
            ])
            .select()

        const drawId = drawData[0].id

        const userMap = {}

        scores.forEach(item => {
            if (!userMap[item.user_id]) {
                userMap[item.user_id] = []
            }
            userMap[item.user_id].push(item.score)
        })

        let winners5 = []
        let winners4 = []
        let winners3 = []

        for (const userId in userMap) {

            const match = checkMatch(numbers, userMap[userId])

            if (match === 5) winners5.push(userId)
            if (match === 4) winners4.push(userId)
            if (match === 3) winners3.push(userId)

        }

        const split5 = winners5.length ? prize.match5 / winners5.length : 0
        const split4 = winners4.length ? prize.match4 / winners4.length : 0
        const split3 = winners3.length ? prize.match3 / winners3.length : 0

        for (const id of winners5) {

            await supabase.from("winners").insert([
                {
                    user_id: id,
                    draw_id: drawId,
                    match_count: 5,
                    prize: split5
                }
            ])

            sendEmail("You won prize")

        }

        for (const id of winners4) {

            await supabase.from("winners").insert([
                {
                    user_id: id,
                    draw_id: drawId,
                    match_count: 4,
                    prize: split4
                }
            ])

            sendEmail("You won prize")

        }

        for (const id of winners3) {

            await supabase.from("winners").insert([
                {
                    user_id: id,
                    draw_id: drawId,
                    match_count: 3,
                    prize: split3
                }
            ])

            sendEmail("You won prize")

        }

        let newJackpot = 0

        if (winners5.length === 0) {
            newJackpot = prize.match5
        }

        await supabase
            .from("draws")
            .update({
                jackpot: newJackpot
            })
            .eq("id", drawId)

        sendEmail("Draw Completed")

        alert("Draw Completed")

    }


    // ---------------- EDIT SCORE ----------------

    const updateScore = async (id, score) => {

        await supabase
            .from("scores")
            .update({ score })
            .eq("id", id)

        fetchScores()

    }


    // ---------------- UPDATE SUBSCRIPTION ----------------

    const updateSub = async (id, status) => {

        await supabase
            .from("subscriptions")
            .update({ status })
            .eq("id", id)

        fetchSubscriptions()

    }


    // ---------------- ANALYTICS ----------------

    const totalPrize = subscriptions.length * 50


    return (

        <div className="p-10">

            <div className="flex justify-between mb-8">

                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-blue-600 rounded"
                >
                    Back
                </Link>

            </div>


            {/* Analytics */}

            <div className="grid grid-cols-4 gap-4 mb-8">

                <div className="bg-white/5 p-4 rounded">
                    Users: {users.length}
                </div>

                <div className="bg-white/5 p-4 rounded">
                    Scores: {scores.length}
                </div>

                <div className="bg-white/5 p-4 rounded">
                    Subscriptions: {subscriptions.length}
                </div>

                <div className="bg-white/5 p-4 rounded">
                    Prize Pool: ${totalPrize}
                </div>

            </div>


            {/* Draw */}

            <div className="bg-white/5 p-6 rounded mb-6">

                <h2 className="text-xl mb-4">
                    Run Draw
                </h2>

                <input
                    placeholder="10,20,30,40,50"
                    className="w-full p-3 mb-3 bg-black/30"
                    onChange={(e) => setNumbers(e.target.value)}
                />

                <div className="flex gap-4">

                    <button
                        onClick={simulateDraw}
                        className="px-4 py-2 bg-yellow-500 rounded"
                    >
                        Simulate
                    </button>

                    <button
                        onClick={createDraw}
                        className="px-4 py-2 bg-blue-500 rounded"
                    >
                        Run Draw
                    </button>

                </div>

            </div>


            {/* Simulation */}

            {simulation && (

                <div className="bg-white/5 p-6 rounded mb-6">

                    <h2>Simulation</h2>

                    <p>5 Match: {simulation.match5}</p>
                    <p>4 Match: {simulation.match4}</p>
                    <p>3 Match: {simulation.match3}</p>

                    <p>Pool: ${simulation.prize.totalPool}</p>

                </div>

            )}


            {/* Edit Scores */}

            <div className="bg-white/5 p-6 rounded mb-6">

                <h2 className="text-xl mb-4">
                    Edit Scores
                </h2>

                {scores.map(s => (
                    <div key={s.id} className="flex justify-between mb-2">

                        <span>{s.user_id}</span>

                        <input
                            defaultValue={s.score}
                            onBlur={(e) => updateScore(s.id, e.target.value)}
                            className="bg-black/30 p-1"
                        />

                    </div>
                ))}

            </div>


            {/* Subscriptions */}

            <div className="bg-white/5 p-6 rounded mb-6">

                <h2 className="text-xl mb-4">
                    Manage Subscriptions
                </h2>

                {subscriptions.map(sub => (
                    <div key={sub.id} className="flex justify-between mb-2">

                        <span>{sub.user_id}</span>

                        <div className="flex gap-2">

                            <button
                                onClick={() => updateSub(sub.id, "active")}
                                className="bg-green-500 px-2"
                            >
                                Active
                            </button>

                            <button
                                onClick={() => updateSub(sub.id, "inactive")}
                                className="bg-red-500 px-2"
                            >
                                Inactive
                            </button>

                        </div>

                    </div>
                ))}

            </div>





            <div className="bg-white/5 p-6 rounded mb-6">

                <h2 className="text-xl mb-4">
                    Users
                </h2>

                {profiles.map(p => (
                    <div key={p.id} className="mb-2">

                        <p>Name: {p.name}</p>
                        <p>Phone: {p.phone}</p>
                        <p>Country: {p.country}</p>

                    </div>
                ))}

            </div>





            <AdminWinners />

        </div>

    )

}

export default Admin
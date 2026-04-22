import { useState } from "react"
import { supabase } from "../lib/supabase"

const ScoreForm = ({ user, fetchScores }) => {

    const [score, setScore] = useState("")
    const [date, setDate] = useState("")
    const addScore = async (e) => {

        e.preventDefault()

        // duplicate date check

        const { data: existing } = await supabase
            .from("scores")
            .select("*")
            .eq("user_id", user.id)
            .eq("date", date)

        if (existing.length > 0) {
            alert("Score already exists for this date")
            return
        }

        // get scores (oldest first)

        const { data: scores } = await supabase
            .from("scores")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true })

        if (scores.length >= 5) {

            // delete oldest

            await supabase
                .from("scores")
                .delete()
                .eq("id", scores[0].id)

        }

        // insert new score

        await supabase
            .from("scores")
            .insert([
                {
                    user_id: user.id,
                    score: parseInt(score),
                    date
                }
            ])

        setScore("")
        setDate("")

        fetchScores()

    }

    return (

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

            <h2 className="text-xl mb-4">
                Add Score
            </h2>

            <form onSubmit={addScore}>

                <input
                    type="number"
                    min="1"
                    max="45"
                    placeholder="Score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    // className="w-full p-2 mb-3 bg-black/30 rounded"
                    className="w-full p-3 mb-3 rounded-lg bg-black/30 border border-white/10"
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    // className="w-full p-2 mb-3 bg-black/30 rounded"
                    className="w-full p-3 mb-3 rounded-lg bg-black/30 border border-white/10"
                />

                <button
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
                >
                    Add Score
                </button>

            </form>

        </div>

    )

}

export default ScoreForm
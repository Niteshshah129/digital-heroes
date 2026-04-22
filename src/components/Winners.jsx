import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const Winners = () => {

    const [winners, setWinners] = useState([])

    useEffect(() => {
        fetchWinners()
    }, [])

    const fetchWinners = async () => {

        const { data } = await supabase
            .from("winners")
            .select("*")
            .order("created_at", { ascending: false })

        setWinners(data)

    }

    return (

        <div className="bg-white/5 p-6 rounded-xl">

            <h2 className="text-xl mb-4">
                Winners
            </h2>

            {winners.map(w => (
                <div
                    key={w.id}
                    className="flex justify-between mb-2 bg-black/20 p-2 rounded"
                >

                    <span>
                        {w.match_count} Match
                    </span>

                    <span>
                        ${w.prize}
                    </span>

                </div>
            ))}

        </div>

    )

}

export default Winners
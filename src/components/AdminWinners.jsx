import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const AdminWinners = () => {

    const [winners, setWinners] = useState([])

    useEffect(() => {
        fetch()
    }, [])

    const fetch = async () => {

        const { data } = await supabase
            .from("winners")
            .select("*")

        setWinners(data)

    }

    const approve = async (id) => {

        await supabase
            .from("winners")
            .update({ approved: true })
            .eq("id", id)

        fetch()

    }

    const reject = async (id) => {

        await supabase
            .from("winners")
            .update({ approved: false })
            .eq("id", id)

        fetch()

    }

    return (

        <div className="bg-white/5 p-6 rounded-xl mt-6">

            <h2 className="text-xl mb-4">
                Winner Verification
            </h2>

            {winners.map(w => (
                <div key={w.id} className="mb-3">

                    <p>Prize: ${w.prize}</p>

                    {w.proof_url && (
                        <a
                            href={w.proof_url}
                            target="_blank"
                            className="text-blue-400"
                        >
                            View Proof
                        </a>
                    )}

                    <div className="flex gap-2 mt-2">

                        <button
                            onClick={() => approve(w.id)}
                            className="bg-green-500 px-2"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => reject(w.id)}
                            className="bg-red-500 px-2"
                        >
                            Reject
                        </button>

                    </div>

                </div>
            ))}

        </div>

    )

}

export default AdminWinners
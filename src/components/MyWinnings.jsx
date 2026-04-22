import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import WinnerUpload from "./WinnerUpload"

const MyWinnings = ({ user }) => {

    const [winnings, setWinnings] = useState([])

    useEffect(() => {
        fetch()
    }, [])

    const fetch = async () => {

        const { data } = await supabase
            .from("winners")
            .select("*")
            .eq("user_id", user.id)

        setWinnings(data)

    }

    return (

        <div className="bg-white/5 p-6 rounded-xl mt-6">

            <h2 className="text-xl mb-4">
                My Winnings
            </h2>

            {winnings.map(w => (
                <div key={w.id} className="mb-4">

                    <div className="flex justify-between">

                        <span>${w.prize}</span>
                        <span>{w.approved ? "Approved" : "Pending"}</span>

                    </div>

                    {!w.proof_url && (
                        <WinnerUpload winner={w} />
                    )}

                    {w.proof_url && (
                        <a
                            href={w.proof_url}
                            target="_blank"
                            className="text-blue-400"
                        >
                            View Proof
                        </a>
                    )}

                </div>
            ))}

        </div>

    )

}

export default MyWinnings
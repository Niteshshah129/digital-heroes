import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const CharitySelect = ({ user }) => {

    const [charities, setCharities] = useState([])
    const [selected, setSelected] = useState("")
    const [percentage, setPercentage] = useState(10)
    const [saved, setSaved] = useState(null)

    useEffect(() => {
        fetchCharities()
        fetchSaved()
    }, [])

    const fetchCharities = async () => {

        const { data } = await supabase
            .from("charities")
            .select("*")

        setCharities(data)

    }

    const fetchSaved = async () => {

        const { data } = await supabase
            .from("user_charity")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle()

        if (data) {

            const { data: charity } = await supabase
                .from("charities")
                .select("*")
                .eq("id", data.charity_id)
                .maybeSingle()

            setSaved({
                ...data,
                charity
            })

            setPercentage(data.percentage)

        }

    }

    const saveCharity = async () => {

        await supabase
            .from("user_charity")
            .upsert([
                {
                    user_id: user.id,
                    charity_id: selected,
                    percentage
                }
            ])

        fetchSaved()

        alert("Charity Saved")

    }

    return (

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

            <h2 className="text-xl mb-4">
                Select Charity
            </h2>

            <select
                className="w-full p-3 mb-3 bg-black/30"
                onChange={(e) => setSelected(e.target.value)}
            >

                <option>Select Charity</option>

                {charities.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}

            </select>

            <input
                type="number"
                min="10"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full p-3 mb-3 bg-black/30"
            />

            <button
                onClick={saveCharity}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded"
            >
                Save Charity
            </button>

            {/* Selected Charity */}

            {saved && (

                <div className="mt-4 bg-black/20 p-3 rounded">

                    <h3 className="text-sm text-gray-400">
                        Selected Charity
                    </h3>

                    <p className="font-bold">
                        {saved.charity?.name}
                    </p>

                    <p className="text-sm">
                        Donation: {saved.percentage}%
                    </p>

                </div>

            )}

        </div>

    )

}

export default CharitySelect


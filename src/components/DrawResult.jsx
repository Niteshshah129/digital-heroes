import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const DrawResult = () => {

    const [draw, setDraw] = useState(null)

    useEffect(() => {
        fetchDraw()
    }, [])

    const fetchDraw = async () => {

        const { data, error } = await supabase
            .from("draws")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)

        if (data && data.length > 0) {
            setDraw(data[0])
        }

    }

    if (!draw) {
        return (
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h2>No Draw Yet</h2>
            </div>
        )
    }

    return (

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

            <h2 className="text-xl mb-4">
                Latest Draw
            </h2>

            <p className="text-2xl font-bold">
                {draw.numbers}
            </p>

        </div>

    )

}

export default DrawResult
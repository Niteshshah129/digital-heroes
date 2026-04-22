import { useState } from "react"
import { supabase } from "../lib/supabase"

const WinnerUpload = ({ winner }) => {

    const [file, setFile] = useState(null)

    const upload = async () => {

        if (!file) {
            alert("Select file")
            return
        }

        const fileName = `${winner.id}-${Date.now()}.png`

        const { error } = await supabase.storage
            .from("winner-proof")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: true
            })

        if (error) {
            console.log(error)
            alert("Upload failed")
            return
        }

        const { data } = supabase.storage
            .from("winner-proof")
            .getPublicUrl(fileName)

        await supabase
            .from("winners")
            .update({
                proof_url: data.publicUrl
            })
            .eq("id", winner.id)

        alert("Upload Success")

    }

    return (

        <div>

            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button
                onClick={upload}
                className="bg-blue-500 px-3 py-1 ml-2"
            >
                Upload
            </button>

        </div>

    )

}

export default WinnerUpload
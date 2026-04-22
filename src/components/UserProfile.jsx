import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { User, Phone, Globe } from "lucide-react"

const UserProfile = ({ user }) => {

    const [profile, setProfile] = useState(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {

        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

        setProfile(data)

    }

    if (!profile) return null

    return (

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 
backdrop-blur-xl border border-white/10 
rounded-2xl p-6 mb-6 shadow-lg">

            {/* Header */}

            <div className="flex items-center gap-4 mb-5">

                <div className="w-12 h-12 rounded-xl bg-gradient-to-r 
from-blue-500 to-purple-600 
flex items-center justify-center">

                    <User size={22} />

                </div>

                <div>

                    <h2 className="text-xl font-semibold">
                        {profile.name}
                    </h2>

                    <p className="text-gray-400 text-sm">
                        User Profile
                    </p>

                </div>

            </div>


            {/* Info Grid */}

            <div className="grid grid-cols-2 gap-4">

                {/* Phone */}

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">

                    <div className="flex items-center gap-2 mb-1">

                        <Phone size={16} className="text-blue-400" />

                        <span className="text-sm text-gray-400">
                            Phone
                        </span>

                    </div>

                    <p className="font-medium">
                        {profile.phone}
                    </p>

                </div>


                {/* Country */}

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">

                    <div className="flex items-center gap-2 mb-1">

                        <Globe size={16} className="text-purple-400" />

                        <span className="text-sm text-gray-400">
                            Country
                        </span>

                    </div>

                    <p className="font-medium">
                        {profile.country}
                    </p>

                </div>

            </div>

        </div>

    )

}

export default UserProfile



import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const Subscription = ({ user, refresh }) => {

    const [subscription, setSubscription] = useState(null)

    useEffect(() => {
        fetchSubscription()
    }, [])

    const fetchSubscription = async () => {

        const { data } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

        setSubscription(data)

    }

    const subscribe = async (plan) => {

        const expires = new Date()

        if (plan === "monthly") {
            expires.setMonth(expires.getMonth() + 1)
        } else {
            expires.setFullYear(expires.getFullYear() + 1)
        }

        await supabase
            .from("subscriptions")
            .insert([
                {
                    user_id: user.id,
                    plan,
                    status: "active",
                    expires_at: expires
                }
            ])

        fetchSubscription()
        refresh()

    }

    const cancelSubscription = async () => {

        await supabase
            .from("subscriptions")
            .update({
                status: "cancelled"
            })
            .eq("id", subscription.id)

        setSubscription(null)
        refresh()

    }

    return (

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

            <h2 className="text-xl mb-4">
                Subscription
            </h2>

            {subscription ? (

                <div className="mb-4 bg-black/20 p-4 rounded">

                    <p className="font-bold">
                        Plan: {subscription.plan}
                    </p>

                    <p>
                        Status: {subscription.status}
                    </p>

                    <p>
                        Expires: {new Date(subscription.expires_at).toDateString()}
                    </p>

                </div>

            ) : (

                <p className="text-gray-400 mb-4">
                    No active subscription
                </p>

            )}

            <div className="flex gap-3 mb-3">

                <button
                    onClick={() => subscribe("monthly")}
                    className="flex-1 py-2 bg-blue-500 rounded"
                >
                    Monthly
                </button>

                <button
                    onClick={() => subscribe("yearly")}
                    className="flex-1 py-2 bg-purple-500 rounded"
                >
                    Yearly
                </button>

            </div>

            {subscription && (

                <button
                    onClick={cancelSubscription}
                    className="w-full py-2 bg-red-500 rounded"
                >
                    Cancel Subscription
                </button>

            )}

        </div>

    )

}

export default Subscription
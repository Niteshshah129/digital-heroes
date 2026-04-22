export const calculatePrize = (subscriptions, prevJackpot = 0) => {

    const activeUsers = subscriptions.filter(
        s => s.status === "active"
    )

    const subscriptionAmount = 50

    const totalPool = activeUsers.length * subscriptionAmount

    const pool = totalPool + prevJackpot

    return {
        totalPool: pool,
        match5: pool * 0.40,
        match4: pool * 0.35,
        match3: pool * 0.25
    }

}
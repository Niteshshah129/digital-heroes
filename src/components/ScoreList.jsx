const ScoreList = ({ scores }) => {

    return (

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

            <h2 className="text-xl mb-4">
                Your Scores
            </h2>

            {scores.length === 0 && (
                <p className="text-gray-400">
                    No scores yet
                </p>
            )}

            {scores.map((score) => (
                <div
                    key={score.id}
                    className="flex justify-between mb-2 bg-black/20 p-2 rounded"
                >

                    <span className="font-bold">
                        {score.score}
                    </span>

                    <span className="text-gray-400">
                        {score.date}
                    </span>

                </div>
            ))}

        </div>

    )

}

export default ScoreList
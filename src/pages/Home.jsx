import { Link } from "react-router-dom"

const Home = () => {

    return (

        <div className="p-10">

            {/* Hero */}

            <div className="text-center mb-16">

                <h1 className="text-5xl font-bold mb-4">
                    Win Monthly Prizes
                </h1>

                <p>
                    Track golf scores & support charities
                </p>

                <Link
                    to="/signup"
                    className="bg-blue-600 px-6 py-3 mt-4 inline-block"
                >
                    Join Now
                </Link>

            </div>


            {/* How Draw Works */}

            <div className="grid grid-cols-3 gap-6 mb-16">

                <div className="bg-white/5 p-6">
                    1. Enter Scores
                </div>

                <div className="bg-white/5 p-6">
                    2. Monthly Draw
                </div>

                <div className="bg-white/5 p-6">
                    3. Win Prize
                </div>

            </div>


            {/* Charity Spotlight */}

            <div className="bg-white/5 p-6">

                <h2 className="text-2xl mb-4">
                    Featured Charity
                </h2>

                <p>
                    Support children education programs
                </p>

            </div>

        </div>

    )

}

export default Home
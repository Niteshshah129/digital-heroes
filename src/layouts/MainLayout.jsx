import { Link } from "react-router-dom"

const MainLayout = ({ children }) => {
  return (
    <div>

      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-6 backdrop-blur-lg bg-white/5 border-b border-white/10 z-50">

        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Digital Heroes
        </h1>

        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>

          <Link to="/login" className="hover:text-blue-400">
            Login
          </Link>

          <Link to="/signup" className="hover:text-blue-400">
            Signup
          </Link>
        </div>

      </nav>

      {/* Content (navbar ke neeche overlap avoid karne ke liye padding) */}
      <div className="pt-24">
        {children}
      </div>

    </div>
  )
}

export default MainLayout
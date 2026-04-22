import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Admin from "./pages/Admin"

import MainLayout from "./layouts/MainLayout"

function App() {
return (

<MainLayout>

<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/admin" element={<Admin />} />
</Routes>

</MainLayout>

)
}

export default App
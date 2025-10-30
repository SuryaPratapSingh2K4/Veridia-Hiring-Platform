import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import PostJob from "./pages/admin/PostJob";
import ApplicantList from "./pages/admin/ApplicantList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApplicantDashboard from "./pages/user/ApplicantDashboard";
import ApplicantForm from "./pages/user/ApplicantForm";
import MyApplicant from "./pages/user/MyApplicant";

import { Toaster } from 'react-hot-toast'



function RequireAuth({ children, role }) {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  if (!token) return <Navigate to='/' replace />
  if (role && storedRole !== role) return <Navigate tp='/' replace />
  return children
}

function App() {
  return (
    <Router>
      <Navbar />
      <Toaster position='top-right' reverseOrder={false} />
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/post-job" element={<RequireAuth role="admin">
          <PostJob />
        </RequireAuth>} />

        <Route path="/admin/applicants" element={
          <RequireAuth role="admin">
            <ApplicantList />
          </RequireAuth>
        } />

        <Route path="/admin" element={
          <RequireAuth role="admin">
            <AdminDashboard />
          </RequireAuth>
        } />

        <Route path="/user" element={
          <RequireAuth role="user">
            <ApplicantDashboard />
          </RequireAuth>
        } />

        <Route path="/user/apply/:id" element={
          <RequireAuth role="user">
            <ApplicantForm />
          </RequireAuth>
        } />

        <Route path="/user/my-applications" element={
          <RequireAuth role="user">
            <MyApplicant />
          </RequireAuth>
        } />

        <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>

    </Router>

  )
}

export default App

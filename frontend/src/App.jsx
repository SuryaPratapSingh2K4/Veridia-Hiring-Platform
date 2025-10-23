import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import { Login } from "../../backend/src/controller/userController";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import PostJob from "./pages/admin/PostJob";
import ApplicantList from "./pages/admin/ApplicantList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApplicantDashboard from "./pages/user/ApplicantDashboard";
import ApplicantForm from "./pages/user/ApplicantForm";
import MyApplicant from "./pages/user/MyApplicant";


function RequireAuth({ children, role }) {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  if (!token) return <Navigate to='/' replace />
  if (role && storedRole !== role) return <Navigate tp='/' replace />
  return children
}

function App() {
  return (
    <div data-theme="corporate" className="min-h-screen">
      <Router>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
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
        </div>
      </Router>
    </div>
  )
}

export default App

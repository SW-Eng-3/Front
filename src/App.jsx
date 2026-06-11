import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import PostListPage from "./pages/community/PostListPage";
import PostDetailPage from "./pages/community/PostDetailPage";
import CreatePostPage from "./pages/community/CreatePostPage";
import MentorListPage from "./pages/mentoring/MentorListPage";
import ManageSchedulePage from "./pages/mentoring/ManageSchedulePage";
import MyProfilePage from "./pages/profile/MyProfilePage";
import PointHistoryPage from "./pages/profile/PointHistoryPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChatRoomsPage from "./pages/chat/ChatRoomsPage";
import ChatRoomDetailPage from "./pages/chat/ChatRoomDetailPage";
import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/community" element={<PostListPage />} />
            <Route path="/community/:postId" element={<PostDetailPage />} />
            <Route path="/community/create" element={<CreatePostPage />} />
            <Route path="/mentoring" element={<MentorListPage />} />
            <Route path="/mentoring/manage" element={<ManageSchedulePage />} />
            <Route path="/profile" element={<MyProfilePage />} />
            <Route path="/profile/points" element={<PointHistoryPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/chat/rooms" element={<ChatRoomsPage />} />
            <Route
              path="/chat/rooms/:roomId"
              element={<ChatRoomDetailPage />}
            />
          </Routes>
        </main>
        <ChatWidget />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "16px",
              padding: "16px 24px",
              fontWeight: "600",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
            success: {
              style: { background: "#059669" },
            },
            error: {
              style: { background: "#DC2626" },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;

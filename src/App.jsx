import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import PostListPage from './pages/community/PostListPage';
import PostDetailPage from './pages/community/PostDetailPage';
import CreatePostPage from './pages/community/CreatePostPage';
import MentorListPage from './pages/mentoring/MentorListPage';
import MyProfilePage from './pages/profile/MyProfilePage';

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
            <Route path="/community" element={<PostListPage />} />
            <Route path="/community/:postId" element={<PostDetailPage />} />
            <Route path="/community/create" element={<CreatePostPage />} />
            <Route path="/mentoring" element={<MentorListPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;

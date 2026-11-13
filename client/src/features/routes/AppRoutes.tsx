import { Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Review from '@/pages/Review';
import Book from '@/pages/Book';
import Settings from '@/pages/Settings';
import Login from '@/pages/auth/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/book/:key" element={<Book />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/review" element={<Review />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

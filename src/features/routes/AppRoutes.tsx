import { Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import Review from '@/pages/Review';

/* App routes. Routes are hash based (see src/main.tsx), so URLs look like /#/profile */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<Search />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/review" element={<Review />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

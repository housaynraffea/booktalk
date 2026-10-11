import { Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Search from '@/pages/Search';

/* App routes. Routes are hash based (see src/main.tsx), so URLs look like /#/profile */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

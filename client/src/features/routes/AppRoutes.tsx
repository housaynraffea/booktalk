import { Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import SignUp from '@/pages/auth/SignUp';
import SignIn from '@/pages/auth/SignIn';
import ResetPassword from '@/pages/auth/ResetPassword';
import UpdatePassword from '@/pages/auth/UpdatePassword';
import Profile from '@/pages/Profile';
import Review from '@/pages/Review';
import Book from '@/pages/Book';
import Settings from '@/pages/Settings';

/* App routes. Routes are hash based (see src/main.tsx), so URLs look like /#/profile */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/book" element={<Book />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/review" element={<Review />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

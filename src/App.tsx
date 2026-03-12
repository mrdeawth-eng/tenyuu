import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import Recipes from "./pages/Recipes";
import SearchPage from "./pages/Search";
import RecipeDetail from "./pages/RecipeDetail";
import Fridge from "./pages/Fridge";
import FridgeAdd from "./pages/FridgeAdd";
import FridgeEdit from "./pages/FridgeEdit";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileFavorite from "./pages/ProfileFavorite";
import ProfileSettings from "./pages/ProfileSettings";
import ProfileAccount from "./pages/ProfileAccount";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
            <Route path="/fridge" element={<ProtectedRoute><Fridge /></ProtectedRoute>} />
            <Route path="/fridge/add" element={<ProtectedRoute><FridgeAdd /></ProtectedRoute>} />
            <Route path="/fridge/edit/:id" element={<ProtectedRoute><FridgeEdit /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/favorite" element={<ProtectedRoute><ProfileFavorite /></ProtectedRoute>} />
            <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/profile/account" element={<ProtectedRoute><ProfileAccount /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

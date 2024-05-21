import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import PostPage from "./pages/PostPage";
import SignUPpage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<HomePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signin" element={<SignUPpage/>}/>
          <Route path="/user/:username" element={<ProfilePage/>}/>
          <Route path="/post/:id" element={<PostPage/>}/>
        </Route>
      </Routes>
    </QueryClientProvider>
  )
}

export default App

import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login.js";
import Navbar from "./Components/navbar.js";
import Home from "./Components/Home.js";
import Register from "./Components/Signup.js";
import Contact from "./Components/Contact.js";
import ResetPassword from "./Components/ResetPassword.js";
import UpdatePassword from "./Components/newPassword.js";
import PageNotFound from "./Components/pagenotfound.js";
import Profile from "./Components/Profile.js";
import EditProfile from "./Components/EditProfile.js";
import { AuthProvider } from "./AuthContext";
import Inbox from "./Components/Inbox.js";
import { useAuth } from "./AuthContext";

import { useEffect } from "react";
function App() {
  const Cardlist = [
    { id: 1, title: "Physics", data: "Physics is best" },
    { id: 2, title: "  Chemistry", data: "Chemistry is best" },
    { id: 3, title: "Maths", data: "Maths is best" },
    { id: 4, title: "Biology", data: "Biology is best" },
    { id: 5, title: "Biology", data: "Biology is best" },
    { id: 6, title: "Biology", data: "Biology is best" },
    { id: 7, title: "Biology", data: "Biology is best" },
    { id: 8, title: "Biology", data: "Biology is best" },
  ];
  const [cards, setCards] = useState(Cardlist);

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home Cardlist={cards} />} />
            <Route path="/Home" element={<Home Cardlist={cards} />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/ResetPassword" element={<ResetPassword />} />
            <Route path="/UpdatePassword" element={<UpdatePassword />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/accounts/edit" element={<EditProfile />} />
            <Route path="/accounts/:username/messages" element={<Inbox />} />
            <Route path="*" element={<PageNotFound />}></Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}
export default App;

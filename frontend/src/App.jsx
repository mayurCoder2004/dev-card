import React, { useState, useEffect } from "react";
import ProfileForm from "./components/ProfileForm";
import HeroSection from "./components/HeroSection";
import DevCard from "./components/DevCard";
import axios from "axios";
import { motion } from "framer-motion";
import Footer from "./components/ContactUs";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

const App = () => {
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async (githubUsername, leetcodeUsername) => {
    if (!githubUsername || !leetcodeUsername) {
      setError("Both usernames are required.");
      return;
    }

    setLoading(true);
    setError("");
    setGithubData(null);
    setLeetcodeData(null);
    setSummary("");

    try {
      // Fetch GitHub data
      const githubRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/github/${githubUsername}`
      );
      setGithubData({
        userData: githubRes.data.userData,
        pinnedRepos: githubRes.data.pinnedRepos || [],
        languagesCount: githubRes.data.languagesCount || {},
      });

      // Fetch LeetCode data
      const leetcodeRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/leetcode/${leetcodeUsername}`
      );
      setLeetcodeData(leetcodeRes.data);

      // Fetch summary
      const summaryRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/gemini/summary`,
        {
          params: { githubUsername, leetcodeUsername },
        }
      );
      setSummary(summaryRes.data.summary || "");

      navigate("/dev-card");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    // Check for simple query parameters (gh and lc)
    const githubUsername = urlParams.get('gh');
    const leetcodeUsername = urlParams.get('lc');
    
    if (githubUsername && leetcodeUsername) {
      console.log('Loading from URL params:', { githubUsername, leetcodeUsername });
      fetchData(githubUsername, leetcodeUsername);
      return;
    }
    
    // Fallback: Check for encoded data parameter (for backward compatibility)
    const encodedData = urlParams.get('data');
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        if (decodedData.github && decodedData.leetcode) {
          console.log('Loading from encoded data:', decodedData);
          fetchData(decodedData.github, decodedData.leetcode);
        }
      } catch (error) {
        setError("Invalid share link");
        console.error('Failed to decode URL data:', error);
      }
    }
  }, [location.search]);

  const handleSubmit = async (githubUsername, leetcodeUsername) => {
    await fetchData(githubUsername, leetcodeUsername);
  };

  const isDataReady = githubData?.userData && leetcodeData;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-amber-200 p-8 md:p-12 flex flex-col items-center">
            <h1 className="relative text-5xl md:text-6xl font-extrabold mb-10 text-center bg-yellow-800 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] leading-[1.2] px-6 py-2 before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-full before:h-1 before:rounded-full before:bg-yellow-800 before:opacity-80 before:animate-pulse">
              ByteCard
            </h1>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-red-700 font-semibold mb-6 drop-shadow-md select-none"
              >
                {error}
              </motion.p>
            )}

            {loading && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-yellow-700 font-medium mb-6 animate-pulse select-none"
              >
                Loading your developer profile...
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-screen-xl"
            >
              <div className="flex flex-col md:flex-row justify-center gap-12 px-4 md:px-0">
                <div className="md:w-1/2 w-full">
                  <HeroSection />
                </div>
                <div className="md:w-1/2 w-full">
                  <ProfileForm onSubmit={handleSubmit} loading={loading} />
                </div>
              </div>
            </motion.div>
            <Footer />
          </div>
        }
      />

      <Route
        path="/dev-card"
        element={
          <div className="min-h-screen bg-amber-200 p-8 md:p-12 flex flex-col items-center">
            <h1 className="relative text-5xl md:text-6xl font-extrabold mb-10 text-center bg-yellow-800 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] leading-[1.2] px-6 py-2 before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-full before:h-1 before:rounded-full before:bg-yellow-800 before:opacity-80 before:animate-pulse">
              ByteCard
            </h1>

            {loading ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-yellow-700 font-medium mb-6 animate-pulse select-none"
              >
                Loading your developer profile...
              </motion.p>
            ) : !isDataReady ? (
              <div className="text-center">
                <p className="text-yellow-700 font-semibold mb-4">Data not available.</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  Go Back to Form
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-screen-xl"
              >
                <div className="flex flex-col sm:flex-row justify-center gap-6 px-4 md:px-0">
                  <DevCard
                    githubData={githubData.userData}
                    pinnedRepos={githubData.pinnedRepos}
                    languagesCount={githubData.languagesCount}
                    leetcodeData={leetcodeData}
                    summary={summary}
                    onRefresh={fetchData}
                  />
                </div>
              </motion.div>
            )}
            <Footer />
          </div>
        }
      />
    </Routes>
  );
};

export default App;
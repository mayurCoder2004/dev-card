import React, { useState } from "react";
import { motion } from "framer-motion";

const ProfileForm = ({ onSubmit }) => {
  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(githubUsername.trim(), leetcodeUsername.trim());
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/90 dark:bg-yellow-950/80 rounded-3xl px-8 py-10 max-w-lg mx-auto backdrop-blur-md border-[4px] border-b-[20px]"
      style={{ borderColor: 'black', borderBottomColor: 'black' }}
    >
      <div className="mb-6">
        <label
          htmlFor="githubUsername"
          className="block mb-2 font-semibold text-yellow-900 dark:text-yellow-300"
        >
          GitHub Username
        </label>
        <input
          id="githubUsername"
          type="text"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          placeholder="Enter GitHub username"
          required
          className="w-full px-5 py-3 rounded-full border border-yellow-300 dark:border-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 transition-all"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="leetcodeUsername"
          className="block mb-2 font-semibold text-yellow-900 dark:text-yellow-300"
        >
          LeetCode Username
        </label>
        <input
          id="leetcodeUsername"
          type="text"
          value={leetcodeUsername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
          placeholder="Enter LeetCode username"
          required
          className="w-full px-5 py-3 rounded-full border border-yellow-300 dark:border-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600 bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-full transition-colors duration-300 shadow-md hover:shadow-xl cursor-pointer"
      >
        Get Profile
      </button>
    </motion.form>
  );
};

export default ProfileForm;

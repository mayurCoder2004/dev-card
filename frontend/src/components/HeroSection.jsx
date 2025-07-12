import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="
        w-full max-w-[900px] mx-auto 
        px-10 py-6 rounded-3xl 
        bg-white/70 dark:bg-yellow-900/70 backdrop-blur-md
        shadow-[8px_8px_24px_rgba(255,215,0,0.2),-8px_-8px_24px_rgba(255,255,255,0.3)]
        hover:shadow-[12px_12px_36px_rgba(255,215,0,0.3),-12px_-12px_36px_rgba(255,255,255,0.4)]
        transition-shadow duration-500 ease-in-out
        border border-yellow-200 dark:border-yellow-700
        overflow-visible
      "
      style={{
        animation: "float 6s ease-in-out infinite",
      }}
    >
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>

      <h1
        className="text-4xl font-extrabold mb-4 tracking-wider
                   bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                   bg-clip-text text-transparent"
      >
        Elevate Your Developer Identity
      </h1>

      <h2
        className="text-3xl font-bold mb-6 relative tracking-tight
                   text-yellow-900 dark:text-yellow-200"
      >
        Showcase Your Skills Like Never Before
        <span className="block h-1 w-20 bg-yellow-400 rounded-full mt-3 dark:bg-yellow-500 shadow-lg"></span>
      </h2>

      <p className="text-yellow-800 dark:text-yellow-300 text-base leading-relaxed mb-8 tracking-wide font-medium">
        Seamlessly blend your GitHub contributions and LeetCode achievements into a stunning, unified developer card — crafted to make your profile unforgettable.
      </p>

      <ul className="list-disc pl-10 space-y-4 text-yellow-700 dark:text-yellow-300 font-semibold text-base">
        {[
          "Instantly share your GitHub stats: followers, repos & more",
          "Highlight your LeetCode badges, rankings, and challenge mastery",
          "Show off your top programming languages and problem-solving skills",
          "Get a smart, AI-generated summary that tells your unique story",
        ].map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
            className="cursor-pointer rounded-lg px-4 py-1
                       hover:bg-yellow-300/40 hover:dark:bg-yellow-700/50
                       hover:scale-105 hover:shadow-lg
                       transition-transform transition-colors duration-300 ease-in-out"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
          >
            {item}
          </motion.li>
        ))}
      </ul>

      <p className="mt-10 text-yellow-600 dark:text-yellow-400 text-sm italic tracking-wide font-medium">
        Perfect for landing that dream job, impressing recruiters, or sharing your journey with fellow developers.
      </p>
    </motion.div>
  );
};

export default HeroSection;

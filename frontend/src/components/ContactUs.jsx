import React, { useState } from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { ease: "easeOut" } },
};

const ContactUs = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
    const formData = new FormData(e.target);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResponseMessage("Thank you! Your message has been sent.");
        e.target.reset();
      } else {
        setResponseMessage("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      setResponseMessage("Network error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <section
      id="contact"
      className="w-full px-6 py-6 bg-yellow-50 dark:bg-yellow-900 rounded-xl border border-yellow-300 dark:border-yellow-700 mt-10"
    >
      <motion.div
        className="flex flex-col md:flex-row gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left text + socials + heading */}
        {/* Left text + socials + heading */}
<motion.div
  className="md:w-1/2 text-yellow-900 dark:text-yellow-300 flex flex-col justify-center text-sm"
  variants={itemVariants}
>
  <h2 className="text-2xl font-bold mb-6 text-yellow-900 dark:text-yellow-200">
    Questions About the ByteCard?
  </h2>
  <p className="mb-4">
    Have a question about the ByteCard, features, or how it works? I'm here to help!
    Drop your query below, and I'll get back to you as soon as possible.
  </p>
  <h4 className="font-semibold mb-2">Stay Connected</h4>
  <div className="flex space-x-4 text-yellow-700 dark:text-yellow-400 text-xl">
    {[
      {
        href: "#",
        label: "GitHub",
        icon: "fa-brands fa-github",
      },
      {
        href: "#",
        label: "LinkedIn",
        icon: "fa-brands fa-linkedin",
      },
      {
        href: "#",
        label: "Twitter",
        icon: "fa-brands fa-twitter",
      },
      {
        href: "#",
        label: "Instagram",
        icon: "fa-brands fa-instagram",
      },
    ].map(({ href, label, icon }) => (
      <motion.a
        key={label}
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        whileHover={{ scale: 1.2, color: "#d97706" }}
        whileTap={{ scale: 0.95 }}
        className="transition-colors"
      >
        <i className={`${icon}`}></i>
      </motion.a>
    ))}
  </div>
</motion.div>


        {/* Right form */}
        <motion.div
          className="md:w-1/2 bg-white dark:bg-yellow-950 p-4 rounded-xl border border-yellow-300 dark:border-yellow-700 shadow-sm"
          variants={itemVariants}
        >
          <form
            onSubmit={handleSubmit}
            id="contactForm"
            className="flex flex-col space-y-3 text-sm"
          >
            <input
              type="hidden"
              name="access_key"
              value="c28731e3-030e-4679-9b21-3765a4a1add6"
            />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              disabled={loading}
              className="px-3 py-2 rounded-full border border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              disabled={loading}
              className="px-3 py-2 rounded-full border border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              rows={3}
              disabled={loading}
              className="px-3 py-2 rounded-xl border border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-yellow-900 font-semibold py-2 rounded-full transition-colors duration-300 shadow-sm flex items-center justify-center"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-yellow-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  ></path>
                </svg>
              )}
              Send <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </form>
          {responseMessage && (
            <p className="mt-2 text-yellow-700 dark:text-yellow-400 text-xs italic">
              {responseMessage}
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactUs;

import { Link } from "react-router-dom";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Feature data
const features = [
  {
    title: "📚 Course Management",
    desc: "Track registered courses, timetables, and exam schedules with ease. Stay organized and save time."
  },
  {
    title: "🤝 Collaboration",
    desc: "Connect with classmates and class reps using built-in communication tools for seamless teamwork."
  },
  {
    title: "🔔 Smart Notifications",
    desc: "Receive timely reminders for lectures, deadlines, and announcements so you never miss important updates."
  },
  {
    title: "📂 Resource Sharing",
    desc: "Upload, share, and access class resources like notes, assignments, and past papers anytime."
  },
  {
    title: "⚡ Productivity Tools",
    desc: "Built-in task tracking, reminders, and progress boards to help you achieve academic success."
  },
];

const Landing = () => {
  // Dark mode toggle
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white dark:from-secondary-900 dark:to-secondary-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-primary-600">TaskTide</h1>
        <nav className="flex items-center space-x-6">
          <Link
            to="/login"
            className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors"
          >
            Get Started
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-secondary-200 dark:bg-secondary-700 hover:bg-secondary-300 dark:hover:bg-secondary-600 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-secondary-800" />}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-12">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-900 dark:text-white max-w-3xl leading-tight">
          Organize Courses, Stay Connected, Succeed Together
        </h2>
        <p className="mt-6 text-lg sm:text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl">
          TaskTide helps university students manage courses, collaborate seamlessly, and stay on top of important deadlines — all in one place.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="flex items-center justify-center px-8 py-3 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 transition-all font-semibold"
          >
            Join Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="px-8 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all font-medium"
          >
            Learn More
          </a>
        </div>
        {/* Hero Illustration */}
        <div className="mt-12">
          <img
            src="/hero.png"
            alt="Students collaborating"
            className="w-full max-w-2xl mx-auto"
          />
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-secondary-900 overflow-hidden relative">
        <motion.div
          className="flex gap-8"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        >
          {[...features, ...features].map((feature, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-64 sm:w-72 md:w-80 p-6 rounded-2xl shadow-soft 
                         bg-white dark:bg-secondary-800 
                         border-2 border-transparent 
                         bg-clip-padding bg-gradient-to-br from-purple-500 to-silver-300 
                         hover:shadow-soft-lg cursor-pointer select-none"
              whileHover={{ scale: 1.07, y: -8, rotate: -1 }}
              whileTap={{ scale: 0.95, y: 2 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <h3 className="text-lg font-bold text-primary-600 mb-2 break-words">
                {feature.title}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm leading-relaxed break-words">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-50 dark:bg-secondary-800 text-center px-6 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white">
          Ready to boost your productivity?
        </h2>
        <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-300 max-w-xl mx-auto">
          Join thousands of students who are organizing their studies and collaborating smarter.
        </p>
        <Link
          to="/signup"
          className="mt-6 inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 transition-all font-semibold"
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-secondary-500 dark:text-secondary-400 border-t border-secondary-200 dark:border-secondary-700">
        © {new Date().getFullYear()} TaskTide. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white dark:from-secondary-900 dark:to-secondary-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white/70 dark:bg-secondary-900/70 backdrop-blur">
        <h1 className="text-2xl font-bold text-primary-600">TaskTide</h1>
        <nav className="space-x-6">
          <Link to="/login" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white max-w-2xl">
          Organize Courses, Stay Connected, Succeed Together
        </h2>
        <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-300 max-w-xl">
          TaskTide helps university students manage courses, collaborate with classmates, 
          and never miss important updates — all in one place.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            to="/signup"
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl shadow hover:bg-primary-700"
          >
            Join Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="px-6 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-secondary-900 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-xl font-semibold text-primary-600">📚 Course Management</h3>
            <p className="mt-2 text-secondary-600 dark:text-secondary-400">
              Keep track of registered courses, timetables, and exam schedules effortlessly.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary-600">🤝 Collaboration</h3>
            <p className="mt-2 text-secondary-600 dark:text-secondary-400">
              Work with classmates and class reps using built-in tools for communication.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary-600">🔔 Smart Notifications</h3>
            <p className="mt-2 text-secondary-600 dark:text-secondary-400">
              Get timely reminders for lectures, deadlines, and important announcements.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-secondary-500 dark:text-secondary-400">
        © {new Date().getFullYear()} TaskTide. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;

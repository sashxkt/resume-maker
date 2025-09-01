import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow dark:bg-gray-900 dark:shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-md border-2 border-indigo-500 dark:bg-gray-800 dark:border-indigo-300 overflow-hidden">
          <img
            src="/Yellow and Black Circles Arts and Crafts Creative Agency Logo.png"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
        </div>
        <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 tracking-wide">
          Resume Buddy
        </span>
      </div>

      <nav className="flex space-x-4">
        <a href="/dashboard" className="px-4 py-2 rounded text-sm font-medium hover:bg-indigo-50 transition dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
          Check ATS Score
        </a>
        <a href="/make-resume" className="px-4 py-2 rounded text-sm font-medium hover:bg-indigo-50 transition dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
          Make Resume
        </a>
        <a href="/dashboard" className="px-4 py-2 rounded text-sm font-medium hover:bg-indigo-50 transition dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
          Previous Resumes
        </a>
      </nav>

      <div className="flex items-center space-x-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
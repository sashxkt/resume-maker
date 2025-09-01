"use client";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  // Remove Supabase logic and show static message for previous resumes
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex flex-col items-center flex-1 w-full px-4 pt-8">
        <section className="w-full max-w-4xl mx-auto text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Resume Buddy</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">Build, preview, and showcase your resume. Simple, clean, and easy to use.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 w-full">
            <button
              className="w-full md:w-64 h-14 bg-indigo-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-indigo-700 transition"
              onClick={() => router.push("/make-resume")}
            >
              Make New Resume
            </button>
            <button
              className="w-full md:w-64 h-14 bg-yellow-400 text-gray-900 rounded-lg font-semibold text-lg shadow hover:bg-yellow-500 transition"
              onClick={() => router.push("/ats-score")}
            >
              Check ATS Score
            </button>
          </div>
          <div className="mt-4">
            <span className="text-base text-gray-800 font-medium">Showcase your previous resumes below!</span>
          </div>
        </section>
        <section className="w-full max-w-4xl mx-auto pb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Previous Resumes</h2>
          <div className="text-gray-500 text-center">No resumes found. (Cloud storage disabled)</div>
        </section>
      </main>
    </div>
  );
}

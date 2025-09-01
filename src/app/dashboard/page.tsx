"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [resumes, setResumes] = useState<{ pdf_url: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResumes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("resumes")
        .select("pdf_url, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) setResumes(data);
      setLoading(false);
    }
    fetchResumes();
  }, []);

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
          {loading ? (
            <div className="text-gray-500 text-center">Loading...</div>
          ) : resumes.length === 0 ? (
            <div className="text-gray-500 text-center">No resumes found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume, idx) => (
                <div key={idx} className="bg-gray-100 border border-gray-300 rounded-lg shadow p-4 flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-2">{new Date(resume.created_at).toLocaleString()}</span>
                  <a
                    href={resume.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition text-center"
                  >
                    View PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

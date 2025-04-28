import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          University Attendance System
        </h1>
        <p className="text-xl mb-8">
          A comprehensive attendance tracking system for students, faculty, 
          parents, and administrators.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">For Students</h2>
            <p className="mb-4">
              Track your attendance records across all courses and submit leave applications.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">For Faculty</h2>
            <p className="mb-4">
              Easily mark attendance for your courses and manage student leave requests.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">For Parents</h2>
            <p className="mb-4">
              Monitor your child's attendance and submit leave applications when needed.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">For Administrators</h2>
            <p className="mb-4">
              Manage students, faculty, courses, and system settings efficiently.
            </p>
          </div>
        </div>
        
        <Link 
          href="/login" 
          className="btn btn-primary text-lg px-8 py-3"
        >
          Login to System
        </Link>
      </div>
    </main>
  );
} 
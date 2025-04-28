"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FacultyDashboard() {
  const { data: session } = useSession();
  const [coursesSummary, setCoursesSummary] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demonstration purposes, we're using mock data
    setTimeout(() => {
      setCoursesSummary([
        { id: 1, code: "MATH101", name: "Mathematics", students: 35, attendanceRecords: 980 },
        { id: 2, code: "PHY101", name: "Physics", students: 28, attendanceRecords: 784 },
        { id: 3, code: "CHEM101", name: "Chemistry", students: 31, attendanceRecords: 868 },
      ]);
      
      setPendingLeaves([
        { 
          id: 1, 
          studentName: "John Doe", 
          startDate: "2023-05-01", 
          endDate: "2023-05-03", 
          reason: "Medical", 
          status: "PENDING" 
        },
        { 
          id: 2, 
          studentName: "Jane Smith", 
          startDate: "2023-05-05", 
          endDate: "2023-05-06", 
          reason: "Family emergency", 
          status: "PENDING" 
        },
      ]);
      
      setRecentSessions([
        { id: 1, date: "2023-04-25", courseName: "Mathematics", present: 32, absent: 3 },
        { id: 2, date: "2023-04-24", courseName: "Physics", present: 25, absent: 3 },
        { id: 3, date: "2023-04-23", courseName: "Chemistry", present: 28, absent: 3 },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>
      <div className="mb-8">
        <p className="text-lg">
          Welcome back, <span className="font-semibold">{session?.user?.name}</span>!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">My Courses</h2>
            <Link href="/faculty/courses" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coursesSummary.map((course: any) => (
                  <tr key={course.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{course.name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-500">{course.code}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="text-gray-500">{course.students}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <Link
                        href={`/faculty/attendance/take/${course.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Take Attendance
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pending Leave Requests</h2>
            <Link href="/faculty/leave-requests" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          {pendingLeaves.length > 0 ? (
            <div className="space-y-3">
              {pendingLeaves.map((leave: any) => (
                <div key={leave.id} className="border-b pb-3">
                  <p className="font-medium">{leave.studentName}</p>
                  <p className="text-sm text-gray-600">
                    {leave.startDate} to {leave.endDate}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                  <div className="flex space-x-2">
                    <button className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                      Approve
                    </button>
                    <button className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pending leave requests</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Attendance Sessions</h2>
          <Link href="/faculty/attendance" className="text-blue-600 hover:underline text-sm">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSessions.map((session: any) => (
                <tr key={session.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-gray-500">{session.date}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{session.courseName}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="text-green-600 font-medium">{session.present}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="text-red-600 font-medium">{session.absent}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <Link
                      href={`/faculty/attendance/edit/${session.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
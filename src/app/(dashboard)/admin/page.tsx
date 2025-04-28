"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    attendanceToday: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demonstration purposes, we're using mock data
    setTimeout(() => {
      setStats({
        students: 245,
        faculty: 28,
        courses: 35,
        attendanceToday: 89,
      });
      
      setRecentUsers([
        { id: 1, name: "John Doe", email: "john.doe@example.com", role: "STUDENT", createdAt: "2023-04-25" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "FACULTY", createdAt: "2023-04-24" },
        { id: 3, name: "Mark Johnson", email: "mark.johnson@example.com", role: "PARENT", createdAt: "2023-04-23" },
        { id: 4, name: "Sarah Williams", email: "sarah.williams@example.com", role: "STUDENT", createdAt: "2023-04-22" },
      ]);
      
      setRecentCourses([
        { id: 1, code: "MATH101", name: "Mathematics", faculty: "Jane Smith", students: 35 },
        { id: 2, code: "PHY101", name: "Physics", faculty: "Robert Brown", students: 28 },
        { id: 3, code: "CHEM101", name: "Chemistry", faculty: "Michael Green", students: 31 },
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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-8">
        <p className="text-lg">
          Welcome, <span className="font-semibold">{session?.user?.name}</span>!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Students</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.students}</p>
          <Link href="/admin/users?role=student" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Manage Students
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Faculty</h2>
          <p className="text-3xl font-bold text-green-600">{stats.faculty}</p>
          <Link href="/admin/users?role=faculty" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Manage Faculty
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Courses</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.courses}</p>
          <Link href="/admin/courses" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Manage Courses
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Today's Attendance</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.attendanceToday}%</p>
          <Link href="/admin/attendance" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            View Details
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Link href="/admin/users" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "STUDENT"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "FACULTY"
                            ? "bg-green-100 text-green-800"
                            : user.role === "PARENT"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Courses</h2>
            <Link href="/admin/courses" className="text-blue-600 hover:underline text-sm">
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faculty
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCourses.map((course: any) => (
                  <tr key={course.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{course.name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{course.code}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{course.faculty}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500">{course.students}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
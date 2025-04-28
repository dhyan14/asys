"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ParentDashboard() {
  const { data: session } = useSession();
  const [childInfo, setChildInfo] = useState<any>(null);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    total: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demonstration purposes, we're using mock data
    setTimeout(() => {
      setChildInfo({
        name: "John Doe",
        rollNumber: "S12345",
        course: "Computer Science",
      });
      
      setAttendanceSummary({
        present: 75,
        absent: 15,
        leave: 10,
        total: 100,
      });
      
      setRecentAttendance([
        { id: 1, date: "2023-04-25", courseName: "Mathematics", status: "PRESENT" },
        { id: 2, date: "2023-04-24", courseName: "Physics", status: "PRESENT" },
        { id: 3, date: "2023-04-23", courseName: "Chemistry", status: "ABSENT" },
        { id: 4, date: "2023-04-22", courseName: "English", status: "LEAVE" },
      ]);
      
      setPendingLeaves([
        { id: 1, startDate: "2023-05-01", endDate: "2023-05-03", reason: "Medical", status: "PENDING" },
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

  const attendancePercentage = (attendanceSummary.present / attendanceSummary.total) * 100;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Parent Dashboard</h1>
      <div className="mb-8">
        <p className="text-lg">
          Welcome, <span className="font-semibold">{session?.user?.name}</span>!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Child Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{childInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Roll Number</p>
            <p className="font-medium">{childInfo.rollNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Course</p>
            <p className="font-medium">{childInfo.course}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>
          <div className="mb-2">
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
            <p className="mt-2 text-center">
              {attendancePercentage.toFixed(1)}% Present
            </p>
          </div>
          <div className="grid grid-cols-3 text-center mt-4">
            <div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="font-semibold text-green-600">{attendanceSummary.present}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="font-semibold text-red-600">{attendanceSummary.absent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Leave</p>
              <p className="font-semibold text-yellow-600">{attendanceSummary.leave}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Attendance</h2>
          <div className="space-y-2">
            {recentAttendance.map((record: any) => (
              <div key={record.id} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{record.courseName}</p>
                  <p className="text-sm text-gray-500">{record.date}</p>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === "PRESENT"
                        ? "bg-green-100 text-green-800"
                        : record.status === "ABSENT"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/parent/attendance" className="text-blue-600 hover:underline text-sm">
              View All Attendance Records
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Leave Applications</h2>
          {pendingLeaves.length > 0 ? (
            <div className="space-y-3">
              {pendingLeaves.map((leave: any) => (
                <div key={leave.id} className="border-b pb-3">
                  <p className="font-medium">
                    {leave.startDate} to {leave.endDate}
                  </p>
                  <p className="text-sm text-gray-600">{leave.reason}</p>
                  <p className="text-xs mt-1">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      {leave.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pending leave applications</p>
          )}
          <div className="mt-4 text-center">
            <Link href="/parent/leave" className="text-blue-600 hover:underline text-sm">
              Apply for Leave
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
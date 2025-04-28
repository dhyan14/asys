"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaUsers } from "react-icons/fa";

export default function DashboardNavigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? "bg-blue-700" : "";
  };

  const rolePath = () => {
    switch (userRole) {
      case "ADMIN":
        return "/admin";
      case "FACULTY":
        return "/faculty";
      case "STUDENT":
        return "/student";
      case "PARENT":
        return "/parent";
      default:
        return "/";
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "ADMIN":
        return <FaUserTie className="text-2xl" />;
      case "FACULTY":
        return <FaChalkboardTeacher className="text-2xl" />;
      case "STUDENT":
        return <FaUserGraduate className="text-2xl" />;
      case "PARENT":
        return <FaUsers className="text-2xl" />;
      default:
        return null;
    }
  };

  const getNavLinks = () => {
    const baseLinks = [
      {
        name: "Dashboard",
        href: `/${userRole?.toLowerCase()}`,
      },
      {
        name: "Profile",
        href: `/${userRole?.toLowerCase()}/profile`,
      },
    ];

    const roleSpecificLinks = {
      ADMIN: [
        { name: "Manage Users", href: "/admin/users" },
        { name: "Manage Courses", href: "/admin/courses" },
      ],
      FACULTY: [
        { name: "My Courses", href: "/faculty/courses" },
        { name: "Attendance", href: "/faculty/attendance" },
        { name: "Leave Requests", href: "/faculty/leave-requests" },
      ],
      STUDENT: [
        { name: "My Attendance", href: "/student/attendance" },
        { name: "Leave Applications", href: "/student/leave" },
      ],
      PARENT: [
        { name: "Child Attendance", href: "/parent/attendance" },
        { name: "Leave Applications", href: "/parent/leave" },
      ],
    };

    return [...baseLinks, ...(roleSpecificLinks[userRole as keyof typeof roleSpecificLinks] || [])];
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="w-64 bg-blue-800 text-white min-h-screen">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          {getRoleIcon()}
          <h2 className="text-xl font-semibold">
            {session?.user?.name || "User"}
          </h2>
        </div>
        <div className="text-sm opacity-75 mb-6">
          Role: {userRole}
        </div>

        <nav className="space-y-1">
          {getNavLinks().map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-md hover:bg-blue-700 transition-colors ${isActive(
                link.href
              )}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleSignOut}
            className="w-full py-2 text-center bg-blue-700 hover:bg-blue-600 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 
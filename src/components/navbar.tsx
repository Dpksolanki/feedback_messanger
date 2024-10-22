"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@react-email/components";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section */}
        <div>
          <Link href="#">
            <p className="text-white text-lg font-semibold hover:text-gray-300">
              Feedback Message
            </p>
          </Link>
        </div>

        {/* Right Section */}
        <div>
          {session ? (
            <>
              <span className="text-white mr-4">
                Welcome, {user?.username || user?.email}
              </span>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

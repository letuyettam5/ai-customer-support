"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to /home if the user is logged in
    if (session) {
      router.push("/home");
    }
  }, [session, router]);

  return (
    <div className="flex h-screen">
      {/* AI Chatbot Section */}
      <div className="flex-1 bg-gradient-to-r from-blue-100 to-blue-300 p-8 flex flex-col items-center justify-center shadow-lg">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-4">AI Chatbot</h2>
        <p className="text-lg text-blue-600 text-center">
        Engage with our AI chatbot for insightful conversations and assistance.
        </p>
      </div>

      {/* Sign In Section */}
      <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Sign In</h1>
        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center border border-gray-300 rounded-lg px-6 py-3 w-full max-w-xs bg-white text-gray-800 hover:bg-gray-100 transition duration-200 ease-in-out shadow-md"
        >
          <img
            src="/images/googlelogo.png"
            alt="Google Logo"
            className="w-6 h-6 mr-3"
          />
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("github")}
          className="flex items-center justify-center border border-gray-300 rounded-lg px-6 py-3 w-full max-w-xs bg-white text-gray-800 hover:bg-gray-100 transition duration-200 ease-in-out shadow-md mt-4"
        >
          <img
            src="/images/github-mark.png"
            alt="GitHub Logo"
            className="w-6 h-6 mr-3"
          />
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

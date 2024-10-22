'use client'

import React, { useState } from "react";
import { useParams } from "next/navigation"; 
// import { Button } from "@react-email/components"; // Custom button component, can be styled if needed

const Page = () => {
    const [message, setMessage] = useState("");
    const params = useParams<{ username: string }>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const receiverUsername = params?.username;

        const response = await fetch("/api/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ receiverUsername, content: message }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Message sent successfully!");
            setMessage(""); 
        } else {
            alert("Failed to send message: " + data.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">Send a Message to <span className="text-blue-500">{params.username}</span></h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        required
                        className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Page;

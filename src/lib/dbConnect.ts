import mongoose from "mongoose";

type ConnectionObject = {
    isConnected: boolean | number;  // 'number' because `mongoose.connection.readyState` returns a number
};

const connection: ConnectionObject = {
    isConnected: 0  // Initialize as 0 (disconnected)
};

async function dbConnect(): Promise<void> {  // Corrected 'Promise<void>'
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI || "", {});
        connection.isConnected = mongoose.connection.readyState;  // Corrected access to connection state
        console.log("Connected to the database");
    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1);
    }
}

export default dbConnect;

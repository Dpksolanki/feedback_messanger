import mongoose, { Schema, Document } from "mongoose";

// Message Interface
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

// Message Schema
const messageSchema = new Schema<Message>({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// User Interface
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    isVerified: boolean;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    messages: Message[];
}

// User Schema
const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"), "Please use a valid email address"]
    },
    isVerified: {
        type: Boolean,
        default: false,
    }, 
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        maxlength: 100
    },
    verifyCode: {
        type: String,
        default: null
    },
    verifyCodeExpiry: {
        type: Date,
        default: null
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]  // Embedding message schema
});

// Check if model already exists, else create it
const UserModel = mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;

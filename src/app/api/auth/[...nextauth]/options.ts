import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          // Find user by email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.username }
            ]
          });

          if (!user) {
            throw new Error("No user found with this identifier");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          // Compare the hashed password with the stored hashed password
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          // If everything is correct, return the user object
          return user;
        } catch (error: any) {
          // Improve the error handling to pass a clearer message
          throw new Error(`Error during authentication: ${error.message}`);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user is present (on initial sign-in), save user information in token
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token; // Return the token object
    },
    async session({ session, token }) {
      // Pass token data to session object
      session.user._id = token._id?.toString();
      session.user.isVerified = token.isVerified;
      session.user.isAcceptingMessages = token.isAcceptingMessages;
      session.user.username = token.username;
      return session; // Return the session object
    }
  },
  pages: {
    signIn: "/sign-in" // Redirect to the custom sign-in page
  },
  session: {
    strategy: "jwt" // Use JWT-based session strategy
  },
  secret: process.env.NEXTAUTH_SECRET // Ensure the secret is set properly
};

import dbConnect from "@/lib/db"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import UserModel from "@/models/user.model"
import bcrypt from "bcrypt"
import { SessionStrategy } from "next-auth"



 const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id : 'credentials',

      credentials: {
        identifier: { label: "Email or Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: Record<string, string> | undefined): Promise<any | null> {
        
        await dbConnect();  
        try {
          // Check if credentials are provided
          if (!credentials) {
            throw new Error("Credentials not provided");
          }
          
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier  },
              { username: credentials.identifier }
            ]
          });
          
          if (!user) {
            throw new Error("User not found with this email or username");
          }

          // Check if password is provided
          if (!credentials.password) {
            throw new Error("Password not provided");
          }

          const isPasswordMatched = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordMatched) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
            console.log("Error logging in user",error);
            return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); 
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
}
//export default NextAuth(authOptions)
export default authOptions


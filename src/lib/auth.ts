import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import { prisma } from "./prisma";
import authConfig from "./auth-config"
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginFormSchema } from "@/Shared/Schema/LoginSchema";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import Google from "next-auth/providers/google";



export type ExtendedUSer = DefaultSession["user"] & {
    roles: UserRole[];
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUSer
    }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks: {
        // This runs after authentication succeeds, for ALL providers:
        //  it can block the user even if the provider is valid
        // Authorization
        async signIn({ user }) {
            const getUser = await prisma.user.findUnique({
                where: { id: user.id }
            })
            if (!getUser) {
                return false;
            }
            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                const getUser = await prisma.user.findUnique({
                    where: { id: token.sub }
                })
                if (getUser) {
                    token.role = getUser?.roles;
                    session.user.roles = getUser?.roles;
                }
            }
            return session;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        // When some one login with email and password
        // it doesn't generate any token or session
        // check the credentials are valid or not
        // Authentication
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            async authorize(credentials) {
                const validateFields = LoginFormSchema.safeParse(credentials);
                if (!validateFields.success) {
                    throw new Error(validateFields.error.message);
                }
                const { email, password } = validateFields.data;
                const user = await prisma.user.findUnique({
                    where: { email }
                })
                if (!user || !user.password) return null;
                const matchPassword = await bcrypt.compare(password, user.password);
                if (!matchPassword) return null;
                return user;
            }
        })
    ]
});
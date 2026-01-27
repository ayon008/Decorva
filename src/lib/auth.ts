import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import { prisma } from "./prisma";
import authConfig from "./auth-config"
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginFormSchema } from "@/Shared/Schema/LoginSchema";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import Google from "next-auth/providers/google";




// event vs callbacks
// callbacks are used to perform some task after the a action is performed
// callback diye user block kora jay, authorization kora jay
// callback = decision makers
// Events hocche listeners
// Auth action hoye jawar POR e run hoy
// Logging, email, analytics er jonno use hoy
// Event diye user block kora jay na



export type ExtendedUSer = DefaultSession["user"] & {
    roles: UserRole[];
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUSer
    }
}



export const { auth, handlers, signIn, signOut } = NextAuth({
    events: {
        // email & password diye jodi account khola thake , abr same email diye google diye account khole tahole next auth new user create na kore link kore dibe
        async linkAccount({ user }) {
            const updateUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: true
                }
            })
        }
    },
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
                    token.roles = getUser?.roles;
                    session.user.roles = getUser?.roles;
                }
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;
            const getUser = await prisma.user.findUnique({
                where: { id: token.sub }
            })
            if (!getUser) return token;
            token.roles = getUser?.roles;
            return token;
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
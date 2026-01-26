import NextAuth from "next-auth"

import { NextResponse } from "next/server";
import authConfig from "./lib/auth-config";

const { auth } = NextAuth(authConfig)
export default auth(async function proxy(req) {
    const isLoggedIn = !!req.auth;
    const protectedRoutes = ['/my-account'];
    const adminRoutes = ['/dashboard', '/dashboard/:path*'];
    const pathName = req.nextUrl.pathname;
    const session = await auth();
    const roles = session?.user?.roles;
    if (protectedRoutes.includes(pathName) && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathName === '/login' && isLoggedIn) {
        return NextResponse.redirect(new URL('/my-account', req.url))
    }


    return NextResponse.next();
})

export const config = {
    matcher: ['/((?!_next|api/auth).*)']
};

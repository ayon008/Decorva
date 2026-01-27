import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth(async function middleware(req) {
    const isLoggedIn = !!req.auth;
    const roles = req.auth?.user?.roles ?? [];
    const isAdmin = roles.includes("ADMIN");
    const pathName = req.nextUrl.pathname;

    const isProtectedRoute = pathName.startsWith("/my-account");
    const isAdminRoute =
        pathName === "/dashboard" || pathName.startsWith("/dashboard/");

    // 🔒 Protected routes (auth required)
    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathName);
        return NextResponse.redirect(loginUrl);
    }

    // 🛡 Admin routes (auth + admin role)
    if (isAdminRoute) {
        if (!isLoggedIn || !isAdmin) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathName);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 🚫 Logged-in users shouldn't see login page
    if (isLoggedIn && pathName === "/login") {
        return NextResponse.redirect(new URL("/my-account", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!_next|api/auth).*)"],
};

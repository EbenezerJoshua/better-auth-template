import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
    if(!session) {
        return NextResponse.redirect(new URL("/auth/verify-email", request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"], // Specify the routes the middleware applies to
};


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// /**
//  * Middleware responsibilities:
//  * 1. Prevent verified users from accessing /auth/verify-email
//  * 2. Prevent unauthenticated users from accessing /dashboard
//  */
// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const cookieHeader = req.headers.get("cookie") ?? "";

//   // Ask Better Auth for the session (server-validated)
//   const sessionRes = await fetch(
//     `${req.nextUrl.origin}/api/auth/session`,
//     {
//       headers: {
//         cookie: cookieHeader,
//       },
//     }
//   );

//   const session = sessionRes.ok ? await sessionRes.json() : null;

//   /* ---------------- VERIFY EMAIL PAGE ---------------- */

//   if (pathname.startsWith("/auth/verify-email")) {
//     // ❌ Not logged in → go to login
//     if (!session?.user) {
//       return NextResponse.redirect(
//         new URL("/auth/login", req.url)
//       );
//     }

//     // ✅ Already verified → dashboard
//     if (session.user.emailVerified) {
//       return NextResponse.redirect(
//         new URL("/dashboard", req.url)
//       );
//     }

//     // ⏳ Logged in but not verified → allow
//     return NextResponse.next();
//   }

//   /* ---------------- PROTECTED ROUTES ---------------- */

//   if (pathname.startsWith("/dashboard")) {
//     // ❌ Not logged in → login
//     if (!session?.user) {
//       return NextResponse.redirect(
//         new URL("/auth/login", req.url)
//       );
//     }

//     // ❌ Logged in but not verified → verify email
//     if (!session.user.emailVerified) {
//       return NextResponse.redirect(
//         new URL("/auth/verify-email", req.url)
//       );
//     }

//     // ✅ Logged in & verified → allow
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// /* ---------------- MATCHER ---------------- */

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/auth/verify-email",
//   ],
// };

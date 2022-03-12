// import {NextRequest, NextResponse} from "next/server";
// import {GetAuthUserQueryResult} from "../generated/graphql";

// export function middleware(req: NextRequest, res: NextResponse) {
//   const {url, cookies} = req;

//   if (url.includes("/account/profile")) {
//     const {access_token, refresh_token} = cookies;
//     console.log("access_token", access_token);
//     // console.log("refresh_token", refresh_token);

//     let authUser: GetAuthUserQueryResult | undefined;
//     if (access_token) {
//       //     console.log("access_token", access_token);
//       //     //! Get user info
//     } else if (refresh_token) {
//       //     console.log("refresh_token", refresh_token);
//       //     //! Refresh token to new access_token
//       //     //! Get user info
//     } else {
//       const url = req.nextUrl.clone();
//       url.pathname = "/auth/login";
//       return NextResponse.redirect(url);
//     }

//     //   //! check user info
//     //   //! if user is not exist
//     //   //? if access_token or refresh_token is exist
//     //   //? clear cookies
//     //   //? redirect to login page
//   }
//   NextResponse.next();
// }

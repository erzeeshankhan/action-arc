import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


// below we can add the paths we want to protect from use and pass this function to the clerkMiddleware and add conditions on which we give access to user or not 
const isProtectedRoute = createRouteMatcher([
  // Add your protected routes here
  "/onboarding(.*)",
  "/organization(.*)",
  "/project(.*)",
  "/issue(.*)",
]);


export default clerkMiddleware((auth,req)=>{
  // below condition: it takes authentication userid & protected routes i.e., if the user is not signed in and wants to access pretected routes, redirect him to the sign in page
  if(!auth().userId && isProtectedRoute(req)){
    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
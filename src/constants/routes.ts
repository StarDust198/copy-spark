export const publicRoutes = {
  signin: {
    title: "Sign In",
    url: "/signin",
  },
  signup: {
    title: "Sign Up",
    url: "/signup",
  },
} as const;

export const privateRoutes = {
  new: {
    title: "New generation",
    url: "/new",
  },
} as const;

export const routes = {
  ...publicRoutes,
  ...privateRoutes,
} as const;

export type RouteKey = keyof typeof routes;
export type RouteData = (typeof routes)[RouteKey];
export type RouteUrl = RouteData["url"];
export type RouteTitle = RouteData["title"];

export const SIGN_OUT_TITLE = "Sign Out";

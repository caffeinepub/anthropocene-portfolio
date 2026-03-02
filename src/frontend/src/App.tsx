import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { CustomCursor } from "./components/CustomCursor";
import { CursorProvider } from "./context/CursorContext";
import { Art } from "./pages/Art";
import { Design } from "./pages/Design";
import { Home } from "./pages/Home";
import { Research } from "./pages/Research";

// Root layout wraps all routes with cursor context
function RootLayout() {
  return (
    <CursorProvider>
      <CustomCursor />
      <Outlet />
    </CursorProvider>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const designRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design",
  component: Design,
});

const artRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/art",
  component: Art,
});

const researchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/research",
  component: Research,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  designRoute,
  artRoute,
  researchRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import { Suspense, lazy } from "react";
import { circleLoader } from "./utilities/components";

function App() {
  const Home = lazy(() => import("./components/Home/Home"));
  const Auth = lazy(() => import("./components/Auth/Auth"));
  
  return (
    <div className="App">
      <Routes>
        <Route
          path="auth"
          element={
            <Suspense fallback={circleLoader}>
              <Auth />
            </Suspense>
          }
        >
          <Route path="*" element={<>Page not found</>} />
        </Route>
        <Route
          path="home"
          element={
            <Suspense fallback={circleLoader}>
              <Home />
            </Suspense>
          }
        >
          <Route path="*" element={<>Page not found</>} />
        </Route>
        <Route path="*" element={<Navigate to={"auth"} />} />
      </Routes>
    </div>
  );
}

export default App;

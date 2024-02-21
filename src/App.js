import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import { Suspense, lazy } from "react";
import { CircleLoader } from "./utilities/components";

function App() {
  const Home = lazy(() => import("./components/Home/Home"));
  const Auth = lazy(() => import("./components/Auth/Auth"));
  
  return (
    <div className="App">
      <Routes>
        <Route
          path="auth"
          element={
            <Suspense fallback={CircleLoader}>
              <Auth />
            </Suspense>
          }
        >
          <Route path="*" element={<>Page not found</>} />
        </Route>
        <Route
          path=":uId/home"
          element={
            <Suspense fallback={CircleLoader}>
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

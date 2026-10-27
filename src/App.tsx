import { Navigate, Route, Routes } from "react-router-dom";
import CVPage from "./pages/CVPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import RequireAuth from "./auth/RequireAuth";
import { useFx } from "./hooks/useFx";

export default function App() {
  useFx();

  return (
    <Routes>
      <Route path="/" element={<CVPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

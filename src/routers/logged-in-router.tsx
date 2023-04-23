import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function LoggedInRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Login</div>} />
      </Routes>
    </BrowserRouter>
  );
}

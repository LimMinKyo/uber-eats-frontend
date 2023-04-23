import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function LoggedOutRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Logout</div>} />
      </Routes>
    </BrowserRouter>
  );
}

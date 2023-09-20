import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { NotFoundPage } from "./404";
import { BrowserRouter as Router } from "react-router-dom";

describe("<NotFound />", () => {
  it("renders OK", async () => {
    render(
      <HelmetProvider>
        <Router>
          <NotFoundPage />
        </Router>
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe("Not Found | Uber Eats");
    });
  });
});

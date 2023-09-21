import { render, waitFor } from "../test-utils";
import { NotFoundPage } from "./404";

describe("<NotFound />", () => {
  it("renders OK", async () => {
    render(<NotFoundPage />);
    await waitFor(() => {
      expect(document.title).toBe("Not Found | Uber Eats");
    });
  });
});

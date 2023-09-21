describe("Update Profile", () => {
  const user = cy;

  beforeEach(() => {
    user.login("client@test.com", "12345");
  });

  it("can go to /update-profile using the header", () => {
    user.get('a[href="/update-profile"]').click();
    user.title().should("eq", "Update Profile | Uber Eats");
  });

  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (
        req.body?.operationName === "editProfile" &&
        req.body?.variables?.input?.email
      ) {
        req.body.variables.input.email = "client@test.com";
      }
    });
    user.visit("/update-profile");
    user.findByPlaceholderText(/email/i).clear().type("new@test.com");
    user.findByRole("button");
  });
});

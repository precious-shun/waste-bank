import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UsersManagement from "../pages/admin/UsersManagement";
import { BrowserRouter } from "react-router-dom";

describe("Users Management", () => {
  //1. check if users management rendered
  it("should render Users Management component", () => {
    const renderedUsersManagement = render(
      <BrowserRouter>
        <UsersManagement />
      </BrowserRouter>
    );

    expect(renderedUsersManagement).toBeDefined();
  });
});

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotificationsManagement from "../pages/admin/NotificationsManagement";
import { BrowserRouter } from "react-router-dom";

describe("Notifications Management", () => {
  //1. check if notifications management rendered
  it("should render Notifications Management component", () => {
    const renderedNotificationsManagement = render(
      <BrowserRouter>
        <NotificationsManagement />
      </BrowserRouter>
    );

    expect(renderedNotificationsManagement).toBeDefined();
  });
});

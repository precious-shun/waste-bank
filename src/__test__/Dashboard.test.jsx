import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Dashboard from "../pages/admin/Dashboard";
import { BrowserRouter } from "react-router-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

// Mock Firebase Firestore
vi.mock("../firebase", () => ({
  db: {
    collection: vi.fn(),
  },
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
}));

describe("Dashboard", () => {
  //1. check if dashboard rendered
  it("should render Dashboard component", () => {
    const renderedDashboard = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(renderedDashboard).toBeDefined();
  });

  // 2. Check if total users count is displayed
  it("should display total users count", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const totalUsersElement = await screen.findByText(/Total Users/i);
    expect(totalUsersElement).toBeDefined();
  });

  // 3. Check if statistics cards exist
  it("should render statistics cards", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const stats = [
      "Total Users",
      "Total Waste",
      "Total Balance",
      "Total Transaction",
    ];

    stats.forEach((stat) => {
      expect(screen.getByText(stat)).toBeDefined();
    });
  });

  // 4. Check if chart renders
  it("should render the revenue chart", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const chartTitle = screen.getByText(/Monthly Revenue/i);
    expect(chartTitle).toBeDefined();
  });
});

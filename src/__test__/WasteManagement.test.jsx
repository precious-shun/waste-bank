import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import WasteManagement from "../pages/admin/WasteManagement";
import { BrowserRouter } from "react-router-dom";

// ✅ Mock Firebase Firestore
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");

  return {
    ...actual,
    getDocs: vi.fn(),
    collection: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
  };
});

import { getDocs } from "firebase/firestore";

describe("Waste Management", () => {
  // 🗑️ Sample Mock Data
  const mockWastes = [
    { id: "1", waste: "Plastic", unit: "kg", price: 1000 },
    { id: "2", waste: "Metal", unit: "kg", price: 2000 },
  ];

  // ✅ Reset Mocks Before Each Test
  beforeEach(() => {
    getDocs.mockResolvedValue({
      docs: mockWastes.map((waste) => ({
        id: waste.id,
        data: () => waste,
      })),
    });
  });

  // ✅ 1. Render Test
  it("should render Waste Management component", async () => {
    render(
      <BrowserRouter>
        <WasteManagement />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Plastic")).toBeInTheDocument();
      expect(screen.getByText("Metal")).toBeInTheDocument();
    });
  });

  // ✅ 2. Check Table Headers
  it("should render table headers", () => {
    render(
      <BrowserRouter>
        <WasteManagement />
      </BrowserRouter>
    );

    expect(screen.getByText("Waste")).toBeInTheDocument();
    expect(screen.getByText("Unit")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  // ✅ 3. Check Search Bar Exists
  it("should render search bar", () => {
    render(
      <BrowserRouter>
        <WasteManagement />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search");
    expect(searchInput).toBeInTheDocument();
  });

  // ✅ 4. Check if Typing in Search Works
  it("should update search query on input change", () => {
    render(
      <BrowserRouter>
        <WasteManagement />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "plastic" } });

    expect(searchInput.value).toBe("plastic");
  });

  // ✅ 5. Check "Add Waste Product" Button Opens Modal
  it("should open add waste modal when clicking 'Add Waste Product'", () => {
    render(
      <BrowserRouter>
        <WasteManagement />
      </BrowserRouter>
    );

    const addButton = screen.getByText(/Add Waste Product/i);
    fireEvent.click(addButton);

    expect(screen.getByText(/Add Waste Category/i)).toBeInTheDocument();
  });

  // ✅ 6. Check "Delete" Button Opens Confirmation Modal
  it("should open delete confirmation modal when clicking 'Delete'", async () => {
    render(
      <BrowserRouter>
        <WasteManagement />
      </BrowserRouter>
    );

    // Select the first "Delete" button
    const deleteButtons = await screen.findAllByText(/Delete/i);
    fireEvent.click(deleteButtons[0]);

    expect(
      screen.getByText(/Are you sure you want to delete this data?/i)
    ).toBeInTheDocument();
  });

  // ✅ 7. Check Clicking "No" Button Close Delete Confirmation Modal
  it("should close delete confirmation modal when clicking 'No'", async () => {
    render(
      <BrowserRouter>
        <WasteManagement />
      </BrowserRouter>
    );

    // Click the first Delete button
    const deleteButtons = await screen.findAllByText(/Delete/i);
    fireEvent.click(deleteButtons[0]);

    // Ensure the delete confirmation modal appears
    expect(
      screen.getByText(/Are you sure you want to delete this data?/i)
    ).toBeInTheDocument();

    // Find "No" button inside the confirmation modal
    const modalTitle = screen.getByText(
      "Are you sure you want to delete this data?"
    );
    const modal = modalTitle.closest("div"); // Ambil parent div yang merupakan modal
    const noButton = within(modal).getByText(/No/i);

    // Click "No" to cancel the deletion
    fireEvent.click(noButton);

    // Ensure the confirmation modal disappears
    expect(
      screen.queryByText(/Are you sure you want to delete this data?/i)
    ).not.toBeInTheDocument();
  });
});

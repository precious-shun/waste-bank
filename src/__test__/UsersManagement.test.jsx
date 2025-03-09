import { render, screen, waitFor } from "@testing-library/react"; // Added screen
import { describe, expect, it, vi, beforeEach } from "vitest";
import UsersManagement from "../pages/admin/UsersManagement";
import { BrowserRouter } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, query, where } from "firebase/firestore"; // Added query, where

vi.mock("../firebase.js", () => ({
  db: {
    collection: vi.fn(),
  },
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Users Management", () => {
  const mockUsers = [
    {
      id: "user1",
      fullname: "John Doe",
      address: "123 Main St",
      email: "john.doe@example.com",
      gender: "male",
      role: "user",
    },
    {
      id: "user2",
      fullname: "Jane Smith",
      address: "456 Oak Ave",
      email: "jane.smith@example.com",
      gender: "female",
      role: "admin",
    },
  ];
  const mockTransactions = [
    { user_id: { id: "user1" }, total: 100 },
    { user_id: { id: "user1" }, total: 50 },
    { user_id: { id: "user2" }, total: 200 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    getDocs.mockImplementation((q) => {
      if (q === collection(db, "users")) {
        return Promise.resolve({
          docs: mockUsers.map((user) => ({ data: () => user, id: user.id })),
        });
      } else if (
        q ===
        query(
          collection(db, "transactions"),
          where("user_id", "==", { id: "user1" })
        )
      ) {
        return Promise.resolve({
          docs: mockTransactions
            .filter((t) => t.user_id.id === "user1")
            .map((t) => ({ data: () => t })),
        });
      } else if (
        q ===
        query(
          collection(db, "transactions"),
          where("user_id", "==", { id: "user2" })
        )
      ) {
        return Promise.resolve({
          docs: mockTransactions
            .filter((t) => t.user_id.id === "user2")
            .map((t) => ({ data: () => t })),
        });
      }
      return Promise.resolve({ docs: [] });
    });
    collection.mockImplementation((name) => {
      if (name === "users") {
        return "users";
      }
      if (name === "transactions") {
        return "transactions";
      }
      return null;
    });
    where.mockImplementation((field, operator, value) => ({
      field,
      operator,
      value,
    }));
    query.mockImplementation((col, whereClause) => ({ col, whereClause }));
    doc.mockImplementation((db, collection, docId) => ({
      db,
      collection,
      docId,
    }));
  });

  it("should render Users Management component", () => {
    const renderedUsersManagement = render(
      <BrowserRouter>
        <UsersManagement />
      </BrowserRouter>
    );
    expect(renderedUsersManagement).toBeDefined();
  });

  it("should renders the users data in the table", async () => {
    render(
      <BrowserRouter>
        <UsersManagement />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it('should displays "User not found" when no users are available', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });
    render(
      <BrowserRouter>
        <UsersManagement />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });
  });
});

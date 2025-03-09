import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TransactionManagement from "../pages/admin/TransactionsManagement";
import { BrowserRouter } from "react-router-dom";

describe("Transaction Management", () => {
  //1. check if transaction management rendered
  it("should render Users Management component", () => {
    const renderedTransactionManagement = render(
      <BrowserRouter>
        <TransactionManagement />
      </BrowserRouter>
    );

    expect(renderedTransactionManagement).toBeDefined();
  });
});

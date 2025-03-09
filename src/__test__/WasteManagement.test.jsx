import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WasteManagement from "../pages/admin/WasteManagement";
import { BrowserRouter } from "react-router-dom";

describe("Waste Management", () => {
  //1. check if waste management rendered
  it("should render Waste Management component", () => {
    const renderedWasteManagement = render(
      <BrowserRouter>
        <WasteManagement />
      </BrowserRouter>
    );

    expect(renderedWasteManagement).toBeDefined();
  });
});

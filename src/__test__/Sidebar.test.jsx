import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Sidebar from "../components/Sidebar";
import { BrowserRouter } from "react-router-dom";

describe("Sidebar", () => {
  //1. check if sidebar rendered
  it("should render Sidebar component", () => {
    const renderedSidebar = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(renderedSidebar).toBeDefined();
  });
});

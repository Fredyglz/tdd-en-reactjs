import React from "react";
import { render, screen } from "@testing-library/react";

import HellorWorld from "./hello-world";

test("render hello world", () => {
  render(<HellorWorld />);

  const title = screen.getByText(/hello world/i);
  expect(title).toBeInTheDocument();
});

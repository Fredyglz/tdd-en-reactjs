import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import Counter from "./counter";

test("display zero initial counts", () => {
  render(<Counter />);
  const result = screen.getByText(/clicked times: 0/i);

  expect(result).toBeInTheDocument();
});

test("display new counter after one click", () => {
  render(<Counter />);

  const button = screen.getByRole("button", { name: /click/i });
  fireEvent.click(button);

  const result = screen.getByText(/clicked times: 1/i);

  expect(result).toBeInTheDocument();
});

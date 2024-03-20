import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";

// Mocking react-router-dom's Link component
jest.mock("react-router-dom", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mocking the image import
jest.mock("../assets/logo.png", () => "mocked-logo-path");

jest.mock("../assets/meterbox.png", () => "meterbox-path");

// Mocking window.location.assign
delete (window as any).location;
(window as any).location = { assign: jest.fn() };

describe("App component", () => {
  test("Home page renders without crashing", () => {
    render(<App />);
    // Check if the component renders without crashing
    expect(screen.getByText(/We are thrilled/i)).toBeInTheDocument();
  });

  test("Home page renders login and register buttons", () => {
    render(<App />);
    // Check if the Login and Register buttons are rendered
    expect(screen.getAllByText("Login")).toHaveLength(2);
    expect(screen.getAllByText("Register")).toHaveLength(2);
  });
});

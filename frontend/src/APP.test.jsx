// App.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "./App";

jest.mock("axios");

describe("App Component", () => {
  test("renders the component", () => {
    render(<App />);
    expect(screen.getByText("URL Security Assessment")).toBeInTheDocument();
  });

  test("handles form submission and displays result with vulnerabilities", async () => {
    const urlWithVulnerabilities = "https://www.jimsindia.org/";
    const mockedResponse = {
      data: {
        assessment: {
          vulnerabilities: ["XSS", "Insecure Password Storage"],
        },
      },
    };

    axios.get.mockResolvedValueOnce(mockedResponse);

    render(<App />);

    // Fill the URL input
    userEvent.type(
      screen.getByPlaceholderText("Enter URL ....."),
      urlWithVulnerabilities
    );

    // Click on the search button
    userEvent.click(screen.getByRole("button"));

    // Wait for the result to be displayed
    await waitFor(() => {
      expect(
        screen.getByText(`URL: ${urlWithVulnerabilities}`)
      ).toBeInTheDocument();
      expect(screen.getByText("XSS")).toBeInTheDocument();
      expect(screen.getByText("Insecure Password Storage")).toBeInTheDocument();
    });
  });

  test("handles form submission and displays result without vulnerabilities", async () => {
    const urlWithoutVulnerabilities = "https://www.google.com/";
    const mockedResponse = {
      data: {
        assessment: {
          vulnerabilities: ["No Common Vulnerabilities Detected"],
        },
      },
    };

    axios.get.mockResolvedValueOnce(mockedResponse);

    render(<App />);

    // Fill the URL input
    userEvent.type(
      screen.getByPlaceholderText("Enter URL ....."),
      urlWithoutVulnerabilities
    );

    // Click on the search button
    userEvent.click(screen.getByRole("button"));

    // Wait for the result to be displayed
    await waitFor(() => {
      expect(
        screen.getByText(`URL: ${urlWithoutVulnerabilities}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText("No Common Vulnerabilities Detected")
      ).toBeInTheDocument();
    });
  });

  test("handles form submission and displays loading spinner", async () => {
    const url = "http://example.com";
    const mockedResponse = new Promise(() => {}); // Simulate a slow response

    axios.get.mockResolvedValueOnce(mockedResponse);

    render(<App />);

    // Fill the URL input
    userEvent.type(screen.getByPlaceholderText("Enter URL ....."), url);

    // Click on the search button
    userEvent.click(screen.getByRole("button"));

    // Wait for the loading spinner to be displayed
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  // Add more test cases as needed
});

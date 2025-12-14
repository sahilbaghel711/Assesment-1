import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock fetch
global.fetch = jest.fn();

describe("Commission Calculator", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  // Renders all inputs and button
  test("renders all inputs and button", () => {
    render(<App />);

    expect(screen.getByLabelText(/Local Sales Count/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Foreign Sales Count/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Average Sale Amount/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Calculate Commission/i })
    ).toBeInTheDocument();
  });

  //  User can enter values
  test("user can enter values in all inputs", () => {
    render(<App />);

    const localInput = screen.getByLabelText(/Local Sales Count/i);
    const foreignInput = screen.getByLabelText(/Foreign Sales Count/i);
    const amountInput = screen.getByLabelText(/Average Sale Amount/i);

    fireEvent.change(localInput, { target: { value: "10" } });
    fireEvent.change(foreignInput, { target: { value: "5" } });
    fireEvent.change(amountInput, { target: { value: "1000" } });

    expect(localInput.value).toBe("10");
    expect(foreignInput.value).toBe("5");
    expect(amountInput.value).toBe("1000");
  });

  //  Does not submit with empty inputs
  test("does not submit with empty inputs", () => {
    render(<App />);

    const localInput = screen.getByLabelText(/Local Sales Count/i);
    const foreignInput = screen.getByLabelText(/Foreign Sales Count/i);
    const amountInput = screen.getByLabelText(/Average Sale Amount/i);

    expect(localInput).toBeRequired();
    expect(foreignInput).toBeRequired();
    expect(amountInput).toBeRequired();
  });

  //  Calls API with correct payload
  test("calls API with correct payload", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        avalphaTechnologiesCommissionAmount: 1000,
        competitorCommissionAmount: 100,
      }),
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Local Sales Count/i), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText(/Foreign Sales Count/i), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByLabelText(/Average Sale Amount/i), {
      target: { value: "500.50" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Calculate Commission/i })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/Commision"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            localSalesCount: 20,
            foreignSalesCount: 15,
            averageSaleAmount: 500.5,
          }),
        })
      );
    });
  });

  // Shows loading + disables button
  test("shows loading state and disables button during API call", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        avalphaTechnologiesCommissionAmount: 1000,
        competitorCommissionAmount: 100,
      }),
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Local Sales Count/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Foreign Sales Count/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/Average Sale Amount/i), {
      target: { value: "1000" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Calculate Commission/i,
    });

    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent("Calculating...");
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).toHaveTextContent("Calculate Commission");
    });

    expect(submitButton).not.toBeDisabled();
  });

  //  Displays result on success
  test("displays results on successful API call", async () => {
    const mockResponse = {
      avalphaTechnologiesCommissionAmount: 5250,
      competitorCommissionAmount: 577.75,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Local Sales Count/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Foreign Sales Count/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/Average Sale Amount/i), {
      target: { value: "1000" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Calculate Commission/i })
    );

    await waitFor(() => {
      expect(screen.getByText("£5250.00")).toBeInTheDocument();
    });

    expect(screen.getByText("£577.75")).toBeInTheDocument();
  });

  //  Shows error on failure
  test("shows error message on API failure", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Local Sales Count/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Foreign Sales Count/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/Average Sale Amount/i), {
      target: { value: "1000" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Calculate Commission/i,
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    // Button should be enabled again after error
    expect(submitButton).not.toBeDisabled();

    consoleErrorSpy.mockRestore();
  });
});

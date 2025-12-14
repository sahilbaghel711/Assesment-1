import logo from "./logo.png";
import "./App.css";
import { useState } from "react";
import { API_BASE_URL } from "./environment";

function App() {
  const [formData, setFormData] = useState({
    localSalesCount: "",
    foreignSalesCount: "",
    averageSaleAmount: "",
  });

  const [results, setResults] = useState({
    avalphaTechnologiesCommission: 0,
    competitorCommission: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchCommissionData = async () => {
    const response = await fetch(`${API_BASE_URL}/Commision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        localSalesCount: parseInt(formData.localSalesCount),
        foreignSalesCount: parseInt(formData.foreignSalesCount),
        averageSaleAmount: parseFloat(formData.averageSaleAmount),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await fetchCommissionData();

      if (data) {
        setResults({
          avalphaTechnologiesCommission:
            data.avalphaTechnologiesCommissionAmount.toFixed(2),
          competitorCommission: data.competitorCommissionAmount.toFixed(2),
        });
      }
    } catch (error) {
      console.error("Error calculating commission:", error);
      alert(
        "Failed to calculate commission. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img
            src={logo}
            className="App-logo"
            alt="Avalpha Technologies Logo"
          />
          <h1 className="company-title">Avalpha Technologies</h1>
          <h2 className="app-subtitle">Commission Calculator</h2>
        </div>
      </header>

      <main className="main-content">
        <div className="calculator-container">
          <div className="form-section">
            <h3>Sales Information</h3>
            <form onSubmit={handleSubmit} className="calculator-form">
              <div className="form-group">
                <label htmlFor="localSalesCount">Local Sales Count</label>
                <input
                  type="number"
                  id="localSalesCount"
                  name="localSalesCount"
                  value={formData.localSalesCount}
                  onChange={handleInputChange}
                  placeholder="Enter number of local sales"
                  required
                  min="0"
                  max="100000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="foreignSalesCount">Foreign Sales Count</label>
                <input
                  type="number"
                  id="foreignSalesCount"
                  name="foreignSalesCount"
                  value={formData.foreignSalesCount}
                  onChange={handleInputChange}
                  placeholder="Enter number of foreign sales"
                  required
                  min="0"
                  max="100000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="averageSaleAmount">
                  Average Sale Amount (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="averageSaleAmount"
                  name="averageSaleAmount"
                  value={formData.averageSaleAmount}
                  onChange={handleInputChange}
                  placeholder="Enter average sale amount"
                  required
                  min="0.01"
                  max="10000000"
                />
              </div>

              <button
                type="submit"
                className={`calculate-btn ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Calculating..." : "Calculate Commission"}
              </button>
            </form>
          </div>

          <div className="results-section">
            <h3>Commission Results</h3>
            <div className="results-grid">
              <div className="result-card avalpha-card">
                <div className="result-header">
                  <h4>Avalpha Technologies</h4>
                  <span className="commission-rates">
                    Local: 20% | Foreign: 35%
                  </span>
                </div>
                <div className="result-amount">
                  £{results.avalphaTechnologiesCommission}
                </div>
              </div>

              <div className="result-card competitor-card">
                <div className="result-header">
                  <h4>Competitor</h4>
                  <span className="commission-rates">
                    Local: 2% | Foreign: 7.55%
                  </span>
                </div>
                <div className="result-amount">
                  £{results.competitorCommission}
                </div>
              </div>
            </div>

            {results.avalphaTechnologiesCommission > 0 && (
              <div className="advantage-indicator">
                <p className="advantage-text">
                  Avalpha Technologies advantage:
                  <strong>
                    {" "}
                    £
                    {(
                      results.avalphaTechnologiesCommission -
                      results.competitorCommission
                    ).toFixed(2)}
                  </strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Avalpha Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

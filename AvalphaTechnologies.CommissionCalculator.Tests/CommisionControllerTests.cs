using AvalphaTechnologies.CommissionCalculator.Controllers;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace AvalphaTechnologies.CommissionCalculator.Tests
{
    public class CommisionControllerTests
    {
        private readonly CommisionController _controller;

        public CommisionControllerTests()
        {
            _controller = new CommisionController();
        }

        #region Happy Path Tests

        [Fact]
        public void Calculate_ValidInput_ReturnsOkWithCorrectCommissions()
        {
            // Arrange
            var request = new CommissionCalculationRequest
            {
                LocalSalesCount = 10,
                ForeignSalesCount = 10,
                AverageSaleAmount = 100m
            };

            // Act
            var result = _controller.Calculate(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<CommissionCalculationResponse>(okResult.Value);

            Assert.Equal(550m, response.AvalphaTechnologiesCommissionAmount); // (10*100*0.2) + (10*100*0.35)
            Assert.Equal(95.5m, response.CompetitorCommissionAmount); // (10*100*0.02) + (10*100*0.0755)
        }

        #endregion

        #region Invalid Input Tests

        [Fact]
        public void Calculate_NegativeLocalSalesCount_ReturnsBadRequest()
        {
            // Arrange
            var request = new CommissionCalculationRequest
            {
                LocalSalesCount = -5,
                ForeignSalesCount = 10,
                AverageSaleAmount = 100m
            };

            // Act
            var result = _controller.Calculate(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid local sales count.", badRequestResult.Value);
        }

        [Fact]
        public void Calculate_NegativeForeignSalesCount_ReturnsBadRequest()
        {
            // Arrange
            var request = new CommissionCalculationRequest
            {
                LocalSalesCount = 10,
                ForeignSalesCount = -3,
                AverageSaleAmount = 100m
            };

            // Act
            var result = _controller.Calculate(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid local sales count.", badRequestResult.Value);
        }

        [Fact]
        public void Calculate_NegativeAverageSaleAmount_ReturnsBadRequest()
        {
            // Arrange
            var request = new CommissionCalculationRequest
            {
                LocalSalesCount = 10,
                ForeignSalesCount = 10,
                AverageSaleAmount = -50m
            };

            // Act
            var result = _controller.Calculate(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid local sales count.", badRequestResult.Value);
        }

        #endregion




    }
}
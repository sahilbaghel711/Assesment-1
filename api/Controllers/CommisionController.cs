using Microsoft.AspNetCore.Mvc;

namespace AvalphaTechnologies.CommissionCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommisionController : ControllerBase
    {
        [ProducesResponseType(typeof(CommissionCalculationResponse), 200)]
        [HttpPost]
        public IActionResult Calculate([FromBody] CommissionCalculationRequest calculationRequest)
        {
            var localCommission = calculationRequest.LocalSalesCount *
                                 calculationRequest.AverageSaleAmount *
                                 0.2m;

            var foreignCommission = calculationRequest.ForeignSalesCount *
                                   calculationRequest.AverageSaleAmount *
                                   0.35m;

            var avalphaTechnologiesTotal = localCommission + foreignCommission;

            var competitorLocal = calculationRequest.LocalSalesCount *
                                 calculationRequest.AverageSaleAmount *
                                 0.02m;

            var competitorForeign = calculationRequest.ForeignSalesCount *
                                   calculationRequest.AverageSaleAmount *
                                   0.0755m;

            var competitorTotal = competitorLocal + competitorForeign;
            return Ok(new CommissionCalculationResponse() {
                AvalphaTechnologiesCommissionAmount = avalphaTechnologiesTotal,
                CompetitorCommissionAmount = competitorTotal
            });
        }
    }

    public class CommissionCalculationRequest
    {
        public int LocalSalesCount { get; set; }
        public int ForeignSalesCount { get; set; }
        public decimal AverageSaleAmount { get; set; }
    }

    public class CommissionCalculationResponse
    {
        public decimal AvalphaTechnologiesCommissionAmount { get; set; }

        public decimal CompetitorCommissionAmount { get; set; }
    }
}

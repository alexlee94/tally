using Microsoft.AspNetCore.Mvc;
using Tally.API.DTOs;
using Tally.API.Services;

namespace Tally.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        // ── Get All ───────────────────────────────────────────────────────────

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        // ── Get Low Stock ─────────────────────────────────────────────────────

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock()
        {
            var products = await _productService.GetLowStockAsync();
            return Ok(products);
        }

        // ── Get By Id ─────────────────────────────────────────────────────────

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // ── Create ────────────────────────────────────────────────────────────

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateProductDTO dto,
            [FromHeader(Name = "X-Changed-By")] string changedBy = "system")
        {
            var product = await _productService.CreateAsync(dto, changedBy);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        // ── Update ────────────────────────────────────────────────────────────

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateProductDTO dto,
            [FromHeader(Name = "X-Changed-By")] string changedBy = "system")
        {
            try
            {
                var product = await _productService.UpdateAsync(id, dto, changedBy);
                if (product == null) return NotFound();
                return Ok(product);
            }
            catch (Exception ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // ── Delete ────────────────────────────────────────────────────────────

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            int id,
            [FromHeader(Name = "X-Changed-By")] string changedBy = "system")
        {
            var deleted = await _productService.DeleteAsync(id, changedBy);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}

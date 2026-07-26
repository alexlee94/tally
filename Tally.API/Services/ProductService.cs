using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Tally.API.Data;
using Tally.API.DTOs;
using Tally.API.Models;

namespace Tally.API.Services
{
    public class ProductService
    {
        private readonly TallyDbContext _context;

        public ProductService(TallyDbContext context)
        {
            _context = context;
        }

        // ── Get All ───────────────────────────────────────────────────────────

        public async Task<List<ProductResponseDTO>> GetAllAsync()
        {
            return await _context.Products
                .Select(p => ToDTO(p))
                .ToListAsync();
        }

        // ── Get Low Stock ─────────────────────────────────────────────────────

        public async Task<List<ProductResponseDTO>> GetLowStockAsync()
        {
            return await _context.Products
                .Where(p => p.Quantity <= p.LowStockThreshold)
                .Select(p => ToDTO(p))
                .ToListAsync();
        }

        // ── Get By Id ─────────────────────────────────────────────────────────

        public async Task<ProductResponseDTO?> GetByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            return product == null ? null : ToDTO(product);
        }

        // ── Create ────────────────────────────────────────────────────────────

        public async Task<ProductResponseDTO> CreateAsync(CreateProductDTO dto, string changedBy)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                SKU = dto.SKU,
                Quantity = dto.Quantity,
                LowStockThreshold = dto.LowStockThreshold,
                Price = dto.Price,
                Category = dto.Category
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            await LogAudit("Product", product.Id, "CREATE", null,
                JsonSerializer.Serialize(ToDTO(product)), changedBy);

            return ToDTO(product);
        }

        // ── Update ────────────────────────────────────────────────────────────

        public async Task<ProductResponseDTO?> UpdateAsync(int id, UpdateProductDTO dto, string changedBy)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            var oldValue = JsonSerializer.Serialize(ToDTO(product));

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.SKU = dto.SKU;
            product.Quantity = dto.Quantity;
            product.LowStockThreshold = dto.LowStockThreshold;
            product.Price = dto.Price;
            product.Category = dto.Category;
            product.UpdatedAt = DateTime.UtcNow;

            // Set the RowVersion for optimistic concurrency check
            _context.Entry(product).Property(p => p.RowVersion).OriginalValue = dto.RowVersion;

            try
            {
                await _context.SaveChangesAsync();
                await LogAudit("Product", product.Id, "UPDATE", oldValue,
                    JsonSerializer.Serialize(ToDTO(product)), changedBy);
                return ToDTO(product);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new Exception("The product was modified by another user. Please refresh and try again.");
            }
        }

        // ── Delete ────────────────────────────────────────────────────────────

        public async Task<bool> DeleteAsync(int id, string changedBy)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            var oldValue = JsonSerializer.Serialize(ToDTO(product));

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            await LogAudit("Product", id, "DELETE", oldValue, null, changedBy);
            return true;
        }

        // ── Audit Log ─────────────────────────────────────────────────────────

        private async Task LogAudit(string entityName, int entityId, string action,
            string? oldValue, string? newValue, string changedBy)
        {
            _context.AuditLogs.Add(new AuditLog
            {
                EntityName = entityName,
                EntityId = entityId,
                Action = action,
                OldValue = oldValue,
                NewValue = newValue,
                ChangedBy = changedBy,
                ChangedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        // ── Mapper ────────────────────────────────────────────────────────────

        private static ProductResponseDTO ToDTO(Product p) => new()
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            SKU = p.SKU,
            Quantity = p.Quantity,
            LowStockThreshold = p.LowStockThreshold,
            Price = p.Price,
            Category = p.Category,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
            RowVersion = p.RowVersion
        };
    }
}

namespace Tally.API.DTOs
{
    public class CreateProductDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? SKU { get; set; }
        public int Quantity { get; set; }
        public int LowStockThreshold { get; set; } = 10;
        public decimal Price { get; set; }
        public string? Category { get; set; }
    }

    public class UpdateProductDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? SKU { get; set; }
        public int Quantity { get; set; }
        public int LowStockThreshold { get; set; } = 10;
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
    }

    public class ProductResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? SKU { get; set; }
        public int Quantity { get; set; }
        public int LowStockThreshold { get; set; }
        public bool IsLowStock => Quantity <= LowStockThreshold;
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
    }
}

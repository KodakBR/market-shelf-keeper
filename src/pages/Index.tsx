import { useState, useEffect } from "react";
import { ProductForm } from "@/components/ProductForm";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface Product {
  id: string;
  name: string;
  expiryDate: Date;
  quantity: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      return JSON.parse(saved, (key, value) => {
        if (key === "expiryDate") return new Date(value);
        return value;
      });
    }
    return [];
  });
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: uuidv4() };
    setProducts((prev) => [...prev, newProduct]);
    toast({
      title: "Produto adicionado",
      description: "O produto foi adicionado com sucesso!",
    });
  };

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso!",
    });
  };

  const sortedProducts = [...products].sort((a, b) =>
    new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <div className="min-h-screen bg-product-background">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Controle de Validade
          </h1>
          <p className="text-gray-600">
            Gerencie os produtos do seu estabelecimento de forma simples e eficiente
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <ProductForm onSubmit={handleAddProduct} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRemove={handleRemoveProduct}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum produto cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
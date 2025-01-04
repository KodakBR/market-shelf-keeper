import { useState, useEffect } from "react";
import { ProductForm } from "@/components/ProductForm";
import { ProductCard } from "@/components/ProductCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/components/ui/use-toast";
import { ThemeProvider } from "next-themes";
import { v4 as uuidv4 } from "uuid";

interface Product {
  id: string;
  name: string;
  expiryDate: Date;
  quantity: number;
  photo?: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data.map((product: any) => ({
        ...product,
        expiryDate: new Date(product.expiryDate)
      })));
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddProduct = async (product: Omit<Product, "id">) => {
    try {
      const newProduct = { ...product, id: uuidv4() };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        await fetchProducts();
        toast({
          title: "Produto adicionado",
          description: "O produto foi adicionado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto.",
      });
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`${API_URL}/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        await fetchProducts();
        setEditingProduct(null);
        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto.",
      });
    }
  };

  const handleRemoveProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProducts();
        toast({
          title: "Produto removido",
          description: "O produto foi removido com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto.",
      });
    }
  };

  const sortedProducts = [...products].sort((a, b) =>
    new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen bg-background">
        <ThemeToggle />
        <div className="container py-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Controle de Validade
            </h1>
            <p className="text-muted-foreground">
              Gerencie os produtos do seu estabelecimento de forma simples e eficiente
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-6">
            <ProductForm 
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              initialProduct={editingProduct}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRemove={handleRemoveProduct}
                onEdit={() => setEditingProduct(product)}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;

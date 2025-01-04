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

const STORAGE_KEY = "products_v1";
const SYNC_INTERVAL = 5000; // 5 segundos

const Index = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved, (key, value) => {
        if (key === "expiryDate") return new Date(value);
        return value;
      });
    }
    return [];
  });
  
  const { toast } = useToast();

  // Função para carregar produtos do localStorage
  const loadProducts = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedProducts = JSON.parse(saved, (key, value) => {
        if (key === "expiryDate") return new Date(value);
        return value;
      });
      setProducts(parsedProducts);
    }
  };

  // Efeito para salvar produtos no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // Efeito para sincronizar produtos periodicamente
  useEffect(() => {
    const syncInterval = setInterval(() => {
      loadProducts();
    }, SYNC_INTERVAL);

    // Adicionar listener para storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchProductsFromAPI, 
  fetchBackupFromAPI, 
  createBackup 
} from '@/services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      console.log('Tentando carregar produtos...');
      const data = await fetchProductsFromAPI();
      
      const formattedProducts = data.map((product: any) => ({
        ...product,
        expiryDate: new Date(product.expiryDate)
      }));
      
      setProducts(formattedProducts);
      
      // Criar backup após carregar com sucesso
      await createBackup(formattedProducts);
      console.log('Backup criado com sucesso');
      
    } catch (error) {
      console.error("Erro ao carregar produtos, tentando backup...");
      
      try {
        const backupData = await fetchBackupFromAPI();
        const formattedBackup = backupData.map((product: any) => ({
          ...product,
          expiryDate: new Date(product.expiryDate)
        }));
        
        setProducts(formattedBackup);
        console.log('Dados restaurados do backup');
        
        toast({
          title: "Dados restaurados",
          description: "Os dados foram restaurados do backup com sucesso!",
        });
        
      } catch (backupError) {
        console.error("Erro ao carregar backup:", backupError);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados nem do backup.",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  return { products, setProducts, fetchProducts };
};
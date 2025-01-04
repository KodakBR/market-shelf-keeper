import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Image } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Product {
  id: string;
  name: string;
  expiryDate: Date;
  quantity: number;
  photo?: string;
}

interface ProductCardProps {
  product: Product;
  onRemove: (id: string) => void;
  onEdit: () => void;
  onImageClick: () => void;
}

export const ProductCard = ({ product, onRemove, onEdit, onImageClick }: ProductCardProps) => {
  const isExpired = new Date(product.expiryDate) < new Date();

  return (
    <Card className={`overflow-hidden ${isExpired ? 'border-red-500' : ''}`}>
      {product.photo && (
        <div 
          className="relative w-full aspect-video cursor-pointer"
          onClick={onImageClick}
        >
          <img
            src={product.photo}
            alt={product.name}
            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
          />
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className={`text-sm ${isExpired ? 'text-red-500' : 'text-muted-foreground'}`}>
          Validade: {format(new Date(product.expiryDate), "PPP", { locale: ptBR })}
        </p>
        <p className="text-sm text-muted-foreground">
          Quantidade: {product.quantity}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onRemove(product.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
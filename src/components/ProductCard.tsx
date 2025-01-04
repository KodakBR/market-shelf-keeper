import { format, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  expiryDate: Date;
  quantity: number;
}

interface ProductCardProps {
  product: Product;
  onRemove: (id: string) => void;
}

export const ProductCard = ({ product, onRemove }: ProductCardProps) => {
  const today = new Date();
  const warningDate = addDays(today, 30);
  const isExpired = isBefore(new Date(product.expiryDate), today);
  const isWarning =
    isAfter(new Date(product.expiryDate), today) &&
    isBefore(new Date(product.expiryDate), warningDate);

  return (
    <div
      className={cn(
        "p-4 rounded-lg shadow-sm border transition-all duration-200 animate-slide-up",
        "hover:shadow-md",
        isExpired
          ? "bg-red-50 border-product-expired"
          : isWarning
          ? "bg-amber-50 border-product-warning"
          : "bg-green-50 border-product-valid"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600">
            Validade: {format(new Date(product.expiryDate), "PPP", { locale: ptBR })}
          </p>
          <p className="text-sm text-gray-600">Quantidade: {product.quantity}</p>
        </div>
        <div className="flex items-center space-x-2">
          {isExpired ? (
            <XCircle className="h-5 w-5 text-product-expired" />
          ) : isWarning ? (
            <AlertTriangle className="h-5 w-5 text-product-warning" />
          ) : (
            <CheckCircle className="h-5 w-5 text-product-valid" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(product.id)}
            className="text-gray-500 hover:text-gray-700"
          >
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
};
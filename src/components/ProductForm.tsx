import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  onSubmit: (product: {
    name: string;
    expiryDate: Date;
    quantity: number;
  }) => void;
}

export const ProductForm = ({ onSubmit }: ProductFormProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>();
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !quantity) return;

    onSubmit({
      name,
      expiryDate: date,
      quantity: Number(quantity),
    });

    setName("");
    setDate(undefined);
    setQuantity("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-4">
        <Input
          placeholder="Nome do produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="md:col-span-2"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP", { locale: ptBR })
              ) : (
                <span>Data de validade</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="number"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
        />
      </div>
      <Button type="submit" className="w-full md:w-auto">
        Adicionar Produto
      </Button>
    </form>
  );
};
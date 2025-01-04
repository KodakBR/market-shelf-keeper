import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Camera, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  expiryDate: Date;
  quantity: number;
  photo?: string;
}

interface ProductFormProps {
  onSubmit: (product: Product | Omit<Product, "id">) => void;
  initialProduct?: Product | null;
}

export const ProductForm = ({ onSubmit, initialProduct }: ProductFormProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>();
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setDate(new Date(initialProduct.expiryDate));
      setQuantity(initialProduct.quantity.toString());
      setPhoto(initialProduct.photo || null);
    }
  }, [initialProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !quantity) return;

    const productData = {
      name,
      expiryDate: date,
      quantity: Number(quantity),
      photo: photo || undefined,
    };

    if (initialProduct) {
      onSubmit({ ...productData, id: initialProduct.id });
    } else {
      onSubmit(productData);
    }

    if (!initialProduct) {
      setName("");
      setDate(undefined);
      setQuantity("");
      setPhoto(null);
    }
  };

  const handlePhotoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      
      const photoData = canvas.toDataURL("image/jpeg");
      setPhoto(photoData);
      
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
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
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={handlePhotoCapture}>
          <Camera className="mr-2 h-4 w-4" />
          Tirar Foto
        </Button>
        {photo && (
          <Button
            type="button"
            variant="outline"
            onClick={() => window.open(photo, '_blank')}
          >
            <Image className="mr-2 h-4 w-4" />
            Ver Foto
          </Button>
        )}
      </div>
      <Button type="submit" className="w-full md:w-auto">
        {initialProduct ? "Atualizar Produto" : "Adicionar Produto"}
      </Button>
    </form>
  );
};
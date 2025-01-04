import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image } from "lucide-react";

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
}

export const ImageViewModal = ({ isOpen, onClose, imageUrl }: ImageViewModalProps) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Visualização da Imagem
          </DialogTitle>
        </DialogHeader>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Produto"
            className="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
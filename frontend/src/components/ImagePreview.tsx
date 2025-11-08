import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export const ImagePreview = ({ file, onRemove }: ImagePreviewProps) => {
  const imageUrl = URL.createObjectURL(file);
  const fileSizeKB = (file.size / 1024).toFixed(2);

  return (
    <div className="relative inline-block">
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-[200px] max-h-[200px] object-cover"
          onLoad={() => URL.revokeObjectURL(imageUrl)} // Clean up object URL
        />
        <Button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white"
          title="Remove image"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-1 text-xs text-gray-500 text-center">
        <div className="truncate max-w-[200px]">{file.name}</div>
        <div>{fileSizeKB} KB</div>
      </div>
    </div>
  );
};

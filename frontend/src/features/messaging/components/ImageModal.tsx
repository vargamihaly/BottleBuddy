import {Download, X} from "lucide-react";
import {Button} from "@/shared/ui/button";
import {useEffect} from "react";

interface ImageModalProps {
    imageUrl: string;
    imageFileName?: string;
    onClose: () => void;
}

export const ImageModal = ({imageUrl, imageFileName, onClose}: ImageModalProps) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = imageFileName || "image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="relative max-w-7xl max-h-full">
                {/* Close button */}
                <Button
                    onClick={onClose}
                    className="absolute -top-12 right-0 h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white border-none"
                    title="Close (Esc)"
                >
                    <X className="h-6 w-6"/>
                </Button>

                {/* Download button */}
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                    }}
                    className="absolute -top-12 right-14 h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white border-none"
                    title="Download image"
                >
                    <Download className="h-5 w-5"/>
                </Button>

                {/* Image */}
                <img
                    src={imageUrl}
                    alt={imageFileName || "Full size image"}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />

                {/* File name */}
                {imageFileName && (
                    <div className="absolute -bottom-8 left-0 right-0 text-center text-white text-sm">
                        {imageFileName}
                    </div>
                )}
            </div>
        </div>
    );
};

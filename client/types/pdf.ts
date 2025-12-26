export interface Pdf {
    id: string;
    fileName: string;
    createdAt: string | null;
    htmlContent?: string | null;
}

export interface PdfListProps {
    limit?: number;
    showDelete?: boolean;
    showViewMore?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyActionText?: string;
    emptyActionPath?: string;
    className?: string;
}

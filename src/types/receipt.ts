// Formato do backend (OpenAPI)
export interface ReceiptDTO {
  id: string;
  transactionId: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  uploadedAt: string;
}

// Formato usado pela UI
export interface Receipt {
  id: string;
  transactionId: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
}

export interface ReceiptUploadRequest {
  transactionId: string;
  file: File;
}

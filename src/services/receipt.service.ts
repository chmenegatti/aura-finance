import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type { Receipt, ReceiptDTO, ReceiptUploadRequest } from "@/types/receipt";

function mapReceipt(dto: ReceiptDTO): Receipt {
  return {
    id: dto.id,
    transactionId: dto.transactionId,
    fileName: dto.fileName,
    mimeType: dto.mimeType,
    uploadedAt: dto.uploadedAt,
  };
}

export const receiptService = {
  async upload(payload: ReceiptUploadRequest): Promise<Receipt> {
    const form = new FormData();
    form.append("file", payload.file);

    const { data } = await api.post<ApiResponseSuccess<ReceiptDTO>>(
      `/transactions/${payload.transactionId}/receipt`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return mapReceipt(data.data);
  },

  async download(id: string): Promise<Blob> {
    const { data } = await api.get(`/receipts/${id}`, {
      responseType: "blob",
    });
    return data as Blob;
  },
};

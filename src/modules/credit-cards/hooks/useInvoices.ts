import { useQuery } from "@tanstack/react-query";

import { creditCardsService } from "../services/creditCardsService";

export function useCreditCardInvoice(cardId?: string, month?: string) {
  return useQuery({
    queryKey: ["credit-card-invoice", cardId, month],
    queryFn: () => creditCardsService.getInvoice(cardId ?? "", month ?? ""),
    enabled: Boolean(cardId && month),
    staleTime: 1000 * 60,
  });
}

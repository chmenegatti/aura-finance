import { useQuery } from "@tanstack/react-query";

import { creditCardsService } from "../services/creditCardsService";

export function useCreditCards() {
  return useQuery({
    queryKey: ["credit-cards"],
    queryFn: () => creditCardsService.list(),
  });
}

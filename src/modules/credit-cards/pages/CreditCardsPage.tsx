import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import type { ApiError } from "@/types/api";

import { CreditCardCarousel } from "../components/CreditCardCarousel";
import { InvoiceSummary } from "../components/InvoiceSummary";
import { useCreditCardInvoice } from "../hooks/useInvoices";
import { useCreditCards } from "../hooks/useCreditCards";

const getCurrentMonth = () => format(new Date(), "yyyy-MM");

export default function CreditCardsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: cards = [], isLoading, error } = useCreditCards();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const month = useMemo(getCurrentMonth, []);
  const invoiceQuery = useCreditCardInvoice(activeCardId ?? undefined, month);

  useEffect(() => {
    if (cards.length > 0 && !activeCardId) {
      setActiveCardId(cards[0].id);
    }
  }, [cards, activeCardId]);

  useEffect(() => {
    if (error) {
      const apiError = error as ApiError;
      toast({
        title: "Não foi possível carregar os cartões",
        description: apiError.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (invoiceQuery.error) {
      const apiError = invoiceQuery.error as ApiError;
      toast({
        title: "Erro ao carregar a fatura",
        description: apiError.message,
        variant: "destructive",
      });
    }
  }, [invoiceQuery.error, toast]);

  const activeCard = cards.find((card) => card.id === activeCardId);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cartões de crédito</h1>
            <p className="text-sm text-muted-foreground">Acompanhe suas faturas e controle os lançamentos.</p>
          </div>
          <Button
            variant="income"
            disabled={!activeCardId}
            onClick={() => {
              if (activeCardId) {
                navigate(`/credit-cards/${activeCardId}`);
              }
            }}
          >
            Ver detalhes
          </Button>
        </div>

        <CreditCardCarousel
          cards={cards}
          isLoading={isLoading}
          invoice={invoiceQuery.data}
          activeCardId={activeCardId ?? undefined}
          onCardSelect={(cardId) => setActiveCardId(cardId)}
        />

        {activeCard && (
          <InvoiceSummary card={activeCard} invoice={invoiceQuery.data} isLoading={invoiceQuery.isLoading} />
        )}
      </div>
    </MainLayout>
  );
}

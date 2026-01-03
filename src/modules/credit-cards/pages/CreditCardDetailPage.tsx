import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import type { ApiError } from "@/types/api";

import { creditCardsService } from "../services/creditCardsService";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { InvoiceSummary } from "../components/InvoiceSummary";
import { useCreditCardInvoice } from "../hooks/useInvoices";
import type { CreditCardExpense } from "../types/credit-card";

const formatInvoiceMonth = (date: Date) => format(date, "yyyy-MM");

export default function CreditCardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  //const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<CreditCardExpense | null>(null);
  const cardId = id ?? "";
  const month = useMemo(() => formatInvoiceMonth(new Date()), []);

  const cardQuery = useQuery({
    queryKey: ["credit-card", cardId],
    queryFn: () => creditCardsService.getById(cardId),
    enabled: Boolean(cardId),
  });

  const invoiceQuery = useCreditCardInvoice(cardId, month);

  const invoice = invoiceQuery.data;
  const isInvoiceClosed = invoice?.isClosed ?? false;

  const handleEdit = (expense: CreditCardExpense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleRemove = async (expense: CreditCardExpense, scope: "single" | "group") => {
    try {
      await creditCardsService.removeExpense(cardId, expense.id, scope);
      toast({
        title: "Despesa removida",
        description: "O lançamento foi eliminado da fatura.",
      });
      invoiceQuery.refetch();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao remover",
        description: apiError.message,
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    invoiceQuery.refetch();
  };

  useEffect(() => {
    if (cardQuery.error) {
      const apiError = cardQuery.error as ApiError;
      toast({
        title: "Não foi possível carregar o cartão",
        description: apiError.message,
        variant: "destructive",
      });
    }
  }, [cardQuery.error, toast]);

  if (!cardId) {
    navigate("/credit-cards");
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fatura do cartão</h1>
            <p className="text-sm text-muted-foreground">Controle a fatura atual e os lançamentos.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/credit-cards")}>Voltar</Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="income"
                    onClick={() => {
                      setEditingExpense(null);
                      setIsFormOpen(true);
                    }}
                    disabled={isInvoiceClosed}
                  >
                    Adicionar despesa
                  </Button>
                </TooltipTrigger>
                {isInvoiceClosed && (
                  <TooltipContent>
                    Fatura fechada. Não é possível adicionar novas despesas.
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <ExpenseForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          cardId={cardId}
          invoiceMonth={month}
          editingExpense={editingExpense}
          disabled={isInvoiceClosed}
          onSuccess={handleSuccess}
        />

        <InvoiceSummary
          card={cardQuery.data}
          invoice={invoice}
          isLoading={invoiceQuery.isLoading || cardQuery.isLoading}
        />

        <ExpenseList
          expenses={invoice?.expenses ?? []}
          isLoading={invoiceQuery.isLoading}
          isInvoiceClosed={isInvoiceClosed}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      </div>
    </MainLayout>
  );
}

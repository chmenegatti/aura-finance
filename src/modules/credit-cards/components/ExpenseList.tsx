import { formatFullDate, formatCurrency } from "@/lib/finance";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pencil, Trash2 } from "lucide-react";

import type { CreditCardExpense, CreditCardExpenseScope } from "../types/credit-card";

interface ExpenseListProps {
  expenses: CreditCardExpense[];
  isLoading?: boolean;
  isInvoiceClosed?: boolean;
  onEdit: (expense: CreditCardExpense) => void;
  onRemove: (expense: CreditCardExpense, scope: CreditCardExpenseScope) => void;
}

export function ExpenseList({
  expenses,
  isLoading,
  isInvoiceClosed,
  onEdit,
  onRemove,
}: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="grid w-full gap-4">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        <p className="text-base font-semibold text-foreground">Sem despesas registradas</p>
        <p>Adicione a primeira despesa para começar a preencher a fatura.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className={cn(
            "flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm",
            "md:flex-row md:items-center md:justify-between",
          )}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{expense.description}</h3>
              <Badge variant="outline">
                {expense.currentInstallment}/{expense.installments}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{formatFullDate(expense.purchaseDate)}</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="text-2xl font-semibold text-foreground">{formatCurrency(expense.amount)}</p>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isInvoiceClosed}
                      onClick={() => onEdit(expense)}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                  </TooltipTrigger>
                  {isInvoiceClosed && (
                    <TooltipContent>
                      Fatura fechada. Não é possível alterar esta despesa.
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              {isInvoiceClosed ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button size="sm" variant="destructive" disabled>
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Fatura fechada. Não é possível alterar esta despesa.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                      Remover
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover despesa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Escolha se deseja remover somente esta parcela ou todo o grupo de parcelamento.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onRemove(expense, "single")}
                        className="flex-1"
                      >
                        Excluir esta parcela
                      </AlertDialogAction>
                      {expense.installments > 1 && (
                        <AlertDialogAction
                          onClick={() => onRemove(expense, "group")}
                          className="flex-1"
                        >
                          Excluir todas as parcelas
                        </AlertDialogAction>
                      )}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

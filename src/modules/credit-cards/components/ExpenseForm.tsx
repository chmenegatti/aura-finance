import * as React from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { creditCardsService } from "../services/creditCardsService";
import type {
  CreditCardExpense,
  CreditCardExpenseScope,
  CreateCreditCardExpenseRequest,
  UpdateCreditCardExpenseRequest,
} from "../types/credit-card";
import type { ApiError } from "@/types/api";

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string;
  invoiceMonth: string;
  onSuccess?: () => void;
  editingExpense?: CreditCardExpense | null;
  disabled?: boolean;
}

export function ExpenseForm({
  open,
  onOpenChange,
  cardId,
  invoiceMonth,
  onSuccess,
  editingExpense,
  disabled,
}: ExpenseFormProps) {
  const { toast } = useToast();
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [purchaseDate, setPurchaseDate] = React.useState(format(new Date(), "yyyy-MM-dd"));
  const [isParcelado, setIsParcelado] = React.useState(false);
  const [installments, setInstallments] = React.useState(1);
  const [scope, setScope] = React.useState<CreditCardExpenseScope>("single");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditing = Boolean(editingExpense);

  React.useEffect(() => {
    if (!open) {
      setDescription("");
      setAmount("");
      setPurchaseDate(format(new Date(), "yyyy-MM-dd"));
      setIsParcelado(false);
      setInstallments(1);
      setScope("single");
      return;
    }

    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toFixed(2));
      setPurchaseDate(format(editingExpense.purchaseDate, "yyyy-MM-dd"));
      setIsParcelado(editingExpense.installments > 1);
      setInstallments(editingExpense.installments);
      setScope("single");
    } else {
      setDescription("");
      setAmount("");
      setIsParcelado(false);
      setInstallments(1);
      setScope("single");
    }
  }, [editingExpense, open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!description || !amount || !purchaseDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a descrição, valor e data da compra.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && editingExpense) {
        const updatePayload: UpdateCreditCardExpenseRequest = {
          description,
          amount: parseFloat(amount),
        };
        await creditCardsService.updateExpense(cardId, editingExpense.id, updatePayload, scope);
        toast({
          title: "Despesa atualizada",
          description: "A alteração foi salva com sucesso.",
        });
      } else {
        const createPayload: CreateCreditCardExpenseRequest = {
          description,
          amount: parseFloat(amount),
          purchaseDate,
        };
        if (isParcelado) {
          createPayload.installments = Math.max(installments, 1);
        }
        await creditCardsService.createExpense(cardId, createPayload);
        toast({
          title: "Despesa registrada",
          description: "A despesa foi adicionada à fatura atual.",
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: isEditing ? "Erro ao atualizar" : "Erro ao salvar",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar despesa" : "Nova despesa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-1">
            <Label htmlFor="expense-description">Descrição</Label>
            <Input
              id="expense-description"
              placeholder="Ex: Compra no supermercado"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="expense-amount">Valor (R$)</Label>
            <Input
              id="expense-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="expense-date">Data da compra</Label>
            <Input
              id="expense-date"
              type="date"
              value={purchaseDate}
              onChange={(event) => setPurchaseDate(event.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="expense-installments">Parcelado?</Label>
            <Switch
              id="expense-installments"
              checked={isParcelado}
              onCheckedChange={(value) => setIsParcelado(Boolean(value))}
            />
          </div>
          {isParcelado && (
            <div className="space-y-1">
              <Label htmlFor="installments">Número de parcelas</Label>
              <Input
                id="installments"
                type="number"
                min="1"
                value={installments}
                onChange={(event) =>
                  setInstallments(Math.max(1, Number(event.target.value) || 1))
                }
              />
            </div>
          )}
          {isEditing && editingExpense?.installments > 1 && (
            <div className="space-y-1">
              <Label>Aplicar alteração em</Label>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: "single", label: "Apenas esta parcela" },
                  { value: "group", label: "Todas as parcelas" },
                ] as const).map((option) => (
                  <Button
                    key={option.value}
                    variant={scope === option.value ? "income" : "outline"}
                    size="sm"
                    type="button"
                    onClick={() => setScope(option.value as CreditCardExpenseScope)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant={disabled ? "outline" : "income"}
              type="submit"
              disabled={isSubmitting || disabled}
            >
              {isEditing ? "Atualizar despesa" : "Adicionar despesa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

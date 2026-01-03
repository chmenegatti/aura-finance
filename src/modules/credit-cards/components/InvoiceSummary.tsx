import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/finance";
import { cn } from "@/lib/utils";

import type { CreditCard, CreditCardInvoice } from "../types/credit-card";

interface InvoiceSummaryProps {
  card?: CreditCard;
  invoice?: CreditCardInvoice;
  isLoading?: boolean;
}

export function InvoiceSummary({ card, invoice, isLoading }: InvoiceSummaryProps) {
  if (isLoading) {
    return <Skeleton className="h-40 rounded-3xl" />;
  }

  const total = invoice?.total ?? 0;
  const statusLabel = invoice?.isClosed ? "Fechada" : "Aberta";
  const statusVariant = invoice?.isClosed ? "destructive" : "default";

  const monthLabel = invoice?.invoiceMonth
    ? format(new Date(`${invoice.invoiceMonth}-01`), "MMMM yyyy", { locale: ptBR })
    : "Mês atual";

  return (
    <Card className="rounded-[30px] border border-border/40">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">Fatura atual</CardTitle>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{monthLabel}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Total</p>
          <p className="text-3xl font-semibold text-foreground">{formatCurrency(total)}</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-2xl bg-muted/60 p-4 text-sm text-foreground">
            <p className="text-xs uppercase text-muted-foreground">Fechamento</p>
            <p className="text-xl font-semibold">{invoice?.closingDay ?? card?.closingDay ?? "--"}º dia</p>
          </div>
          <div className="rounded-2xl bg-muted/60 p-4 text-sm text-foreground">
            <p className="text-xs uppercase text-muted-foreground">Vencimento</p>
            <p className="text-xl font-semibold">{card?.dueDay ?? "--"}º dia</p>
          </div>
        </div>
        {invoice && (
          <p className="text-sm text-muted-foreground">
            {invoice.expenses.length} despesa{invoice.expenses.length === 1 ? "" : "s"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

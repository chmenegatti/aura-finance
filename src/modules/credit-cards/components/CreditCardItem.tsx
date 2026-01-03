import { formatCurrency } from "@/lib/finance";
import { cn } from "@/lib/utils";
import type { CreditCard, CreditCardInvoice } from "../types/credit-card";

const CARD_COLORS: Record<string, string> = {
  nubank: "#820ad1",
  itau_black: "#040809",
  itau: "#ff7200",
  inter: "#ff7a00",
  bradesco: "#cc092f",
  santander: "#ec0000",
  c6: "#1c1c1c",
  default: "#2d2d2d",
};

const getCardColor = (brand: string, name: string) => {
  const key = brand.toLowerCase().replace(/\s+/g, "_");
  if (CARD_COLORS[key]) {
    return CARD_COLORS[key];
  }

  const nameKey = name.toLowerCase().replace(/\s+/g, "_");
  return CARD_COLORS[nameKey] ?? CARD_COLORS.default;
};

interface CreditCardItemProps {
  card: CreditCard;
  invoice?: CreditCardInvoice;
  isActive?: boolean;
  onSelect?: (cardId: string) => void;
}

export function CreditCardItem({ card, invoice, isActive, onSelect }: CreditCardItemProps) {
  const color = getCardColor(card.brand, card.name);
  const spent = invoice?.total ?? 0;
  const available = Math.max(0, card.creditLimit - spent);
  const utilization = card.creditLimit > 0 ? Math.min(1, spent / card.creditLimit) : 0;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect?.(card.id)}
      className={cn(
        "relative flex h-64 w-full flex-col rounded-3xl p-6 text-white shadow-soft-lg transition-transform duration-200",
        isActive ? "scale-105 shadow-soft-xl" : "hover:-translate-y-0.5",
      )}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc 55%, rgba(255,255,255,0.08))`,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-white/80">{card.brand}</p>
          <p className="text-2xl font-semibold">{card.name}</p>
        </div>
        <span className="text-sm font-medium text-white/80">**** {card.lastFourDigits}</span>
      </div>

      <div className="mt-auto space-y-2">
        <div className="text-xs uppercase tracking-wider text-white/70">Limite total</div>
        <p className="text-xl font-semibold">{formatCurrency(card.creditLimit)}</p>
        <div className="flex items-center justify-between text-sm text-white/80">
          <span>Disponível</span>
          <span>{formatCurrency(available)}</span>
        </div>
        <div className="h-1 rounded-full bg-white/30">
          <div className="h-full rounded-full bg-white" style={{ width: `${utilization * 100}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Fechamento</span>
          <span>{card.closingDay}º</span>
        </div>
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Vencimento</span>
          <span>{card.dueDay}º</span>
        </div>
      </div>
    </button>
  );
}

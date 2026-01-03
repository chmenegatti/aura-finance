import { useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { CreditCard, CreditCardInvoice } from "../types/credit-card";
import { CreditCardItem } from "./CreditCardItem";

interface CreditCardCarouselProps {
  cards: CreditCard[];
  activeCardId?: string;
  invoice?: CreditCardInvoice;
  isLoading?: boolean;
  onCardSelect?: (cardId: string) => void;
}

export function CreditCardCarousel({
  cards,
  activeCardId,
  invoice,
  isLoading,
  onCardSelect,
}: CreditCardCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3].map((skeleton) => (
          <Skeleton key={skeleton} className="h-60 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Você ainda não possui cartões cadastrados.</p>
        <p>Assim que houver faturas, elas aparecerão neste carrossel.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        className="pb-4"
        setApi={setCarouselApi}
        opts={{ loop: false }}
      >
        <CarouselContent className="flex gap-6">
          {cards.map((card) => (
            <CarouselItem key={card.id} className="w-full max-w-lg flex-[0_0_75%]">
              <CreditCardItem
                card={card}
                invoice={card.id === activeCardId ? invoice : undefined}
                isActive={card.id === activeCardId}
                onSelect={onCardSelect}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <CarouselPrevious
        className={cn("hidden sm:flex", "left-2", "shadow-soft", { "opacity-40": !carouselApi?.canScrollPrev() })}
        disabled={!carouselApi?.canScrollPrev()}
      />
      <CarouselNext
        className={cn("hidden sm:flex", "right-2", "shadow-soft", { "opacity-40": !carouselApi?.canScrollNext() })}
        disabled={!carouselApi?.canScrollNext()}
      />
    </div>
  );
}

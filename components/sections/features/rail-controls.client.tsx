"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RailControls() {
  const scrollContainer = useRef<HTMLElement | null>(null);

  const scroll = (direction: "prev" | "next") => {
    if (!scrollContainer.current) {
      scrollContainer.current = document.getElementById(
        "features-rail"
      ) as HTMLElement;
    }

    if (scrollContainer.current) {
      const scrollAmount =
        scrollContainer.current.clientWidth *
        0.9 *
        (direction === "next" ? 1 : -1);
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-8 flex justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("prev")}
        aria-label="Previous feature"
        className="h-10 w-10 rounded-full"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("next")}
        aria-label="Next feature"
        className="h-10 w-10 rounded-full"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

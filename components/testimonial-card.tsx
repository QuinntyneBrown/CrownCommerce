import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  rating: number;
  location?: string | null;
}

export function TestimonialCard({ quote, author, rating, location }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
          ))}
        </div>
        <blockquote className="flex-1 text-sm italic text-foreground/90">&ldquo;{quote}&rdquo;</blockquote>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="font-semibold text-sm">{author}</p>
          {location && <p className="text-xs text-muted-foreground">{location}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

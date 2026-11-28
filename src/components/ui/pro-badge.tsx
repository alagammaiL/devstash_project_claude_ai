import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProBadgeProps {
  className?: string;
}

export function ProBadge({ className }: ProBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-flex">
            <Badge
              aria-label="Pro Feature"
              className={`border-amber-400/40 bg-amber-400/10 text-amber-300 ${className ?? ""}`}
              variant="outline"
            >
              PRO
            </Badge>
          </span>
        }
      />
      <TooltipContent>Pro Feature</TooltipContent>
    </Tooltip>
  );
}

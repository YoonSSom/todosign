import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pages = [
  { path: "/", label: "홈" },
  { path: "/surgery-consent", label: "수술 동의서" },
];

export function PresentationNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = pages.findIndex((page) => page.path === location.pathname);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  // Don't show on NotFound page
  if (currentIndex === -1) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-full px-2 py-1.5 shadow-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => prevPage && navigate(prevPage.path)}
        disabled={!prevPage}
        className="rounded-full px-3 gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">이전</span>
      </Button>

      <div className="flex items-center gap-1.5 px-2">
        {pages.map((page, index) => (
          <button
            key={page.path}
            onClick={() => navigate(page.path)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary w-4"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            title={page.label}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => nextPage && navigate(nextPage.path)}
        disabled={!nextPage}
        className="rounded-full px-3 gap-1"
      >
        <span className="hidden sm:inline">다음</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

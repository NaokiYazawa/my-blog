"use client";

import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MermaidProps = {
  chart: string;
  className?: string;
};

export function Mermaid({ chart, className }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart?.trim()) return;

      try {
        setIsLoading(true);
        setError(null);

        // Detect dark mode
        const isDark =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Initialize mermaid with responsive theme settings
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "inherit",
          themeVariables: {
            primaryColor: isDark ? "#1f2937" : "#f8fafc",
            primaryTextColor: isDark ? "#f9fafb" : "#1f2937",
            primaryBorderColor: isDark ? "#374151" : "#d1d5db",
            lineColor: isDark ? "#6b7280" : "#374151",
            secondaryColor: isDark ? "#374151" : "#e5e7eb",
            tertiaryColor: isDark ? "#4b5563" : "#f3f4f6",
          },
        });

        // Generate unique ID for this chart
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        // Render the chart
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        setSvg(renderedSvg);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to render diagram: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950",
          className,
        )}
      >
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-red-500 dark:text-red-400">
            Show chart code
          </summary>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-red-400 dark:text-red-300">
            {chart}
          </pre>
        </details>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border p-8 bg-muted/50",
          className,
        )}
      >
        <div className="text-sm text-muted-foreground">Loading diagram...</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border bg-background p-4 shadow-sm",
        "max-w-full scroll-smooth",
        className,
      )}
    >
      <div
        ref={ref}
        className="flex justify-center min-w-fit [&>svg]:max-w-full [&>svg]:h-auto"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe usage for theme CSS generation
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

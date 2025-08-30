"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:text-foreground prose-headings:font-semibold",
        "prose-p:text-foreground prose-p:leading-relaxed prose-p:my-2",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-em:text-foreground prose-em:italic",
        "prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono",
        "prose-pre:bg-muted prose-pre:border prose-pre:rounded-md prose-pre:p-3 prose-pre:overflow-x-auto",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground",
        "prose-ul:text-foreground prose-ul:my-2 prose-li:my-1",
        "prose-ol:text-foreground prose-ol:my-2",
        "prose-a:text-primary prose-a:underline prose-a:decoration-primary/50 hover:prose-a:decoration-primary",
        "prose-hr:border-border prose-hr:my-4",
        "prose-table:text-foreground prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2",
        "prose-td:border prose-td:border-border prose-td:p-2",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom code block styling
          code: ({ children, ...props }) => {
            const codeProps = props as { className?: string };
            const isInline =
              !codeProps.className ||
              !codeProps.className.includes("language-");

            if (isInline) {
              return (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-muted border rounded-md p-3 overflow-x-auto">
                <code className="text-sm font-mono text-foreground" {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          // Custom link styling with safe target
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline decoration-primary/50 hover:decoration-primary transition-colors"
              {...props}
            >
              {children}
            </a>
          ),
          // Custom blockquote styling
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
              {...props}
            >
              {children}
            </blockquote>
          ),
          // Custom table styling
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-border bg-muted p-2 text-left font-semibold"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-border p-2" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

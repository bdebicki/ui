"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import {
  colCssVarName,
  LINKED_MEASURE_ROLES,
  type TableColumnRole,
} from "./linked-columns";

const LinkedTableContext = createContext(false);

export function useLinkedTable() {
  return useContext(LinkedTableContext);
}

type LinkedTableGroupProps = {
  children: ReactNode;
  className?: string;
  /** Roles to re-measure when content changes (defaults to numeric columns). */
  measureRoles?: TableColumnRole[];
};

export function LinkedTableGroup({
  children,
  className,
  measureRoles = LINKED_MEASURE_ROLES,
}: LinkedTableGroupProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function measure() {
      const el = rootRef.current;
      if (!el) return;

      for (const role of measureRoles) {
        const varName = colCssVarName(role);
        if (!varName) continue;

        const cells = el.querySelectorAll<HTMLElement>(`[data-col="${role}"]`);
        let max = 0;
        cells.forEach((cell) => {
          max = Math.max(max, cell.scrollWidth);
        });
        if (max > 0) {
          el.style.setProperty(varName, `${Math.ceil(max)}px`);
        }
      }
    }

    measure();

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(root);

    const mutationObserver = new MutationObserver(() => measure());
    mutationObserver.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [measureRoles]);

  return (
    <LinkedTableContext.Provider value={true}>
      <div ref={rootRef} className={cn("linked-table-group", className)}>
        {children}
      </div>
    </LinkedTableContext.Provider>
  );
}

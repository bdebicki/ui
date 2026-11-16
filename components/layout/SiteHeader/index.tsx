"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  Container,
  PageHeader,
  SavingIndicator,
  type BreadcrumbTrail,
} from "@/system";

const BREADCRUMB_ROOT = "APP";
const DOCUMENT_TITLE_SUFFIX = " — Base";

type SiteHeaderConfig = {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

type SiteHeaderContextValue = {
  override: SiteHeaderConfig | null;
  setOverride: (config: SiteHeaderConfig | null) => void;
  saving: boolean;
  setSaving: (saving: boolean) => void;
};

const SiteHeaderContext = createContext<SiteHeaderContextValue | null>(null);

const PAGE_HEADERS: Record<
  string,
  SiteHeaderConfig & { breadcrumb: BreadcrumbTrail }
> = {
  "/": {
    breadcrumb: { root: BREADCRUMB_ROOT, category: "WZORCE", segments: ["LISTA"] },
    title: "Przykładowa lista",
  },
  "/about": {
    breadcrumb: {
      root: BREADCRUMB_ROOT,
      category: "SZABLON",
      segments: ["INFORMACJE"],
    },
    title: "O szablonie",
  },
  "/settings": {
    breadcrumb: {
      root: BREADCRUMB_ROOT,
      category: "USTAWIENIA",
      segments: ["UKŁAD"],
    },
    title: "Układ strony",
  },
};

function getDefaultHeader(
  pathname: string,
): (SiteHeaderConfig & { breadcrumb: BreadcrumbTrail }) | null {
  return PAGE_HEADERS[pathname] ?? null;
}

export function SiteHeaderProvider({ children }: { children: React.ReactNode }) {
  const [override, setOverrideState] = useState<SiteHeaderConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const setOverride = useCallback((config: SiteHeaderConfig | null) => {
    setOverrideState(config);
  }, []);

  const value = useMemo(
    () => ({ override, setOverride, saving, setSaving }),
    [override, setOverride, saving],
  );

  return (
    <SiteHeaderContext.Provider value={value}>
      {children}
    </SiteHeaderContext.Provider>
  );
}

/** Overrides title/description/action in the global site header. */
export function SetSiteHeader({ title, description, action }: SiteHeaderConfig) {
  const ctx = useContext(SiteHeaderContext);
  if (!ctx) {
    throw new Error("SetSiteHeader must be used within SiteHeaderProvider");
  }

  const { setOverride } = ctx;

  useLayoutEffect(() => {
    setOverride({ title, description, action });
    return () => setOverride(null);
  }, [setOverride, title, description, action]);

  return null;
}

/** Syncs document.title with the global page header and reports save state. */
export function useSiteHeaderSaving(saving: boolean) {
  const ctx = useContext(SiteHeaderContext);
  if (!ctx) {
    throw new Error("useSiteHeaderSaving must be used within SiteHeaderProvider");
  }

  const { setSaving } = ctx;

  useLayoutEffect(() => {
    setSaving(saving);
    return () => setSaving(false);
  }, [setSaving, saving]);
}

export function SiteHeader() {
  const pathname = usePathname();
  const ctx = useContext(SiteHeaderContext);
  const defaults = getDefaultHeader(pathname);
  const override = ctx?.override;

  const config = defaults
    ? override
      ? { ...defaults, ...override, breadcrumb: defaults.breadcrumb }
      : defaults
    : null;

  const pageTitle = config?.title;

  useLayoutEffect(() => {
    if (!pageTitle) return;
    document.title = `${pageTitle}${DOCUMENT_TITLE_SUFFIX}`;
  }, [pageTitle]);

  if (!config) return null;

  return (
    <header className="border-b border-zinc-200 bg-white">
      <Container className="py-4">
        <PageHeader
          as="h1"
          className="flex-wrap"
          size="lg"
          eyebrow={<Breadcrumb trail={config.breadcrumb} />}
          title={config.title}
          description={config.description}
          action={
            <div className="flex flex-wrap items-center justify-end gap-3">
              <SavingIndicator saving={ctx?.saving ?? false} className={ctx?.saving ? undefined : "hidden sm:inline"} />
              {config.action}
            </div>
          }
        />
      </Container>
    </header>
  );
}

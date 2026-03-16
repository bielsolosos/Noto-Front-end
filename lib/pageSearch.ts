import type { PageSummaryDto } from "@/types/page";

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[,:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildPageSearchIndex(page: PageSummaryDto): string {
  const updatedAt = new Date(page.updatedAt);
  const date = updatedAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = updatedAt.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return normalizeSearchValue(`${page.title} ${date} ${time}`);
}

export function filterPageSummariesByQuery(
  pages: PageSummaryDto[],
  query: string
): PageSummaryDto[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return pages;
  }

  return pages.filter((page) =>
    buildPageSearchIndex(page).includes(normalizedQuery)
  );
}

export function buildPageListSearchParams(query: string): string {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return "";
  }

  const params = new URLSearchParams({ q: trimmedQuery });
  return params.toString();
}

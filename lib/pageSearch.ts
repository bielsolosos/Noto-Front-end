export interface PageSortParams {
  sortBy: "UPDATED_AT" | "CREATED_AT" | "TITLE";
  sortOrder: "DESC" | "ASC";
}

export function buildPageListSearchParams(
  query: string,
  sortParams?: PageSortParams
): string {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.append("q", query.trim());
  }

  if (sortParams) {
    params.append("sortBy", sortParams.sortBy);
    params.append("sortOrder", sortParams.sortOrder);
  }

  return params.toString();
}

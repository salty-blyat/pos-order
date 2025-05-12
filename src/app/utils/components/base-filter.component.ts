import { Filter } from "../services/base-api.service";
import { signal } from "@angular/core";

export class BaseFilterComponent {
  searchText = signal<string>("");
  /** Optional: Override in subclass to add custom filters */
  protected getCustomFilters(): Filter[] {
    return [];
  }

  /** Builds full filter lists for API call */
  public buildFilters(extraFilters?: Filter[] | null): string {
    const baseFilters: Filter[] = [];

    if (this.searchText()) {
      baseFilters.push({
        field: "search",
        operator: "contains",
        value: this.searchText(),
      });
    }

    const customFilters = this.getCustomFilters();

    const allFilters = [
      ...baseFilters,
      ...customFilters,
      ...(extraFilters ?? []),
    ];

    return JSON.stringify(allFilters);
  }
}

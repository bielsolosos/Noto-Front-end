export interface PageSummaryDto {
  id: string;
  title: string;
  updatedAt: Date;
}

export interface Page {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
}

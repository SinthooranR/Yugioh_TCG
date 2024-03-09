import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class PaginatorIntlService extends MatPaginatorIntl {
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 of ${length}`;
    }
    length = Math.max(length, 0);
    const totalPages = Math.ceil(length / pageSize);

    if (totalPages === 1 && length <= pageSize) {
      return `Page 1 of ${totalPages}`;
    } else {
      const startIndex = Math.min(page * pageSize, length);
      const endIndex = Math.min(startIndex + pageSize, length);
      return `Page ${page + 1} of ${totalPages}`;
    }
  };
}

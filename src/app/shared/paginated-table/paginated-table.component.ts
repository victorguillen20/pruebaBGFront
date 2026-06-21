import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

export interface ColumnDefinition {
  key: string;
  header: string;
}

@Component({
  selector: 'app-paginated-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './paginated-table.component.html',
  styleUrl: './paginated-table.component.scss',
})
export class PaginatedTableComponent<T> {
  @Input({ required: true }) columns: ColumnDefinition[] = [];
  @Input({ required: true }) set items(value: T[]) {
    this.dataSource.data = value;
  }
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 20, 50];
  @Input() loading = false;
  @Input() emptyMessage = 'No se encontraron registros';

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();

  readonly dataSource = new MatTableDataSource<T>([]);

  displayedColumns(): string[] {
    return this.columns.map((c) => c.key);
  }
}

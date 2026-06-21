import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { PaginatedTableComponent } from './paginated-table.component';

describe('PaginatedTableComponent', () => {
  let component: PaginatedTableComponent<Record<string, unknown>>;
  let fixture: ComponentFixture<PaginatedTableComponent<Record<string, unknown>>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatedTableComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatedTableComponent<Record<string, unknown>>);
    component = fixture.componentInstance;
    component.columns = [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Nombre' },
    ];
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('asigna items al dataSource via setter', () => {
    const items = [{ id: 1, name: 'Test' }];
    component.items = items;
    expect(component.dataSource.data).toEqual(items);
  });

  it('muestra displayedColumns segun input columns', () => {
    expect(component.displayedColumns()).toEqual(['id', 'name']);
  });

  it('emite pageChange al cambiar pagina', () => {
    let emitted = false;
    component.pageChange.subscribe(() => (emitted = true));
    const event: PageEvent = { pageIndex: 1, pageSize: 10, length: 50, previousPageIndex: 0 };
    component.pageChange.emit(event);
    expect(emitted).toBeTrue();
  });
});

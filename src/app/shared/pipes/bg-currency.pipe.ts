import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bgCurrency', standalone: true })
export class BgCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '-';
    try {
      return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'USD' }).format(value);
    } catch {
      const formatted = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `$${formatted}`;
    }
  }
}

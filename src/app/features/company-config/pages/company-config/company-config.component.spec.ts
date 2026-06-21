import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CompanyConfigComponent } from './company-config.component';
import { CompanyConfigService } from '../../../../core/api/company-config.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CompanyConfigComponent', () => {
  let component: CompanyConfigComponent;
  let configServiceSpy: jasmine.SpyObj<CompanyConfigService>;

  beforeEach(async () => {
    configServiceSpy = jasmine.createSpyObj('CompanyConfigService', ['get', 'update', 'uploadLogo']);
    configServiceSpy.get.and.returnValue(of({
      id: 1, companyName: 'Test Corp', taxPercent: 13, currencySymbol: '$',
      phone: null, email: null, address: null, city: null, region: null, postalCode: null,
      logoUrl: null, lastInvoiceNumber: 0, taxId: null,
    }));

    await TestBed.configureTestingModule({
      imports: [CompanyConfigComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: CompanyConfigService, useValue: configServiceSpy },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CompanyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('carga config al iniciar', () => {
    expect(configServiceSpy.get).toHaveBeenCalled();
  });

  it('formulario invalido sin companyName', () => {
    component.form.patchValue({ companyName: '' });
    expect(component.form.valid).toBeFalse();
  });
});

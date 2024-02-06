import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CardComponent } from './card.component';
import { MoedasService } from 'src/app/services/moedas.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importe o HttpClientModule

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let moedasServiceSpy: jasmine.SpyObj<MoedasService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MoedasService', ['getMoeda']);

    await TestBed.configureTestingModule({
      declarations: [CardComponent],
      imports: [HttpClientModule], // Certifique-se de importar o HttpClientModule aqui
      providers: [{ provide: MoedasService, useClass: spy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display error message and reload button when data retrieval fails', () => {
    moedasServiceSpy.getMoeda.and.returnValue(throwError('Erro de teste'));

    // Trigger ngOnInit() to fetch data
    component.ngOnInit();
    fixture.detectChanges();

    // Verify that error message and reload button are displayed
    const errorMessage = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessage).toBeTruthy();

    const reloadButton = fixture.debugElement.query(By.css('button'));
    expect(reloadButton.nativeElement.textContent).toContain('RECARREGAR');
  });

  it('should display loading indicator while reloading data', fakeAsync(() => {
    // Trigger the reload method
    component.reload();
    fixture.detectChanges();

    // Verify that loading indicator is displayed
    const loadingIndicator = fixture.debugElement.query(By.css('.loading'));
    expect(loadingIndicator).toBeTruthy();
  }));
});

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { InputSearchDebouncedComponent } from './input-search-debounced.component';
import { By } from '@angular/platform-browser';


describe('InputTextComponent', () => {
  let component: InputSearchDebouncedComponent;
  let fixture: ComponentFixture<InputSearchDebouncedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSearchDebouncedComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputSearchDebouncedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir el valor de búsqueda después del retraso de 500 ms', fakeAsync(() => {
    spyOn(component.onSearch, 'emit');
    component.searchControl.setValue('test');
    tick(500); // Avanzar el reloj de pruebas para simular el retraso
    fixture.detectChanges();
    expect(component.onSearch.emit).toHaveBeenCalledWith('test');
  }));

  it('debería actualizar el placeholder en el input', () => {
    component.placeholder = 'Buscar...';
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.placeholder).toBe('Buscar...');
  });

  
});

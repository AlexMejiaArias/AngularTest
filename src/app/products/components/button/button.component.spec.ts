import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let buttonElement: DebugElement;
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  //Verifica que el componente se crea correctamente.
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un valor inicial vacío para labelButton', () => {
    expect(component.labelButton).toBe('');
  });


  it('debería mostrar el texto del botón según labelButton', () => {
    component.labelButton = 'Test Button';
    fixture.detectChanges();
    expect(buttonElement.nativeElement.value).toBe('Test Button');
  });

  it('debería aplicar la clase de severidad adecuada', () => {
    component.severity = 'primary';
    fixture.detectChanges();
    expect(buttonElement.nativeElement.classList).toContain('primary');

    component.severity = 'info';
    fixture.detectChanges();
    expect(buttonElement.nativeElement.classList).toContain('info');
  });


  it('debería aplicar la clase disabled cuando disabled es true', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(buttonElement.nativeElement.classList).toContain('disabled');
  });

  it('debería emitir un evento clicked cuando el botón es clickeado', () => {
    spyOn(component.clicked, 'emit');
    buttonElement.triggerEventHandler('click', null);
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  
});

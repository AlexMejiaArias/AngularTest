import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { By } from '@angular/platform-browser';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el modal cuando visible es true', () => {
    component.visible = true;
    fixture.detectChanges();
    const modalOverlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modalOverlay).toBeTruthy();
  });

  it('debería ocultar el modal cuando visible es false', () => {
    component.visible = false;
    fixture.detectChanges();
    const modalOverlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modalOverlay).toBeFalsy();
  });

  it('debería emitir el evento onAccept cuando se hace clic en el botón Confirmar', () => {
    spyOn(component.onAccept, 'emit');
    component.visible = true; // Asegúrate de que el modal sea visible
    fixture.detectChanges();
    const confirmButton = fixture.debugElement.query(By.css('app-button[labelButton="Confirmar"]'));
    confirmButton.triggerEventHandler('clicked', null);
    expect(component.onAccept.emit).toHaveBeenCalled();
  });
  
  it('debería emitir el evento onReject cuando se hace clic en el botón Cancelar', () => {
    spyOn(component.onReject, 'emit');
    component.visible = true; // Asegúrate de que el modal sea visible
    fixture.detectChanges();
    const cancelButton = fixture.debugElement.query(By.css('app-button[labelButton="Cancelar"]'));
    cancelButton.triggerEventHandler('clicked', null);
    expect(component.onReject.emit).toHaveBeenCalled();
  });
  
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMenuComponent } from './dropdown-menu.component';
import { By } from '@angular/platform-browser';

describe('DropdownMenuComponent', () => {
  let component: DropdownMenuComponent;
  let fixture: ComponentFixture<DropdownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownMenuComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería alternar la visibilidad del menú cuando se llama a toggleMenu', () => {
    expect(component.isOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isOpen).toBeTrue();
    component.toggleMenu();
    expect(component.isOpen).toBeFalse();
  });

  it('debería cerrar el menú al hacer clic fuera', () => {
    component.isOpen = true;
    fixture.detectChanges();
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(component.isOpen).toBeFalse();
  });

  it('debería aplicar la clase "show" al menú desplegable cuando isOpen es true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const dropdownMenu = fixture.debugElement.query(By.css('.dropdown-menu'));
    expect(dropdownMenu.nativeElement.classList).toContain('show');
  });

  it('no debería aplicar la clase "show" al menú desplegable cuando isOpen es false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const dropdownMenu = fixture.debugElement.query(By.css('.dropdown-menu'));
    expect(dropdownMenu.nativeElement.classList).not.toContain('show');
  });


});

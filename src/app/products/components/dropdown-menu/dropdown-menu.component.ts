import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.css'
})
export class DropdownMenuComponent {

  constructor(private elementRef: ElementRef) { }
  @Input() menuItems: { label: string, action: () => void }[] = [];
  @Output() itemSelected = new EventEmitter<any>();


  isOpen = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  selectItem(item: { label: string, action: () => void }) {
    item.action();
    this.itemSelected.emit(item.label);
    this.isOpen = false;
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
type Severity = 'primary' | 'info'
type TypeButton = 'submit' | 'button'

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})

export class ButtonComponent implements OnInit {

  @Input()
  public labelButton: string = '';
  @Input()
  public severity!: Severity;
  @Output()
  public clicked = new EventEmitter<any>();
  @Input()
  public disabled?: boolean;
  @Input()
  public typeInput?: TypeButton;

  ngOnInit(): void {
    if (this.typeInput === undefined) this.typeInput = 'button'
  }

  onClick() {
    this.clicked.emit();
  }


}

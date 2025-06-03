import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-input-search-debounced',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-search-debounced.component.html',
  styleUrl: './input-search-debounced.component.css'
})
export class InputSearchDebouncedComponent implements OnInit {
  @Input() placeholder: string = '';
  @Output() onSearch = new EventEmitter<string>();

  searchControl = new FormControl();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        this.searchDebounced(value);
      });
  }

  searchDebounced(value: string) {
    this.onSearch.emit(value);
  }




}

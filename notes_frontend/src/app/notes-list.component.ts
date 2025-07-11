import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SlicePipe],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent {
  @Input() notes: any[] = [];
  @Input() selectedNoteId: string | null = null;
  @Output() selectNote = new EventEmitter<string>();
  @Output() createNote = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchInput: string = '';

  onSelect(id: string) {
    this.selectNote.emit(id);
  }

  onCreate() {
    this.createNote.emit();
  }

  onSearchChange() {
    this.search.emit(this.searchInput);
  }
}

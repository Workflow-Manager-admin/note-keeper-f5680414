import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css'
})
export class NoteEditorComponent {
  @Input() note: any = null;
  @Input() editing: boolean = false; // distinguish between create and edit
  @Output() save = new EventEmitter<{title:string, content:string}>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  tmpTitle: string = '';
  tmpContent: string = '';

  ngOnChanges() {
    // Set up tmpTitle/tmpContent whenever a note is selected.
    if (this.note) {
      this.tmpTitle = this.note.title;
      this.tmpContent = this.note.content;
    } else {
      this.tmpTitle = '';
      this.tmpContent = '';
    }
  }

  onSave() {
    if (this.tmpTitle.trim() !== '') {
      this.save.emit({ title: this.tmpTitle.trim(), content: this.tmpContent.trim() });
    }
  }
  onCancel() {
    this.cancel.emit();
  }
  onDelete() {
    this.delete.emit();
  }
}

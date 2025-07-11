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
    // For new note, ensure fields are editable
    if (this.note) {
      this.tmpTitle = this.note.title;
      this.tmpContent = this.note.content;
    } else {
      this.tmpTitle = '';
      this.tmpContent = '';
    }
  }

  get isFormEditable(): boolean {
    // Form is editable when creating a note (editing is false), or editing an existing note (editing is true)
    return (this.editing === false) || (this.editing === true);
  }

  // PUBLIC_INTERFACE
  onSave() {
    if (this.tmpTitle.trim() !== '') {
      this.save.emit({ title: this.tmpTitle.trim(), content: this.tmpContent.trim() });
    }
  }
  // PUBLIC_INTERFACE
  onCancel() {
    this.cancel.emit();
  }
  // PUBLIC_INTERFACE
  onDelete() {
    this.delete.emit();
  }
}

import { Component, inject } from '@angular/core';
import { NotesListComponent } from './notes-list.component';
import { NoteEditorComponent } from './note-editor.component';
import { TopbarComponent } from './topbar.component';
import { SupabaseService } from './supabase.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [NotesListComponent, NoteEditorComponent, TopbarComponent, NgIf],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  notes: any[] = [];
  selectedNote: any = null;
  selectedNoteId: string | null = null;
  isEditing: boolean = false;
  loading: boolean = false;
  searchTerm: string = '';

  private supabaseService = inject(SupabaseService);

  ngOnInit() {
    // During SSR prerendering, window is undefined and network requests can hang the build.
    // Only fetch notes if running in browser (when window is defined).
    if (typeof window !== 'undefined') {
      this.refresh();
    }
  }

  async refresh(search: string = '') {
    this.loading = true;
    this.notes = await this.supabaseService.fetchNotes(search);
    this.loading = false;
    if (this.selectedNoteId) {
      this.selectedNote = this.notes.find(n => n.id === this.selectedNoteId) || null;
    }
  }

  onSelectNote(id: string) {
    this.selectedNoteId = id;
    this.selectedNote = this.notes.find(n => n.id === id) || null;
    this.isEditing = true;
  }

  onCreateNote() {
    this.selectedNoteId = null;
    this.selectedNote = { title: '', content: '' };
    this.isEditing = false;
  }

  async onSaveNote(note: {title: string, content: string}) {
    this.loading = true;
    if (this.isEditing && this.selectedNote && this.selectedNote.id) {
      await this.supabaseService.updateNote(this.selectedNote.id, note);
    } else {
      const created = await this.supabaseService.createNote(note);
      this.selectedNoteId = created.id;
    }
    await this.refresh(this.searchTerm);
    this.isEditing = true;
    this.selectedNote = this.notes.find(n => n.id === this.selectedNoteId) || null;
    this.loading = false;
  }

  async onDeleteNote() {
    if (this.selectedNote && this.selectedNote.id) {
      this.loading = true;
      await this.supabaseService.deleteNote(this.selectedNote.id);
      this.selectedNoteId = null;
      this.selectedNote = null;
      this.loading = false;
      await this.refresh(this.searchTerm);
    }
  }

  onCancelEdit() {
    if (this.isEditing && this.selectedNoteId) {
      // re-select the current note, discard modifications
      this.selectedNote = this.notes.find(n => n.id === this.selectedNoteId) || null;
    } else {
      this.selectedNote = null;
      this.selectedNoteId = null;
    }
    this.isEditing = !!this.selectedNoteId;
  }

  async onSearch(term: string) {
    this.searchTerm = term;
    await this.refresh(term);
  }
}

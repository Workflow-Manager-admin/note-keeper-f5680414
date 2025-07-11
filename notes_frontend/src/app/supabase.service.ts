import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mzxyorlnbfdkneiezgjz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16eHlvcmxuYmZka25laWV6Z2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDUxMDksImV4cCI6MjA2NzYyMTEwOX0.URYpbwtC2u5ORBlUzpWPNspXMWq_cLBOKWMOgGbilyQ';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  // PUBLIC_INTERFACE
  async fetchNotes(search: string = ''): Promise<any[]> {
    let query = this.supabase.from('notes').select('*').order('updated_at', { ascending: false });
    if (search) {
      // Allow searching title or content
      query = query.ilike('title', `%${search}%`).or(`content.ilike.%${search}%`);
    }
    const { data } = await query;
    return data ?? [];
  }

  // PUBLIC_INTERFACE
  async getNote(id: string): Promise<any> {
    const { data } = await this.supabase.from('notes').select('*').eq('id', id).single();
    return data;
  }

  // PUBLIC_INTERFACE
  async createNote(note: { title: string; content: string }): Promise<any> {
    const { data } = await this.supabase.from('notes').insert([note]).select().single();
    return data;
  }

  // PUBLIC_INTERFACE
  async updateNote(id: string, note: { title: string; content: string }): Promise<any> {
    const { data } = await this.supabase.from('notes').update(note).eq('id', id).select().single();
    return data;
  }

  // PUBLIC_INTERFACE
  async deleteNote(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('notes').delete().eq('id', id);
    return !error;
  }
}

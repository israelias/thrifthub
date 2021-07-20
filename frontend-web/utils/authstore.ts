interface Note {
  noteId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

// class NoteStore {
//   initializeNotes(notes: Note[]) {
//     if (this.notes.length > 0) {
//       this.notes.splice(0, this.notes.length);
//     }
//     this.notes.push(...notes);
//   }

//   saveNote(note: Note) {
//     console.log(`NoteStore:saveNote(${note.noteId})`);
//     const idx = this.notes.findIndex((n) => note.noteId === n.noteId);
//     if (idx < 0) {
//       this.notes.push(note);
//     } else {
//       this.notes[idx] = note;
//     }
//     localStorage.setItem(note);
//   }

//   deleteNote(note: Note) {
//     console.log(`NoteStore:deleteNote(${note.noteId})`);
//     const idx = this.notes.findIndex((n) => n.noteId === note.noteId);
//     if (idx < 0) {
//       throw new Error(`Note ${note.noteId} not found`);
//     } else {
//       this.notes.splice(idx, 1);
//       localStorage.deleteItem(note.noteId);
//       if (note.noteId === this.activeNoteId) {
//         this.activeNoteId = null;
//       }
//     }
//   }
// }

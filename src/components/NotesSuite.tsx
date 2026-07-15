import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderOpen, ArrowLeft, Search, Pin, Plus, Trash2, Edit3, CheckSquare, 
  Square, FileText, Check, Sparkles, Folder, Save, ChevronRight
} from 'lucide-react';
import { AccentColor, NoteItem } from '../types';

interface NotesSuiteProps {
  accentColor: AccentColor;
  onBack: () => void;
}

export function NotesSuite({ accentColor, onBack }: NotesSuiteProps) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [folders, setFolders] = useState<string[]>(['Personal', 'Work', 'Shopping', 'Ideas']);
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Note creation/editing states
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteFolder, setNoteFolder] = useState('Personal');
  const [isChecklist, setIsChecklist] = useState(false);
  const [checklistInput, setChecklistInput] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ id: string; text: string; done: boolean }[]>([]);

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/10',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/10',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10',
  }[accentColor];

  const buttonAccentClass = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
  }[accentColor];

  useEffect(() => {
    const savedNotes = localStorage.getItem('sup_notes_data');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveToLocalStorage = (updatedNotes: NoteItem[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('sup_notes_data', JSON.stringify(updatedNotes));
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim()) {
      alert("Please enter a note title");
      return;
    }

    let updated: NoteItem[];

    if (editingNote && editingNote.id !== 'new') {
      // Editing existing note
      updated = notes.map(n => n.id === editingNote.id ? {
        ...n,
        title: noteTitle,
        content: isChecklist ? '' : noteContent,
        folder: noteFolder,
        isChecklist,
        checklistItems
      } : n);
    } else {
      // Create new note
      const newNote: NoteItem = {
        id: Date.now().toString(),
        title: noteTitle,
        content: isChecklist ? '' : noteContent,
        folder: noteFolder,
        isPinned: false,
        isChecklist,
        checklistItems,
        createdAt: Date.now()
      };
      updated = [newNote, ...notes];
    }

    saveToLocalStorage(updated);
    setEditingNote(null);
    resetForm();
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
    saveToLocalStorage(updated);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      const updated = notes.filter(n => n.id !== id);
      saveToLocalStorage(updated);
    }
  };

  const handleChecklistToggleItem = (noteId: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          checklistItems: n.checklistItems.map(item => item.id === itemId ? { ...item, done: !item.done } : item)
        };
      }
      return n;
    });
    saveToLocalStorage(updated);
  };

  const handleAddChecklistItem = () => {
    if (!checklistInput.trim()) return;
    setChecklistItems([
      ...checklistItems,
      { id: Date.now().toString(), text: checklistInput, done: false }
    ]);
    setChecklistInput('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id));
  };

  const startNewNote = () => {
    setEditingNote({
      id: 'new',
      title: '',
      content: '',
      folder: folders[0],
      isPinned: false,
      isChecklist: false,
      checklistItems: [],
      createdAt: Date.now()
    });
    resetForm();
  };

  const startEditNote = (note: NoteItem) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteFolder(note.folder);
    setIsChecklist(note.isChecklist);
    setChecklistItems(note.checklistItems || []);
  };

  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setNoteFolder('Personal');
    setIsChecklist(false);
    setChecklistInput('');
    setChecklistItems([]);
  };

  // Filters Notes list
  const filteredNotes = notes.filter((note) => {
    const matchesFolder = selectedFolder === 'All' || note.folder === selectedFolder;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const regularNotes = filteredNotes.filter(n => !n.isPinned);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="notes-suite-root">
      
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="notes-header">
        <div className="flex items-center gap-3">
          <button onClick={editingNote ? () => setEditingNote(null) : onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold font-display leading-tight">Secure Notes</h1>
            <p className="text-xs text-slate-400">{editingNote ? 'Edit note details' : 'Durable local notebooks'}</p>
          </div>
        </div>
        {!editingNote && (
          <button 
            onClick={startNewNote}
            className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${activeAccentClass}`}
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          
          {editingNote ? (
            // NOTE CREATION / EDITING PANEL
            <motion.div
              key="note-edit-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
            >
              <div className="bg-slate-850 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-inner">
                
                {/* Title */}
                <input
                  type="text"
                  placeholder="Note Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-800 focus:border-indigo-500 py-1.5 text-base font-bold font-display focus:outline-none placeholder-slate-500"
                />

                {/* Folder Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">Category Folder</span>
                  <select
                    value={noteFolder}
                    onChange={(e) => setNoteFolder(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-semibold focus:outline-none"
                  >
                    {folders.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>

                  <button 
                    onClick={() => setIsChecklist(!isChecklist)}
                    className={`ml-auto px-2.5 py-1 text-[10px] rounded-lg border font-bold flex items-center gap-1 cursor-pointer ${
                      isChecklist 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CheckSquare size={12} />
                    <span>Checklist Mode</span>
                  </button>
                </div>
              </div>

              {/* Note Content (Standard Markdown style block) */}
              {!isChecklist ? (
                <div className="space-y-2">
                  <textarea
                    placeholder="Start drafting here... supports raw plain text notes"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full min-h-[220px] bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs font-sans focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                  
                  {/* Visual Helpers Bar */}
                  <div className="flex gap-1 bg-slate-950 px-2 py-1.5 rounded-xl border border-slate-850 text-[10px] text-slate-400 font-mono">
                    <button onClick={() => setNoteContent(p => p + ' **Bold** ')} className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded">B</button>
                    <button onClick={() => setNoteContent(p => p + ' *Italic* ')} className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded">I</button>
                    <button onClick={() => setNoteContent(p => p + ' # Header ')} className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded">H1</button>
                    <button onClick={() => setNoteContent(p => p + ' - Bullet ')} className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded">List</button>
                  </div>
                </div>
              ) : (
                // CHECKLIST CONSTRUCTOR
                <div className="space-y-3 bg-slate-950 border border-slate-850 p-4 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-500 uppercase font-mono block">Todo Check List</span>
                  
                  {/* Items List */}
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-900/60 p-2 border border-slate-850 rounded-xl">
                        <div className="flex items-center gap-2">
                          <CheckSquare size={14} className="text-indigo-400" />
                          <span className="text-xs text-slate-300">{item.text}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveChecklistItem(item.id)}
                          className="text-xs text-rose-400 p-1 rounded hover:bg-slate-850"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Input item constructor */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add checkbox item..."
                      value={checklistInput}
                      onChange={(e) => setChecklistInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddChecklistItem(); }}
                      className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleAddChecklistItem}
                      className="px-3 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Save Action button */}
              <button
                onClick={handleSaveNote}
                className={`w-full py-3.5 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer ${activeAccentClass}`}
              >
                <Save size={14} />
                <span>Save Notebook Entry</span>
              </button>

            </motion.div>
          ) : (
            // NOTES HOME / LIST PANEL
            <motion.div
              key="notes-list-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Search Box */}
              <div className="relative flex items-center" id="notes-search-wrapper">
                <Search className="absolute left-3.5 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search notebooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Folders horizontal filters list */}
              <div className="flex gap-1.5 overflow-x-auto pb-1" id="notes-folders-scroller">
                {['All', ...folders].map((folder) => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                      selectedFolder === folder 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {folder}
                  </button>
                ))}
              </div>

              {/* Notebook List */}
              {filteredNotes.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/10 border border-slate-800/50 rounded-3xl p-6">
                  <FileText size={44} className="text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No notes match your filters</p>
                  <p className="text-[10px] text-slate-500 mt-1">Tap the plus badge at top right to start a secure, encrypted memo.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pinned section */}
                  {pinnedNotes.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold block">PINNED MEMOS</span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {pinnedNotes.map((note) => (
                          <div 
                            key={note.id}
                            onClick={() => startEditNote(note)}
                            className="p-3.5 bg-slate-950 border-l-4 border-indigo-500 border border-slate-850 rounded-2xl cursor-pointer hover:border-slate-800 transition-all flex justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <h3 className="font-bold text-sm text-slate-200 font-display truncate">{note.title}</h3>
                              {note.isChecklist ? (
                                <div className="flex items-center gap-1 text-[10px] text-indigo-400">
                                  <CheckSquare size={12} />
                                  <span>Checklist: {note.checklistItems.filter(i=>i.done).length}/{note.checklistItems.length} complete</span>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{note.content}</p>
                              )}
                            </div>

                            <div className="flex flex-col justify-between items-end gap-2 flex-shrink-0">
                              <button onClick={(e) => handleTogglePin(note.id, e)} className="text-indigo-400 p-1 rounded">
                                <Pin size={12} className="fill-indigo-400" />
                              </button>
                              <button onClick={(e) => handleDeleteNote(note.id, e)} className="text-slate-500 hover:text-rose-400 p-1 rounded">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regular Memos section */}
                  <div className="space-y-2">
                    {pinnedNotes.length > 0 && <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold block">ALL MEMOS</span>}
                    <div className="grid grid-cols-1 gap-2.5">
                      {regularNotes.map((note) => (
                        <div 
                          key={note.id}
                          onClick={() => startEditNote(note)}
                          className="p-3.5 bg-slate-800/40 border border-slate-800/50 rounded-2xl cursor-pointer hover:border-slate-700 transition-all flex justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="font-bold text-sm text-slate-200 font-display truncate">{note.title}</h3>
                            {note.isChecklist ? (
                              <div className="flex flex-col gap-1.5 pt-1">
                                <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                                  <CheckSquare size={12} className="text-indigo-400" />
                                  <span>Todo: {note.checklistItems.filter(i=>i.done).length}/{note.checklistItems.length} items checked</span>
                                </div>
                                
                                {/* Render top checklist items preview with interactive clicking */}
                                <div className="space-y-1">
                                  {note.checklistItems.slice(0, 3).map(item => (
                                    <div 
                                      key={item.id} 
                                      onClick={(e) => handleChecklistToggleItem(note.id, item.id, e)}
                                      className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white"
                                    >
                                      {item.done ? <CheckSquare size={11} className="text-emerald-400" /> : <Square size={11} />}
                                      <span className={item.done ? 'line-through text-slate-600' : ''}>{item.text}</span>
                                    </div>
                                  ))}
                                  {note.checklistItems.length > 3 && <span className="text-[8px] text-slate-600 pl-4 font-mono">+ {note.checklistItems.length - 3} more checklist items</span>}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{note.content}</p>
                            )}
                          </div>

                          <div className="flex flex-col justify-between items-end gap-2 flex-shrink-0">
                            <button onClick={(e) => handleTogglePin(note.id, e)} className="text-slate-500 hover:text-indigo-400 p-1 rounded">
                              <Pin size={12} />
                            </button>
                            <button onClick={(e) => handleDeleteNote(note.id, e)} className="text-slate-500 hover:text-rose-400 p-1 rounded">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}

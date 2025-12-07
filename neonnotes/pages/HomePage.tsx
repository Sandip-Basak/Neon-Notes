import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { noteService, extractErrorMessage } from '../services/api';
import { Note } from '../types';
import { NoteModal } from '../components/NoteModal';
import { Button } from '../components/UI';
import { LogOut, Plus, Search, Edit2, Trash2, Calendar, FileText } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotes = async () => {
    try {
      const data = await noteService.getAll();
      setNotes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (formData: FormData) => {
    try {
      const newNote = await noteService.create(formData);
      setNotes(prev => [newNote, ...prev]);
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingNote) return;
    try {
      const updatedNote = await noteService.update(editingNote.id, formData);
      setNotes(prev => prev.map(n => n.id === editingNote.id ? updatedNote : n));
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await noteService.delete(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-white text-lg">N</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">NeonNotes</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700 focus-within:border-primary transition-colors">
              <Search size={16} className="text-zinc-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                className="bg-transparent border-none focus:outline-none text-sm text-white w-48 placeholder-zinc-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-400 hidden sm:block">
                {user?.username}
              </span>
              <button 
                onClick={logout}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Mobile Search & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-white">My Notes</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="md:hidden flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button onClick={() => { setEditingNote(null); setIsModalOpen(true); }} className="whitespace-nowrap">
              <Plus size={18} className="mr-1" /> New Note
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
             <p className="text-red-400">{error}</p>
             <Button variant="ghost" onClick={fetchNotes} className="mt-4">Try Again</Button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-zinc-500" size={32} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No notes found</h3>
            <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
              {searchQuery ? "Try adjusting your search query." : "Create your first note to get started capturing your ideas."}
            </p>
            {!searchQuery && (
              <Button onClick={() => { setEditingNote(null); setIsModalOpen(true); }}>
                Create Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className="group relative bg-surface border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
              >
                {/* Note Image */}
                <div className="aspect-video w-full bg-zinc-900 relative overflow-hidden">
                   {note.image ? (
                     <img 
                      src={note.image} // Django often returns relative paths for Media
                      alt={note.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback if image fails or path is wrong
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                     />
                   ) : null}
                   
                   {/* Fallback pattern or overlay if no image or error */}
                   <div className={`${note.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900`}>
                      <FileText className="text-zinc-700" size={48} />
                   </div>

                   {/* Actions Overlay */}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                      <button 
                        onClick={() => { setEditingNote(note); setIsModalOpen(true); }}
                        className="p-3 rounded-full bg-zinc-800 text-white hover:bg-primary transition-colors shadow-lg transform hover:scale-110"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(note.id)}
                        className="p-3 rounded-full bg-zinc-800 text-white hover:bg-red-500 transition-colors shadow-lg transform hover:scale-110"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-3 mb-4 flex-1">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/50 pt-3 mt-auto">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <NoteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingNote ? handleUpdate : handleCreate}
        initialData={editingNote}
      />
    </div>
  );
};

export default HomePage;

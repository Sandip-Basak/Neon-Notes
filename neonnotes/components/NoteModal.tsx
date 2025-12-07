import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Note } from '../types';
import { Button, Input, TextArea } from './UI';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Note | null;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset or populate form when modal opens/closes/initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        // If there's an existing image from the backend, we display it as the preview
        setPreviewUrl(initialData.image);
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageFile(null);
    setPreviewUrl(null);
    setIsSubmitting(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {initialData ? 'Edit Note' : 'Create Note'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="note-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              
              <TextArea
                label="Content"
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-40"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
                <div 
                  className={`relative group border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${previewUrl ? 'border-zinc-700' : 'border-zinc-700 hover:border-primary/50 hover:bg-zinc-800/50'}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Button 
                           type="button" 
                           variant="secondary" 
                           onClick={() => fileInputRef.current?.click()}
                         >
                           Change Image
                         </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center py-8 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <Upload size={20} className="text-zinc-400 group-hover:text-primary" />
                      </div>
                      <p className="text-sm font-medium text-white">Click to upload image</p>
                      <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900 rounded-b-2xl">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="note-form" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Note'}
          </Button>
        </div>
      </div>
    </div>
  );
};

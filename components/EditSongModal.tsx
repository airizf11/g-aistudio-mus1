import React, { useState, useEffect } from 'react';
import type { Song } from '../types';

interface EditSongModalProps {
  song: Song;
  onClose: () => void;
  onSave: (song: Song) => void;
}

const EditSongModal: React.FC<EditSongModalProps> = ({ song, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: song.title,
    artist: song.artist,
    album: song.album,
  });

  useEffect(() => {
    // If the song prop changes, update the form data
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album,
    });
  }, [song]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...song, ...formData });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-2xl font-bold text-white mb-4">Edit Song</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-400 mb-1">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md shadow-sm placeholder-neutral-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-neutral-400 mb-1">Artist</label>
            <input
              type="text"
              name="artist"
              id="artist"
              value={formData.artist}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md shadow-sm placeholder-neutral-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="album" className="block text-sm font-medium text-neutral-400 mb-1">Album</label>
            <input
              type="text"
              name="album"
              id="album"
              value={formData.album}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md shadow-sm placeholder-neutral-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-green-500 hover:bg-green-600 rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSongModal;

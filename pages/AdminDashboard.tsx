import React, { useRef, useState, useEffect } from 'react';
import type { Song } from '../types';
import { PencilIcon, TrashIcon } from '../components/icons/Icons';

interface AdminDashboardProps {
  songs: Song[];
  onAddSongs: (newSongs: Song[]) => void;
  onLogout: () => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (songId: number) => void;
}

const formatDuration = (seconds: number) => {
  if (isNaN(seconds)) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ songs, onAddSongs, onLogout, onEditSong, onDeleteSong }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLibraryReady, setIsLibraryReady] = useState(false);

  useEffect(() => {
    // Check if the library is already available
    if ((window as any).musicMetadata) {
      setIsLibraryReady(true);
      return;
    }

    // If not, poll every 100ms until it's available
    const libraryCheckInterval = setInterval(() => {
      if ((window as any).musicMetadata) {
        setIsLibraryReady(true);
        clearInterval(libraryCheckInterval);
      }
    }, 100);

    // Cleanup on component unmount
    return () => clearInterval(libraryCheckInterval);
  }, []);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const mm = (window as any).musicMetadata;
    if (!mm) {
      console.error("Music metadata library is still not available.");
      alert("Error: Could not load music processing library. Please try refreshing the page.");
      return;
    }

    setIsProcessing(true);
    const newSongs: Song[] = [];
    const existingIds = new Set(songs.map(s => s.id));
    let nextId = songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1;

    for (const file of Array.from(files)) {
      try {
        const metadata = await mm.parseBlob(file);
        const common = metadata.common;
        
        while (existingIds.has(nextId)) {
            nextId++;
        }
        existingIds.add(nextId);

        let coverArtUrl = 'https://picsum.photos/seed/default/400';
        if (common.picture && common.picture.length > 0) {
            const picture = common.picture[0];
            const blob = new Blob([picture.data], { type: picture.format });
            coverArtUrl = URL.createObjectURL(blob);
        }

        const newSong: Song = {
            id: nextId,
            title: common.title || file.name.replace(/\.[^/.]+$/, ""),
            artist: common.artist || 'Unknown Artist',
            album: common.album || 'Unknown Album',
            duration: metadata.format.duration || 0,
            coverArtUrl: coverArtUrl,
            audioUrl: URL.createObjectURL(file),
        };
        newSongs.push(newSong);
      } catch (error) {
        console.error('Error parsing file metadata:', file.name, error);
      }
    }
    
    if (newSongs.length > 0) {
        onAddSongs(newSongs);
    }
    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setIsProcessing(false);
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (!isLibraryReady) return 'Initializing...';
    return 'Add New Songs';
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
      <header className="bg-black p-4 flex justify-between items-center shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3 text-xl font-bold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#1DB954" strokeWidth="2"/>
                <path d="M9 15.5V8.5L15 12L9 15.5Z" fill="#1DB954"/>
            </svg>
            <span>Musikipri Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            multiple 
            accept="audio/*"
            className="hidden"
          />
          <button 
            onClick={handleAddClick}
            disabled={isProcessing || !isLibraryReady}
            className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed"
          >
            {getButtonText()}
          </button>
          <button 
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Music Library</h1>
        <div className="bg-neutral-800 rounded-lg overflow-hidden">
           <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-black/30">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-neutral-400">#</th>
                        <th className="p-4 text-sm font-semibold text-neutral-400">Title</th>
                        <th className="p-4 text-sm font-semibold text-neutral-400">Album</th>
                        <th className="p-4 text-sm font-semibold text-neutral-400">Duration</th>
                        <th className="p-4 text-sm font-semibold text-neutral-400">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index) => (
                        <tr key={song.id} className="border-b border-neutral-700/50 hover:bg-neutral-700/30">
                            <td className="p-4 text-neutral-400">{index + 1}</td>
                            <td className="p-4">
                               <div className="flex items-center gap-4">
                                  <img src={song.coverArtUrl} alt={song.title} className="w-10 h-10 rounded-sm object-cover" />
                                  <div>
                                      <p className="font-medium text-white">{song.title}</p>
                                      <p className="text-sm text-neutral-400">{song.artist}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="p-4 text-neutral-300">{song.album}</td>
                            <td className="p-4 text-neutral-300">{formatDuration(song.duration)}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => onEditSong(song)} className="text-neutral-400 hover:text-white transition-colors" title="Edit">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => onDeleteSong(song.id)} className="text-neutral-400 hover:text-red-500 transition-colors" title="Delete">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                     {songs.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center p-8 text-neutral-500">
                                Your music library is empty. Add some songs to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
import React, { useState } from 'react';
import MusicPlayerApp from './MusicPlayerApp';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { MOCK_SONGS } from './data/mockData';
import type { Song } from './types';
import EditSongModal from './components/EditSongModal';


export type View = 'player' | 'adminLogin' | 'adminDashboard';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    sessionStorage.getItem('isAdminAuthenticated') === 'true'
  );
  
  const [view, setView] = useState<View>(isAuthenticated ? 'adminDashboard' : 'player');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const isEditModalOpen = !!editingSong;

  const handleLoginSuccess = () => {
    sessionStorage.setItem('isAdminAuthenticated', 'true');
    setIsAuthenticated(true);
    setView('adminDashboard');
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    setView('player'); // Go back to player on logout
  };

  const handleAddSongs = (newSongs: Song[]) => {
    setSongs(prevSongs => [...prevSongs, ...newSongs]);
  };

  const handleUpdateSong = (updatedSong: Song) => {
    setSongs(prevSongs => prevSongs.map(song => song.id === updatedSong.id ? updatedSong : song));
    setEditingSong(null); // Close modal on save
  };

  const handleDeleteSong = (songId: number) => {
    if(window.confirm('Are you sure you want to delete this song? This action cannot be undone.')) {
        setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
    }
  };
  
  const navigate = (newView: View) => {
    setView(newView);
  };
  
  // Decide which view to show based on auth and view state
  if (view === 'adminLogin') {
     return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  if (view === 'adminDashboard') {
    if (isAuthenticated) {
        return (
          <>
            <AdminDashboard 
              songs={songs} 
              onAddSongs={handleAddSongs} 
              onLogout={handleLogout}
              onEditSong={setEditingSong}
              onDeleteSong={handleDeleteSong}
            />
            {isEditModalOpen && editingSong && (
              <EditSongModal 
                song={editingSong}
                onClose={() => setEditingSong(null)}
                onSave={handleUpdateSong}
              />
            )}
          </>
        );
    } else {
        // If trying to access dashboard while not auth, show login
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }
  }

  return <MusicPlayerApp songs={songs} navigate={navigate} />;
};

export default App;
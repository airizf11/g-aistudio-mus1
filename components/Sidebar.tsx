import React from 'react';
import { HomeIcon, MusicNoteIcon, CollectionIcon, UserGroupIcon, LibraryIcon, PlusCircleIcon, HeartIcon, LockClosedIcon } from './icons/Icons';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onNavigateToAdmin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onNavigateToAdmin }) => {
  const menuItems = [
    { name: 'Home', icon: HomeIcon },
    { name: 'Songs', icon: MusicNoteIcon },
    { name: 'Playlists', icon: CollectionIcon },
    { name: 'Artists', icon: UserGroupIcon },
    { name: 'Albums', icon: LibraryIcon },
  ];

  return (
    <div className="w-64 bg-black p-2 flex-shrink-0 flex flex-col">
      <div className="bg-neutral-900 rounded-lg p-2">
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 p-2 text-xl font-bold w-full text-left">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#1DB954" strokeWidth="2"/>
            <path d="M9 15.5V8.5L15 12L9 15.5Z" fill="#1DB954"/>
          </svg>
          Musikipri
        </button>
      </div>
      <nav className="bg-neutral-900 rounded-lg p-2 mt-2">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setActiveView(item.name)}
                className={`flex items-center gap-4 px-4 py-2 rounded-md font-semibold transition-colors duration-200 w-full text-left ${
                  activeView === item.name ? 'text-white bg-neutral-800' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="bg-neutral-900 rounded-lg p-2 mt-2 flex-grow flex flex-col">
        <div className="px-4 py-2">
          <button className="flex items-center gap-4 w-full text-neutral-400 hover:text-white font-semibold transition-colors duration-200">
            <PlusCircleIcon className="w-6 h-6" />
            <span>Create Playlist</span>
          </button>
          <button 
            onClick={() => setActiveView('Liked Songs')}
            className="flex items-center gap-4 w-full mt-4 text-neutral-400 hover:text-white font-semibold transition-colors duration-200"
          >
            <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded">
                <HeartIcon className="w-4 h-4 text-white" />
            </div>
            <span>Liked Songs</span>
          </button>
        </div>
        <div className="border-t border-neutral-800 my-4 mx-4"></div>
        <div className="px-4 overflow-y-auto flex-grow">
          {/* Placeholder for user playlists */}
          <p className="text-neutral-400 hover:text-white cursor-pointer py-1">Lofi Chillhop</p>
          <p className="text-neutral-400 hover:text-white cursor-pointer py-1">Workout Beats</p>
          <p className="text-neutral-400 hover:text-white cursor-pointer py-1">Focus Flow</p>
        </div>
      </div>
      {/* Temporary Admin Panel Link for Development */}
      <div className="bg-neutral-900 rounded-lg p-2 mt-2">
        <button 
          onClick={onNavigateToAdmin}
          className="flex items-center gap-4 px-4 py-2 text-neutral-400 hover:text-white font-semibold transition-colors duration-200 w-full text-left"
        >
          <LockClosedIcon className="w-6 h-6" />
          <span>Admin Panel</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

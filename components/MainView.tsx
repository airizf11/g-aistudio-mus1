
import React, { useState, useEffect, useRef } from 'react';
import type { Song } from '../types';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, DotsVerticalIcon, ClockIcon, HeartIcon, HeartSolidIcon } from './icons/Icons';

interface MainViewProps {
  songs: Song[];
  playSong: (id: number, context: Song[]) => void;
  activeView: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleLike: (id: number) => void;
  likedSongs: Set<number>;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const SongCard: React.FC<{ song: Song, onPlay: () => void }> = ({ song, onPlay }) => (
  <div className="bg-neutral-900/50 hover:bg-neutral-800/80 p-4 rounded-lg cursor-pointer transition-all duration-300 group relative">
    <div className="relative mb-4">
      <img src={song.coverArtUrl} alt={song.title} className="w-full h-auto rounded-md shadow-lg aspect-square object-cover" />
      <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-y-[-8px] transition-all duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
    <div onClick={onPlay}>
      <h3 className="font-bold text-white truncate">{song.title}</h3>
      <p className="text-sm text-neutral-400 truncate">{song.artist}</p>
    </div>
  </div>
);

const SongListView: React.FC<{
    songs: Song[], 
    playSong: (id: number, context: Song[]) => void,
    toggleLike: (id: number) => void,
    likedSongs: Set<number>
}> = ({ songs, playSong, toggleLike, likedSongs }) => (
  <div className="px-6">
    <div className="grid grid-cols-[auto_4fr_3fr_2fr_auto_auto] gap-4 text-neutral-400 text-sm border-b border-neutral-800 p-2 sticky top-16 bg-neutral-900 z-10">
        <div className="text-center">#</div>
        <div>Title</div>
        <div>Album</div>
        <div>Date Added</div>
        <div></div>
        <div className="text-center"><ClockIcon className="w-4 h-4 inline-block"/></div>
    </div>
    <div>
        {songs.map((song, index) => (
             <div key={song.id} onDoubleClick={() => playSong(song.id, songs)} className="grid grid-cols-[auto_4fr_3fr_2fr_auto_auto] gap-4 items-center hover:bg-neutral-800/50 rounded-md p-2 cursor-pointer group">
                <div className="text-center text-neutral-400 group-hover:hidden" onClick={() => playSong(song.id, songs)}>{index + 1}</div>
                 <div className="text-center text-neutral-400 hidden group-hover:block" onClick={() => playSong(song.id, songs)}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                 </div>
                <div className="flex items-center gap-4" onClick={() => playSong(song.id, songs)}>
                    <img src={song.coverArtUrl} alt={song.title} className="w-10 h-10 rounded-sm" />
                    <div>
                        <p className="text-white font-medium">{song.title}</p>
                        <p className="text-sm text-neutral-400">{song.artist}</p>
                    </div>
                </div>
                <div className="text-neutral-400" onClick={() => playSong(song.id, songs)}>{song.album}</div>
                <div className="text-neutral-400" onClick={() => playSong(song.id, songs)}>3 days ago</div>
                <div className="text-center">
                    <button onClick={() => toggleLike(song.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {likedSongs.has(song.id) ? <HeartSolidIcon className="w-5 h-5 text-green-500" /> : <HeartIcon className="w-5 h-5 text-neutral-400" />}
                    </button>
                </div>
                <div className="text-neutral-400 text-center">{formatDuration(song.duration)}</div>
            </div>
        ))}
    </div>
  </div>
);

const PlaceholderView: React.FC<{title: string}> = ({title}) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-neutral-400">This feature is coming soon. Stay tuned!</p>
    </div>
);


const MainView: React.FC<MainViewProps> = ({ songs, playSong, activeView, searchQuery, setSearchQuery, toggleLike, likedSongs }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    if (searchQuery) {
      return (
         <section className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Search Results for "{searchQuery}"</h2>
           {songs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {songs.map((song) => (
                  <SongCard key={song.id} song={song} onPlay={() => playSong(song.id, songs)} />
                ))}
              </div>
            ) : (
                <p className="text-neutral-400">No results found.</p>
            )}
        </section>
      )
    }

    switch(activeView) {
        case 'Home':
            return (
                <div className="p-6">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Recently Played</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {songs.slice(0, 5).map((song) => (
                      <SongCard key={song.id} song={song} onPlay={() => playSong(song.id, songs.slice(0,5))} />
                    ))}
                  </div>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">New Additions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {songs.slice(5, 8).map((song) => (
                      <SongCard key={song.id} song={song} onPlay={() => playSong(song.id, songs.slice(5,8))} />
                    ))}
                  </div>
                </section>
                </div>
            );
        case 'Songs':
            return <SongListView songs={songs} playSong={playSong} toggleLike={toggleLike} likedSongs={likedSongs} />;
        case 'Liked Songs':
            return (
              <div>
                <div className="p-6 flex items-end gap-6 bg-gradient-to-b from-indigo-700 to-neutral-900 h-60">
                   <div className="w-48 h-48 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md shadow-2xl">
                       <HeartIcon className="w-20 h-20 text-white" />
                   </div>
                   <div>
                       <p className="text-sm font-bold">PLAYLIST</p>
                       <h1 className="text-7xl font-extrabold text-white">Liked Songs</h1>
                       <p className="mt-2 text-neutral-300">{songs.length} songs</p>
                   </div>
                </div>
                 {songs.length > 0 ? (
                    <SongListView songs={songs} playSong={playSong} toggleLike={toggleLike} likedSongs={likedSongs} />
                ) : (
                    <p className="p-6 text-neutral-400">Songs you like will appear here.</p>
                )}
              </div>
            );
        case 'Playlists':
            return <PlaceholderView title="Playlists" />;
        case 'Artists':
            return <PlaceholderView title="Artists" />;
        case 'Albums':
            return <PlaceholderView title="Albums" />;
        default:
            return <PlaceholderView title="Coming Soon" />;
    }
  }

  return (
    <div className="flex-grow bg-neutral-900 rounded-lg m-2 ml-0 overflow-y-auto">
      <header className="sticky top-0 bg-neutral-900/70 backdrop-blur-xl z-20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <button className="bg-black/50 rounded-full p-1.5"><ChevronLeftIcon className="w-6 h-6 text-neutral-400" /></button>
            <button className="bg-black/50 rounded-full p-1.5"><ChevronRightIcon className="w-6 h-6 text-neutral-400" /></button>
            <div className="relative ml-4">
                <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input 
                    type="text" 
                    placeholder="What do you want to listen to?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-neutral-800 rounded-full py-2 pl-10 pr-4 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
            </div>
        </div>
        <div className="flex items-center gap-4 relative" ref={menuRef}>
            <div className="bg-black/50 p-1 rounded-full flex items-center justify-center w-8 h-8 cursor-pointer">
                <span className="font-bold text-sm">A</span>
            </div>
             <button onClick={() => setIsMenuOpen(o => !o)} className="bg-black/50 rounded-full p-1.5"><DotsVerticalIcon className="w-6 h-6 text-neutral-400" /></button>
             {isMenuOpen && (
                <div className="absolute top-10 right-0 bg-neutral-800 text-white rounded-md shadow-lg w-48 py-2 z-30">
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-neutral-700">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-neutral-700">Feedback</a>
                     <a href="#" className="block px-4 py-2 text-sm hover:bg-neutral-700">Contact Us</a>
                </div>
             )}
        </div>
      </header>

      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default MainView;

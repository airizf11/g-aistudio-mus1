
export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverArtUrl: string;
  audioUrl: string;
  isLiked?: boolean;
}

export interface Artist {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  coverArtUrl: string;
  songs: Song[];
}

export interface Playlist {
  id: number;
  name: string;
  description: string;
  coverArtUrl: string;
  songs: Song[];
}

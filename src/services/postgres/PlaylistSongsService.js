const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist({ playlistId, songId }) {
    await this.verifySongId(songId);

    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongsInPlaylist(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id AS id, playlists.name AS name, users.username AS username 
      FROM playlists 
      LEFT JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const playlistQueryResult = await this._pool.query(playlistQuery);

    if (!playlistQueryResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = playlistQueryResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id AS id, songs.title AS title, songs.performer AS performer
      FROM songs
      LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id
      LEFT JOIN playlists ON playlist_songs.playlist_id = playlists.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const songsQueryResult = await this._pool.query(songsQuery);

    if (!songsQueryResult.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const songs = songsQueryResult.rows;

    return { ...playlist, songs };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    console.log(result);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Lagu gagal dihapus dari playlist. Id tidak ditemukan'
      );
    }
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;

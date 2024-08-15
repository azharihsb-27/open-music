const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivity({ playlistId, songId, userId, action }) {
    const id = `playlist-activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Aktivitas playlist gagal ditambahkan');
    }
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_activities.action, playlist_activities.time 
      FROM playlist_activities,
      JOIN users ON playlist_activities.user_id = users.id
      JOIN songs ON playlist_activities.song_id = songs.id
      WHERE playlist_activities.playlist_id = $1
      ORDER BY playlist_activities.action`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    return {
      playlistId,
      activities: result.rows,
    };
  }
}

module.exports = PlaylistActivitiesService;

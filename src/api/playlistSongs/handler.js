class PlaylistSongsHandler {
  constructor(
    playlistSongsService,
    playlistsService,
    playlistActivitiesService,
    validator
  ) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._playlistActivitiesService = playlistActivitiesService;
    this._validator = validator;
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const action = 'add';

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.addSongToPlaylist({ playlistId, songId });
    await this._playlistActivitiesService.addPlaylistActivity({
      playlistId,
      songId,
      userId: credentialId,
      action,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistsHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistSongsService.getSongsInPlaylist(
      playlistId
    );

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongFromPlaylistByIdHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const action = 'delete';

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);
    await this._playlistActivitiesService.addPlaylistActivity({
      playlistId,
      songId,
      userId: credentialId,
      action,
    });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;

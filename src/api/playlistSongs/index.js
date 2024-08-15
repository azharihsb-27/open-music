const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistSongsService,
      playlistsService,
      playlistActivitiesService,
      validator,
    }
  ) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongsService,
      playlistsService,
      playlistActivitiesService,
      validator
    );
    server.route(routes(playlistSongsHandler));
  },
};

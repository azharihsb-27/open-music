const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/activities',
    handler: (request) => handler.getPlaylistActivitiesHandler(request),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;

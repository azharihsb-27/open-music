const Joi = require('joi');

const playlistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { playlistSongPayloadSchema };

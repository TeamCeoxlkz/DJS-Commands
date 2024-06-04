
const { ActivityType } = require('discord.js');

let status = [
  {
    name: 'Wiingbot',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    name: 'rpc',
    type: ActivityType.Playing,
    url: 'https://discord.com/channels/1101547488734875829/1131353911429701773',
  },
  {
    name: '/help',
  },
  {
    name: '/network',
  },
  {
    name: '/hire',
  },
  {
    name: '[WG] Live Stage',
    type: ActivityType.Listening,
    url:'https://discord.com/channels/1101547488734875829/1112790844731306095',
    
  },
];

module.exports = (client) => {
  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 10000);
};
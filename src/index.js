const { Client, IntentsBitField } = require('discord.js');
const { CommandKit } = require('commandkit');
const mogoose = require('mongoose')
require('dotenv/config');
const path = require('path');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
  ],
});

// Load the random status event from random-status.js
require('./events/ready/random-status')(client);

new CommandKit({
  client,
  commandsPath: `${__dirname}/commands`,
  eventsPath: `${__dirname}/events`,
  
});

mogoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");

  client.login(process.env.TOKEN);
});

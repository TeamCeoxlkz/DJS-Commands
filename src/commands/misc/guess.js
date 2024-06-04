const { SlashCommandBuilder, EmbedBuilder, MessageActionRow, MessageSelectMenu } = require('discord.js');

const words = ['banana', 'elephant', 'mountain', 'sunset', 'starlight', 'apple', 'ocean', 'forest', 'moon', 'fire', 'water', 'cloud', 'earth', 'rainbow', 'music', 'sun', 'bird', 'flower', 'butterfly', 'book'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Guess the word'),
  
  run: async ({ interaction }) => {
    const maxWords = 20;
    const maxGuessedWords = 4;

    // Ask how many words to put in the list
    await interaction.reply("How many words should be in the list? (Max 20)");
    const wordsFilter = (response) => {
      return !isNaN(response.content) && parseInt(response.content) > 0 && parseInt(response.content) <= maxWords;
    };
    const wordsCollector = interaction.channel.createMessageCollector({
      filter: wordsFilter,
      time: 30000, // 30 seconds to answer
      max: 1, // Only accept one answer
    });

    let numWords = 0;
    wordsCollector.on('collect', (response) => {
      numWords = parseInt(response.content);
    });

    wordsCollector.on('end', async () => {
      if (numWords === 0) {
        await interaction.followUp('Invalid input or no response received. The game has been canceled.');
        return;
      }

      // Ask how many guessed words
      await interaction.followUp(`How many guessed words should be allowed? (Max ${maxGuessedWords})`);
      const guessedWordsFilter = (response) => {
        return !isNaN(response.content) && parseInt(response.content) >= 0 && parseInt(response.content) <= maxGuessedWords;
      };
      const guessedWordsCollector = interaction.channel.createMessageCollector({
        filter: guessedWordsFilter,
        time: 30000, // 30 seconds to answer
        max: 1, // Only accept one answer
      });

      let numGuessedWords = 0;
      guessedWordsCollector.on('collect', (response) => {
        numGuessedWords = parseInt(response.content);
      });

      guessedWordsCollector.on('end', async () => {
        if (numGuessedWords === 0) {
          await interaction.followUp('Invalid input or no response received. The game has been canceled.');
          return;
        }

        // Ask how many seconds for guessing
        await interaction.followUp("How many seconds should be allowed for guessing? (Between 10 and 20 seconds)");
        const timeFilter = (response) => {
          return !isNaN(response.content) && parseInt(response.content) >= 10 && parseInt(response.content) <= 20;
        };
        const timeCollector = interaction.channel.createMessageCollector({
          filter: timeFilter,
          time: 30000, // 30 seconds to answer
          max: 1, // Only accept one answer
        });

        let guessingTime = 0;
        timeCollector.on('collect', (response) => {
          guessingTime = parseInt(response.content) * 1000; // Convert to milliseconds
        });

        timeCollector.on('end', async () => {
          if (guessingTime === 0) {
            await interaction.followUp('Invalid input or no response received. The game has been canceled.');
            return;
          }

          // Select random words for the list
          const selectedWords = [];
          while (selectedWords.length < numWords) {
            const word = words[Math.floor(Math.random() * words.length)];
            if (!selectedWords.includes(word)) {
              selectedWords.push(word);
            }
          }

          const selectedAnswers = [];
          while (selectedAnswers.length < numGuessedWords) {
            const answer = selectedWords[Math.floor(Math.random() * selectedWords.length)];
            if (!selectedAnswers.includes(answer)) {
              selectedAnswers.push(answer);
            }
          }

          const wordListEmbed = new EmbedBuilder()
          .setTitle('Guess the Word')
          .setDescription('Game started! Guess a word from the following list:')
          .setColor(2829617); // Set the embed color (you can change this)
        
        const maxInlineWords = 7; // Change this to the desired number of words per inline
        for (let i = 0; i < selectedWords.length; i += maxInlineWords) {
          const wordsChunk = selectedWords.slice(i, i + maxInlineWords);
          wordListEmbed.addFields({ name: "Words:", value: wordsChunk.map(word => `• ${word}`).join('\n'), inline: true });
        }
        
        await interaction.followUp({ embeds: [wordListEmbed] });

          const collector = interaction.channel.createMessageCollector({
            filter: (message) => selectedAnswers.includes(message.content) && message.channelId === interaction.channelId,
            time: guessingTime,
          });

          let answered = false;

          collector.on('collect', (message) => {
            if (selectedAnswers.includes(message.content)) {
              message.reply("You correctly guessed the word!");

              answered = true;
              collector.stop();
            }
          });

          collector.on('end', () => {
            if (!answered) {
              interaction.channel.send(`No one guessed the word correctly. The answers were **${selectedAnswers.join(', ')}**`);
            }
          });
        });
      });
    });
  },
};

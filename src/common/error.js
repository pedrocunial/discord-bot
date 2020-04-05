export class DiscordError extends Error {
  constructor(discordMessage, ...args) {
    super(args);
    this.discordMessage = discordMessage;
  }
}
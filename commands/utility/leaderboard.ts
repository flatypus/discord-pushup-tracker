import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import type { Users } from "../../types";

const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Shows the pushup leaderboard");

async function execute(interaction: any) {
  const file = Bun.file("./data.json");
  const text = await file.text();
  const data: { users: Users } = JSON.parse(text);
  if (!data?.users || Object.keys(data.users).length === 0) {
    return await interaction.reply("No users found in the database!");
  }

  const leaderboard = Object.entries(data.users)
    .sort((a, b) => b[1].pushups - a[1].pushups)
    .map(([id, { username, pushups, completed }], index) => {
      return `${
        index + 1
      }. \*\*${username}\*\* - \`${pushups}\` pushups to do, \`${completed}\` completed`;
    });

  const embed = new EmbedBuilder()
    .setColor([0, 0, 255])
    .setTitle("Pushup Leaderboard!")
    .setDescription(leaderboard.join("\n"));

  await interaction.reply({ embeds: [embed] });
}

export { data, execute };

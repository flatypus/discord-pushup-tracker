import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";

const data = new SlashCommandBuilder()
  .setName("unassign")
  .setDescription("Unassigns pushups for a user")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to add").setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("pushups")
      .setDescription("The number of pushups to unassign")
      .setMinValue(1)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for unassigning pushups")
      .setRequired(false),
  );

async function execute(interaction: any) {
  const { options } = interaction;
  const userOption = options.getUser("user");
  const pushups = options.getInteger("pushups");
  const reason = options.getString("reason");
  const { id } = userOption;
  const file = Bun.file("./data.json");
  const text = await file.text();
  const data = JSON.parse(text);

  let amount;
  if (data.users[id]) {
    data.users[id].pushups = Math.max(data.users[id].pushups - pushups, 0);
    amount = data.users[id].pushups;
  } else {
    await interaction.reply(
      "User doesn't even have pushups, what are you doing?",
    );
  }

  const embed = new EmbedBuilder()
    .setColor([255, 0, 0])
    .setTitle("Pushups Unassigned")
    .setDescription(
      `Unassigned \`${pushups}\` pushups from <@${id}>'s total${
        reason ? ` for \`${reason}\`` : " "
      }. They now have \`${amount}\` pushups to do!`,
    );

  Bun.write("./data.json", JSON.stringify(data));
  await interaction.reply({ embeds: [embed] });
}

export { data, execute };

import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";

const data = new SlashCommandBuilder()
  .setName("assign")
  .setDescription("Assigns pushups for a user")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to add").setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("pushups")
      .setDescription("The number of pushups to assign")
      .setMinValue(1)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for assigning pushups")
      .setRequired(false),
  );

async function execute(interaction: any) {
  const { options } = interaction;
  const userOption = options.getUser("user");
  const pushups = options.getInteger("pushups");
  const reason = options.getString("reason");
  const { id, username } = userOption;
  const file = Bun.file("./data.json");
  const text = await file.text();
  const data = JSON.parse(text);

  let amount;
  if (data.users[id]) {
    data.users[id].pushups += pushups;
    amount = data.users[id].pushups;
  } else {
    data.users[id] = { username, pushups: pushups, completed: 0 };
    amount = pushups;
  }

  const embed = new EmbedBuilder()
    .setColor([255, 0, 0])
    .setTitle("Pushups Assigned")
    .setDescription(
      `Assigned \`${pushups}\` pushups to <@${id}>'s total${
        reason ? ` for \`${reason}\`` : " "
      }. They now have \`${amount}\` pushups to do!`,
    );

  Bun.write("./data.json", JSON.stringify(data));
  await interaction.reply({ embeds: [embed] });
}

export { data, execute };

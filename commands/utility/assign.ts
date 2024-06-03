import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";

const data = new SlashCommandBuilder()
  .setName("assign")
  .setDescription("Assigns pushups for a user")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to add").setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("integer")
      .setDescription("The number of pushups to assign")
      .setMinValue(0)
      .setRequired(true),
  );

async function execute(interaction: any) {
  const { options } = interaction;
  const userOption = options.getUser("user");
  const integer = options.getInteger("integer");
  const { id, username } = userOption;
  const file = Bun.file("./data.json");
  const text = await file.text();
  const data = JSON.parse(text);

  let amount;
  if (data.users[id]) {
    data.users[id].pushups += integer;
    amount = data.users[id].pushups;
  } else {
    data.users[id] = { username, pushups: integer, completed: 0 };
    amount = integer;
  }

  const embed = new EmbedBuilder()
    .setColor([255, 0, 0])
    .setTitle("Pushups Assigned")
    .setDescription(
      `Assigned \`${integer}\` pushups to \`${username}\`'s total. They now have \`${amount}\` pushups to do!`,
    );

  Bun.write("./data.json", JSON.stringify(data));
  await interaction.reply({ embeds: [embed] });
}

export { data, execute };

import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";

const data = new SlashCommandBuilder()
  .setName("complete")
  .setDescription("Completes pushups for a user")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to add").setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("integer")
      .setDescription("Number of pushups completed")
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
  let completed;
  if (data.users[id]) {
    data.users[id].pushups = Math.max(data.users[id].pushups - integer, 0);
    data.users[id].completed += integer;
    completed = data.users[id].completed;
    amount = data.users[id].pushups;
  } else {
    await interaction.reply(
      "User doesn't even have pushups, what are you doing?",
    );
  }

  const embed = new EmbedBuilder()
    .setColor([0, 255, 0])
    .setTitle("Pushups Completed")
    .setDescription(
      `\`${username}\` has completed \`${integer}\` pushups. They now have \`${amount}\` pushups to do and have completed a total of \`${completed}\` pushups!`,
    );

  Bun.write("./data.json", JSON.stringify(data));
  await interaction.reply({ embeds: [embed] });
}

export { data, execute };

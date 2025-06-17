const { SectionBuilder, TextDisplayBuilder, ComponentType } = require("discord.js");

function SectionUser(client, namePainel) {
    
    const return2 = new SectionBuilder({
        components: [new TextDisplayBuilder({
            content: `## Informações da Aplicação\n- *Nome da Aplicação*: ${client.user} (\`${client.user.id}\`)\n## ${namePainel}`,
        })],
        accessory: {
            type: ComponentType.Thumbnail,
            media: {
                url: `${client.user.displayAvatarURL({ dynamic: true })}`,
            }
        }
    });

    return return2;
    
}

module.exports = {
    SectionUser,
};
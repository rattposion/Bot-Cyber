


module.exports = {
    name: 'messageCreate',

    run: async (message, client) => {
        let channelprefix = client.db.General.get(`ConfigGeral.ChannelsConfig.feedbacks`);
        if (message.channel.id == channelprefix) {
            if (client.db.General.get('ConfigGeral.AutoReact.emoji') == null) return;
            if (client.db.General.get('ConfigGeral.AutoReact.status') !== true) return;
            try {
                await message.react(client.db.General.get('ConfigGeral.AutoReact.emoji'))
            } catch (error) {
                client.db.General.set('ConfigGeral.AutoReact.status', false);
                client.db.General.delete('ConfigGeral.AutoReact.emoji');
            }
        }
    }
}
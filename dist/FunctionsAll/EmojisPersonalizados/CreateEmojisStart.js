const axios = require("axios");
const AllEmojis = require("../EmojisPersonalizados/emojis.json");

class EmojiManager {
  constructor(client) {
    this.client = client;
    this.cache = new Map();
    this.rateLimitQueue = [];
    this.isProcessingQueue = false;
    this.baseURL = `https://discord.com/api/v9/applications/${client.user.id}/emojis`;
    this.headers = { Authorization: `Bot ${client.token}` };
  }

  async init() {
    await this.loadCachedEmojis();
    await this.syncEmojis();
  }

  async loadCachedEmojis() {
    const cachedEmojis = this.client.db.General.get('emojis') || {};
    for (const [name, emojiString] of Object.entries(cachedEmojis)) {
      this.cache.set(name, emojiString);
    }
    global.emoji = cachedEmojis;
  }

  async fetchEmojis() {
    try {
      const { data } = await axios.get(this.baseURL, { headers: this.headers });
      return data.items || [];
    } catch (error) {
      console.error("[EMOJI_MANAGER] Falha ao buscar emojis:", error.message);
      return [];
    }
  }

  async processQueue() {
    if (this.isProcessingQueue || this.rateLimitQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.rateLimitQueue.length > 0) {
      const task = this.rateLimitQueue.shift();
      try {
        await task();
        await this.delay(1000);
      } catch (error) {
        console.error("[EMOJI_MANAGER] Erro ao processar tarefa:", error.message);
      }
    }
    
    this.isProcessingQueue = false;
  }

  async createEmojiRequest(name, imageData) {
    return new Promise((resolve) => {
      const task = async () => {
        try {
          const { data } = await axios.post(this.baseURL, 
            { name, image: imageData }, 
            { headers: this.headers }
          );
          
          const emojiString = data.animated ? `<a:${name}:${data.id}>` : `<:${name}:${data.id}>`;
          this.updateCache(name, emojiString);
          resolve(emojiString);
        } catch (error) {
          await this.handleCreateEmojiError(error, name, imageData, resolve);
        }
      };
      
      this.rateLimitQueue.push(task);
      this.processQueue();
    });
  }

  async handleCreateEmojiError(error, name, imageData, resolve) {
    const response = error.response;
    
    if (response?.data?.message === 'You are being rate limited.') {
      const retryAfter = response.data.retry_after * 1000;
      await this.delay(retryAfter);
      return this.createEmojiRequest(name, imageData);
    }
    
    if (response?.status === 500) {
      await this.delay(2000);
      return this.createEmojiRequest(name, imageData);
    }
    
    console.error(`[EMOJI_MANAGER] Erro ao criar emoji ${name}:`, error.message);
    resolve(null);
  }

  async convertImageToBase64(url) {
    try {
      const { data, headers } = await axios.get(url, { responseType: "arraybuffer" });
      const mimeType = headers["content-type"];
      return `data:${mimeType};base64,${Buffer.from(data).toString("base64")}`;
    } catch (error) {
      console.error("[EMOJI_MANAGER] Erro ao converter imagem:", error.message);
      return null;
    }
  }

  updateCache(name, emojiString) {
    this.cache.set(name, emojiString);
    this.client.db.General.set(`emojis.${name}`, emojiString);
    global.emoji = this.client.db.General.get('emojis');
  }

  async syncEmojis() {
    const [currentEmojis, requiredEmojis] = await Promise.all([
      this.fetchEmojis(),
      Promise.resolve(AllEmojis)
    ]);

    const existingNames = new Set(currentEmojis.map(e => e.name));
    
    currentEmojis.forEach(emoji => {
      const emojiString = emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`;
      this.updateCache(emoji.name, emojiString);
    });

    const missingEmojis = requiredEmojis.filter(e => !existingNames.has(e.name));
    
    if (missingEmojis.length === 0) {
      return;
    }


    const createPromises = missingEmojis.map(async (emoji) => {
      const imageData = emoji.image.startsWith("data:image/") 
        ? emoji.image 
        : await this.convertImageToBase64(emoji.image);
      
      if (!imageData) return null;
      return this.createEmojiRequest(emoji.name, imageData);
    });

    await Promise.allSettled(createPromises);
  }

  async getEmoji(name) {
    if (this.cache.has(name)) {
      return this.cache.get(name);
    }

    const currentEmojis = await this.fetchEmojis();
    const existingEmoji = currentEmojis.find(e => e.name === name);
    
    if (existingEmoji) {
      const emojiString = existingEmoji.animated 
        ? `<a:${name}:${existingEmoji.id}>` 
        : `<:${name}:${existingEmoji.id}>`;
      this.updateCache(name, emojiString);
      return emojiString;
    }

    const emojiData = AllEmojis.find(e => e.name === name);
    if (!emojiData) return null;

    const imageData = emojiData.image.startsWith("data:image/") 
      ? emojiData.image 
      : await this.convertImageToBase64(emojiData.image);
    
    if (!imageData) return null;
    return await this.createEmojiRequest(name, imageData);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

let emojiManager;

async function initEmojiSystem(client) {
  emojiManager = new EmojiManager(client);
  await emojiManager.init();
}

async function GetEmoji(client, name) {
  if (!emojiManager) {
    emojiManager = new EmojiManager(client);
    await emojiManager.loadCachedEmojis();
  }
  return await emojiManager.getEmoji(name);
}

async function syncEmojis(client) {
  if (!emojiManager) {
    emojiManager = new EmojiManager(client);
  }
  await emojiManager.syncEmojis();
}

module.exports = { GetEmoji, syncEmojis, initEmojiSystem };
const fs = require('node:fs');
const path = require('path');

class Permissions {
    constructor() {
        this.jsonPath = path.join(__dirname, '..', '..', 'deploy.json');
        this.permissions = [];
        this.loadPermissions();
    }

    loadPermissions() {
        try {
            if (fs.existsSync(this.jsonPath)) {
                const data = fs.readFileSync(this.jsonPath, 'utf8');
                const json = JSON.parse(data);
                this.permissions = json.permissions || [];
                console.log('Permissões carregadas:', this.permissions);
            } else {
                console.error('Arquivo JSON não encontrado:', this.jsonPath);
            }
        } catch (err) {
            console.error('Erro ao carregar as permissões:', err);
            this.permissions = [];
        }
    }

    /**
     * Verifica se o usuário tem permissão
     * @param {string} userId - ID do usuário
     * @returns {boolean}
     */
    get(userId) {
        return this.permissions.includes(String(userId));
    }

    reload() {
        this.loadPermissions();
    }
}

module.exports = Permissions;

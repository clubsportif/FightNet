/**
 * Formulaire FIGHT NET - Gestion des sports et envoi
 */
class FightNetForm {
    constructor() {
        this.selectedSports = new Map();
        this.sportsData = this.getSportsData();
        this.init();
    }

    /**
     * Données des sports disponibles
     */
    getSportsData() {
        return [
            {
                id: 'tennis',
                name: 'Tennis',
                icon: 'fas fa-baseball-ball',
                color: '#e74c3c',
                description: 'Sport de raquette',
                levels: [
                    { id: 'debutant', name: 'Débutant' },
                    { id: 'intermediaire', name: 'Intermédiaire' },
                    { id: 'avance', name: 'Avancé' }
                ]
            },
            {
                id: 'padel',
                name: 'Padel',
                icon: 'fas fa-square',
                color: '#3498db',
                description: 'Mélange tennis/squash',
                levels: [
                    { id: 'debutant', name: 'Débutant' },
                    { id: 'intermediaire', name: 'Intermédiaire' },
                    { id: 'avance', name: 'Avancé' }
                ]
            },
            {
                id: 'badminton',
                name: 'Badminton',
                icon: 'fas fa-feather-alt',
                color: '#2ecc71',
                description: 'Rapide et technique',
                levels: [
                    { id: 'debutant', name: 'Débutant' },
                    { id: 'intermediaire', name: 'Intermédiaire' },
                    { id: 'avance', name: 'Avancé' }
                ]
            },
            {
                id: 'pingpong',
                name: 'Ping-Pong',
                icon: 'fas fa-table-tennis',
                color: '#f39c12',
                description: 'Tennis de table',
                levels: [
                    { id: 'debutant', name: 'Débutant' },
                    { id: 'intermediaire', name: 'Intermédiaire' },
                    { id: 'avance', name: 'Avancé' }
                ]
            }
        ];
    }

    /**
     * Initialisation
     */
    init() {
        this.renderSports();
        this.setupEvents();
        this.updateSummary();
    }

    /**
     * Affichage des sports
     */
    renderSports() {
        const container = document.getElementById('sportsContainer');
        
        this.sportsData.forEach(sport => {
            const sportElement = this.createSportElement(sport);
            container.appendChild(sportElement);
        });
    }

    /**
     * Création d'un élément sport
     */
    createSportElement(sport) {
        const div = document.createElement('div');
        div.className = 'sport-option';
        div.innerHTML = `
            <div class="sport-header" data-sport="${sport.id}">
                <div class="sport-checkbox"></div>
                <div class="sport-icon" style="background: ${sport.color}">
                    <i class="${sport.icon}"></i>
                </div>
                <div class="sport-info">
                    <h4>${sport.name}</h4>
                    <div class="sport-description">${sport.description}</div>
                </div>
            </div>
            <div class="sport-levels" id="levels-${sport.id}" style="display: none;">
                ${sport.levels.map(level => `
                    <div class="level-option">
                        <input type="radio" id="${sport.id}-${level.id}" name="level-${sport.id}" value="${level.id}">
                        <label for="${sport.id}-${level.id}">${level.name}</label>
                    </div>
                `).join('')}
            </div>
        `;
        return div;
    }

    /**
     * Configuration des événements
     */
    setupEvents() {
        // Sélection des sports
        document.addEventListener('click', (e) => {
            const sportHeader = e.target.closest('.sport-header');
            if (sportHeader) {
                this.toggleSport(sportHeader);
            }

            // Sélection des niveaux
            const levelInput = e.target.closest('input[type="radio"]');
            if (levelInput) {
                this.selectLevel(levelInput);
            }
        });

        // Soumission du formulaire
        document.getElementById('membershipForm').addEventListener('submit', (e) => {
            this.submitForm(e);
        });
    }

    /**
     * Sélection/désélection d'un sport
     */
    toggleSport(sportHeader) {
        const sportId = sportHeader.getAttribute('data-sport');
        const sportElement = sportHeader.closest('.sport-option');
        const levelsContainer = document.getElementById(`levels-${sportId}`);
        
        if (this.selectedSports.has(sportId)) {
            this.selectedSports.delete(sportId);
            sportElement.classList.remove('selected');
            levelsContainer.style.display = 'none';
        } else {
            const sportData = this.sportsData.find(s => s.id === sportId);
            this.selectedSports.set(sportId, {
                ...sportData,
                selectedLevel: null
            });
            sportElement.classList.add('selected');
            levelsContainer.style.display = 'grid';
        }
        
        this.updateSummary();
    }

    /**
     * Sélection d'un niveau
     */
    selectLevel(levelInput) {
        const [sportId, levelId] = levelInput.id.split('-');
        
        if (this.selectedSports.has(sportId)) {
            const sport = this.selectedSports.get(sportId);
            const level = sport.levels.find(l => l.id === levelId);
            
            this.selectedSports.set(sportId, {
                ...sport,
                selectedLevel: level
            });
            
            this.updateSummary();
        }
    }

    /**
     * Mise à jour du résumé
     */
    updateSummary() {
        const summary = document.getElementById('formSummary');
        
        if (this.selectedSports.size === 0) {
            summary.innerHTML = '<p>Sélectionnez au moins un sport</p>';
            return;
        }
        
        let html = '';
        this.selectedSports.forEach((sport, sportId) => {
            const levelText = sport.selectedLevel ? 
                ` - Niveau ${sport.selectedLevel.name}` : 
                ' - <span style="color: #e74c3c;">Choisir niveau</span>';
            
            html += `
                <div class="sport-summary">
                    <div class="summary-label">${sport.name}${levelText}</div>
                </div>
            `;
        });
        
        summary.innerHTML = html;
    }

    /**
     * Soumission du formulaire
     */
    async submitForm(e) {
        e.preventDefault();
        
        // Validation de base
        if (!this.validateForm()) {
            this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        // Validation sports
        if (this.selectedSports.size === 0) {
            this.showMessage('Veuillez sélectionner au moins un sport', 'error');
            return;
        }

        // Validation niveaux
        for (let [sportId, sport] of this.selectedSports) {
            if (!sport.selectedLevel) {
                this.showMessage(`Veuillez sélectionner un niveau pour ${sport.name}`, 'error');
                return;
            }
        }

        // Préparation données
        this.prepareFormData();

        // Envoi
        await this.sendForm();
    }

    /**
     * Validation du formulaire
     */
    validateForm() {
        const required = document.querySelectorAll('#membershipForm [required]');
        let valid = true;
        
        required.forEach(field => {
            if (!field.value.trim()) {
                valid = false;
                field.style.borderColor = '#e74c3c';
            } else {
                field.style.borderColor = '';
            }
        });
        
        return valid;
    }

    /**
     * Préparation des données pour Formspree
     */
    prepareFormData() {
        const form = document.getElementById('membershipForm');
        
        // Sports sélectionnés
        this.selectedSports.forEach((sport, sportId) => {
            let input = form.querySelector(`[name="sport-${sportId}"]`);
            if (!input) {
                input = document.createElement('input');
                input.type = 'hidden';
                input.name = `sport-${sportId}`;
                form.appendChild(input);
            }
            input.value = `${sport.name} - Niveau ${sport.selectedLevel.name}`;
        });

        // Sujet email
        let subject = form.querySelector('[name="_subject"]');
        if (!subject) {
            subject = document.createElement('input');
            subject.type = 'hidden';
            subject.name = '_subject';
            form.appendChild(subject);
        }
        subject.value = `Inscription - ${document.getElementById('fullName').value}`;
    }

    /**
     * Envoi du formulaire
     */
    async sendForm() {
        const form = document.getElementById('membershipForm');
        const button = document.getElementById('submitBtn');
        const originalText = button.innerHTML;
        
        // État chargement
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                this.showSuccess();
            } else {
                throw new Error('Erreur envoi');
            }
            
        } catch (error) {
            this.showMessage('Erreur lors de l\'envoi', 'error');
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }

    /**
     * Affichage succès
     */
    showSuccess() {
        const form = document.getElementById('membershipForm');
        form.innerHTML = `
            <div class="form-success">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h2>Félicitations !</h2>
                <p>Votre candidature a été envoyée.</p>
                <p>Nous vous contacterons rapidement.</p>
                <div class="success-actions">
                    <a href="index.html" class="btn primary">
                        <i class="fas fa-home"></i>
                        Accueil
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Message temporaire
     */
    showMessage(message, type) {
        const div = document.createElement('div');
        div.textContent = message;
        div.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
        `;
        
        document.body.appendChild(div);
        
        setTimeout(() => {
            div.remove();
        }, 4000);
    }
}

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
    new FightNetForm();
});
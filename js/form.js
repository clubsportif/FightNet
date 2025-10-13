// Fonction pour afficher/masquer les niveaux
function toggleLevels(sportId) {
    const checkbox = document.getElementById(`sport-${sportId}`);
    const levels = document.getElementById(`levels-${sportId}`);
    
    if (checkbox.checked) {
        levels.style.display = 'grid';
    } else {
        levels.style.display = 'none';
        // Réinitialiser les sélections de niveau
        const levelInputs = levels.querySelectorAll('input[type="radio"]');
        levelInputs.forEach(input => input.checked = false);
    }
}

// Fonction pour afficher/masquer le champ "autre filière"
function toggleAutreFiliere() {
    const filiereSelect = document.getElementById('filiere');
    const autreFiliereGroup = document.getElementById('autreFiliereGroup');
    const autreFiliereInput = document.getElementById('autreFiliere');
    
    if (filiereSelect.value === 'autre') {
        autreFiliereGroup.style.display = 'block';
        autreFiliereInput.required = true;
    } else {
        autreFiliereGroup.style.display = 'none';
        autreFiliereInput.required = false;
        autreFiliereInput.value = '';
    }
}

// Fonction pour afficher le message de succès
function showSuccess() {
    const form = document.getElementById('membershipForm');
    form.innerHTML = `
        <div class="form-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Merci pour votre inscription !</h2>
            <p class="success-main">Votre candidature a été envoyée avec succès.</p>
            <p class="success-sub">Nous vous contacterons dans les plus brefs délais.</p>
        </div>
    `;
}

// Validation et envoi du formulaire
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('membershipForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let isValid = true;
        let message = '';

        // Vérifier qu'au moins un sport est sélectionné
        const sportsSelectionnes = document.querySelectorAll('input[type="checkbox"]:checked');
        if (sportsSelectionnes.length === 0) {
            isValid = false;
            message = 'Veuillez sélectionner au moins un sport';
        }

        // Vérifier que chaque sport sélectionné a un niveau
        if (isValid) {
            for (let sport of sportsSelectionnes) {
                const sportName = sport.name.replace('sport-', '');
                const niveauSelectionne = document.querySelector(`input[name="level-${sportName}"]:checked`);
                if (!niveauSelectionne) {
                    isValid = false;
                    message = `Veuillez sélectionner un niveau pour ${sport.value}`;
                    break;
                }
            }
        }

        if (!isValid) {
            alert(message);
            return;
        }

        // Afficher le chargement
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        try {
            // Envoyer le formulaire
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Afficher le message de succès
                showSuccess();
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});

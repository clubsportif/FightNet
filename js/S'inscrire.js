// Gestion du formulaire Formspree
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const status = document.getElementById('status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Désactiver le bouton pendant l'envoi
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span>Envoi en cours...';
        
        // Afficher le statut de chargement
        status.textContent = '⏳ Envoi en cours...';
        status.className = 'loading';
        
        try {
            // Envoyer le formulaire à Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Succès
                status.textContent = '✅ Inscription envoyée avec succès !';
                status.className = 'success';
                
                // Réinitialiser le formulaire après 2 secondes
                setTimeout(() => {
                    form.reset();
                    status.textContent = '';
                    status.className = '';
                }, 3000);
                
            } else {
                // Erreur du serveur
                throw new Error('Erreur serveur');
            }
            
        } catch (error) {
            // Erreur réseau ou autre
            console.error('Erreur:', error);
            status.textContent = '❌ Erreur lors de l\'envoi. Veuillez réessayer.';
            status.className = 'error';
            
        } finally {
            // Réactiver le bouton
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Gestion du bouton Effacer
    const resetBtn = form.querySelector('button[type="reset"]');
    resetBtn.addEventListener('click', function() {
        status.textContent = '';
        status.className = '';
    });

    // Validation en temps réel
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = 'var(--error)';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = 'var(--success)';
            }
        });
    });
});

// Confirmation avant fermeture de la page si le formulaire est rempli
window.addEventListener('beforeunload', function(e) {
    const form = document.getElementById('registerForm');
    const formData = new FormData(form);
    let hasData = false;
    
    for (let value of formData.values()) {
        if (value) {
            hasData = true;
            break;
        }
    }
    
    if (hasData) {
        e.preventDefault();
        e.returnValue = 'Vous avez des données non sauvegardées. Êtes-vous sûr de vouloir quitter ?';
    }
});

// Animation d'entrée des éléments
document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
});
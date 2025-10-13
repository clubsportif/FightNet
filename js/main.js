// ========== APPLICATION PRINCIPALE FIGHT NET ==========
// Cette classe gère toutes les fonctionnalités interactives du site
class FightNetApp {
    constructor() {
        this.init();
    }

    // ========== INITIALISATION DE L'APPLICATION ==========
    init() {
        this.setupSmoothScrolling();
        this.setupInteractiveElements();
        this.setupBottomNav();
        this.setupAnimations();
        this.setupFormNavigation();
        this.initPhoneFormatting();
    }

    // ========== CONFIGURATION DU DÉFILEMENT FLUIDE ==========
    setupSmoothScrolling() {
        // Défilement fluide pour tous les liens d'ancrage
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Ne gère que les liens d'ancrage internes, pas les pages externes
                if (href === '#' || href.startsWith('#') && !href.includes('.html')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80;
                        const targetPosition = target.offsetTop - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ========== CONFIGURATION DES ÉLÉMENTS INTERACTIFS ==========
    setupInteractiveElements() {
        // Interactions des cartes de sport
        const sportCards = document.querySelectorAll('.sport-card');
        sportCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Ne déclenche pas si on clique sur le bouton d'action
                if (!e.target.closest('.action-btn')) {
                    this.showToast('Redirection vers les détails...');
                }
            });
        });

        // Boutons d'action
        const actionButtons = document.querySelectorAll('.action-btn, .event-action');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Empêche la propagation du clic
                this.showToast('Action en cours...');
                
                // Pour les boutons "Rejoindre", redirige vers le formulaire après un délai
                if (button.classList.contains('event-action') && button.textContent.includes('Rejoindre')) {
                    setTimeout(() => {
                        window.location.href = 'formulaire.html';
                    }, 1000);
                }
            });
        });

        // Boutons principaux dans la section hero
        const primaryButtons = document.querySelectorAll('.btn.primary');
        primaryButtons.forEach(button => {
            if (button.textContent.includes('Rejoindre')) {
                button.addEventListener('click', (e) => {
                    if (!button.getAttribute('href')) {
                        e.preventDefault();
                        this.showToast('Redirection vers le formulaire...');
                        setTimeout(() => {
                            window.location.href = 'formulaire.html';
                        }, 800);
                    }
                });
            }
        });

        // Effets de survol subtils pour le bureau
        if (window.innerWidth > 768) {
            sportCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-4px)';
                    card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = 'none';
                });
            });
        }
    }

    // ========== CONFIGURATION DE LA NAVIGATION INFÉRIEURE ==========
    setupBottomNav() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href');
                
                // Ne prévient le comportement par défaut que pour les liens d'ancrage
                if (href && href.startsWith('#') && !href.includes('.html')) {
                    e.preventDefault();
                    
                    // Met à jour l'état actif
                    navItems.forEach(nav => nav.classList.remove('active'));
                    item.classList.add('active');
                    
                    this.showToast(`Navigation vers ${item.querySelector('span').textContent}`);
                }
                // Pour la page de formulaire, laisse le lien fonctionner normalement
            });
        });
    }

    // ========== CONFIGURATION DE LA NAVIGATION DES FORMULAIRES ==========
    setupFormNavigation() {
        // Gestion du bouton retour dans la page de formulaire
        const backButton = document.querySelector('.menu-btn');
        if (backButton && backButton.querySelector('.fa-arrow-left')) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.back();
            });
        }

        // Gestion de la soumission des formulaires
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }

    // ========== CONFIGURATION DES ANIMATIONS ==========
    setupAnimations() {
        // Observateur d'intersection pour les animations d'apparition
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe les éléments à animer
        const elementsToAnimate = document.querySelectorAll('.sport-card, .lang-card, .event-item, .form-section');
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ========== GESTION DE LA SOUMISSION DES FORMULAIRES ==========
    handleFormSubmission(form) {
        // Affiche l'état de chargement
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;

        // Simule un appel API
        setTimeout(() => {
            this.showToast('Formulaire envoyé avec succès!', 'success');
            
            // Réinitialise le formulaire
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            // Redirige vers l'accueil après le succès
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        }, 2000);
    }

    // ========== AFFICHAGE DES MESSAGES TOAST ==========
    showToast(message, type = 'info') {
        // Supprime le toast existant
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Crée un nouveau toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Style basé sur le type
        const styles = {
            info: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white'
            },
            success: {
                background: 'var(--success)',
                color: 'white'
            },
            error: {
                background: 'var(--danger)',
                color: 'white'
            }
        };

        const style = styles[type] || styles.info;
        
        // Ajoute les styles
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${style.background};
            color: ${style.color};
            padding: 12px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            transition: transform 0.3s ease;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
            max-width: 300px;
            text-align: center;
        `;

        document.body.appendChild(toast);

        // Anime l'entrée
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);

        // Supprime après 3 secondes
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    // ========== FORMATAGE DES NUMÉROS DE TÉLÉPHONE ==========
    formatPhoneNumber(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('0')) {
                value = '+33' + value.substring(1);
            }
            
            // Format: +33 6 12 34 56 78
            if (value.length > 2) {
                value = value.replace(/(\+\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
            }
            
            e.target.value = value;
        });
    }

    // ========== INITIALISATION DU FORMATAGE DES TÉLÉPHONES ==========
    initPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            this.formatPhoneNumber(input);
        });
    }
}

// ========== INITIALISATION DE L'APPLICATION ==========
// Initialise l'app quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const app = new FightNetApp();
    console.log('Application Fight Net initialisée'); // Debug
});

// ========== GESTIONNAIRE D'ERREUR GLOBAL ==========
window.addEventListener('error', (e) => {
    console.error('Erreur globale:', e.error);
});

// ========== GESTION DES TRANSITIONS DE PAGE ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');
    const projectFilters = document.querySelectorAll('.projects-filter li');
    const projectItems = document.querySelectorAll('.project-item');
    
    // Sticky header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            hamburger.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation item on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Project filtering
    projectFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            projectFilters.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Form validation and submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Here you would typically send the form data to a server
            alert('Merci pour votre message ! Je vous contacterai bientôt.');
            
            // Reset form
            this.reset();
        });
    }
    
    // Gestion du bouton "Voir plus" pour les certifications
    const showMoreButton = document.getElementById('show-more-certs');
    
    if (showMoreButton) {
        showMoreButton.addEventListener('click', function() {
            const hiddenCerts = document.querySelectorAll('.hidden-cert');
            
            // Affiche toutes les certifications cachées
            hiddenCerts.forEach(cert => {
                cert.classList.remove('hidden-cert');
                cert.classList.add('show');
            });
            
            // Cache le bouton après avoir affiché toutes les certifications
            this.style.display = 'none';
        });
    }
    
    // Système pour afficher les images des certificats
    // Gestion des boutons de visualisation des certificats
    const viewCertButtons = document.querySelectorAll('.btn-view-cert');
    const certModal = document.getElementById('certModal');
    const certImage = document.getElementById('certImage');
    const closeBtn = document.querySelector('.cert-modal .close-btn');
    
    // Ouvrir la modal avec l'image du certificat
    if (viewCertButtons.length > 0 && certModal && certImage && closeBtn) {
        viewCertButtons.forEach(button => {
            button.addEventListener('click', function() {
                const certPath = this.getAttribute('data-cert');
                certImage.src = certPath;
                certModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Empêche le défilement
            });
        });
        
        // Fermer la modal
        closeBtn.addEventListener('click', function() {
            certModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Réactive le défilement
        });
        
        // Fermer la modal si on clique en dehors de l'image
        certModal.addEventListener('click', function(e) {
            if (e.target === certModal) {
                certModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Gestion du changement de langue
    // Fonction pour charger les traductions
    function loadTranslations(lang) {
        // Nettoyer l'objet de traduction existant
        window.translations = {};
        
        // Supprime le script précédent s'il existe
        const existingScript = document.getElementById('lang-script');
        if (existingScript) {
            existingScript.remove();
        }
        
        // Crée et ajoute un nouveau script
        const script = document.createElement('script');
        script.id = 'lang-script';
        script.src = `js/lang/${lang}.js`;
        script.onload = function() {
            // Vérifier que les traductions sont chargées
            if (!window.translations) {
                console.error(`Le fichier de traduction '${lang}.js' n'a pas défini window.translations correctement`);
                return;
            }
            
            updatePageContent();
            console.log(`Traduction chargée: ${lang}`, window.translations);
        };
        script.onerror = function() {
            console.error(`Erreur lors du chargement du fichier de traduction '${lang}.js'`);
        };
        document.head.appendChild(script);
    }
    
    // Fonction pour mettre à jour le contenu de la page
    function updatePageContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (window.translations && window.translations[key]) {
                // Pour éviter les problèmes avec le HTML dans les traductions
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = window.translations[key];
                } else {
                    element.innerHTML = window.translations[key];
                }
            }
        });
        
        // Debug: vérifier les éléments non traduits
        console.log("Éléments qui n'ont pas été traduits:");
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (!window.translations || !window.translations[key]) {
                console.log(`Clé manquante: ${key} pour l'élément:`, element);
            }
        });
    }
    
    // Gestionnaire pour chaque lien de langue
    const langLinks = document.querySelectorAll('.language-dropdown a');
    if (langLinks.length > 0) {
        langLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const lang = this.getAttribute('data-lang');
                if (!lang) return;
                
                // Met à jour le bouton de sélection
                const currentLangBtn = document.querySelector('.current-lang');
                if (currentLangBtn) {
                    currentLangBtn.innerHTML = lang.toUpperCase() + ' <i class="fas fa-chevron-down"></i>';
                }
                
                // Active ce lien
                langLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Applique la direction RTL pour l'arabe
                if (lang === 'ar') {
                    document.body.setAttribute('dir', 'rtl');
                    document.body.classList.add('rtl');
                } else {
                    document.body.setAttribute('dir', 'ltr');
                    document.body.classList.remove('rtl');
                }
                
                // Stocke la préférence
                localStorage.setItem('preferredLanguage', lang);
                
                // Charge les traductions
                loadTranslations(lang);
                
                console.log('Langue changée pour:', lang); // Pour débogage
            });
        });
        
        // Charge la langue préférée ou par défaut
        const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
        const langLink = document.querySelector(`.language-dropdown a[data-lang="${savedLang}"]`);
        if (langLink) {
            langLink.click();
        } else {
            loadTranslations('fr');
        }
    }
});
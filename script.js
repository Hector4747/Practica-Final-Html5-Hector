// Variables globales
let currentSlide = 0;
const portfolioItems = document.querySelectorAll('.portfolio-item');
const indicators = document.querySelectorAll('.indicator');

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Función principal de inicialización
function initializeWebsite() {
    setupNavigation();
    setupPortfolioCarousel();
    setupScrollAnimations();
    setupFormValidation();
    setupSmoothScrolling();
    setupHeaderScrollEffect();
    animateCounters();
    setupLazyLoading();
    setupTooltips();
}

// ========================
// NAVEGACIÓN MÓVIL
// ========================
function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle del menú hamburguesa
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Agregar aria-expanded para accesibilidad
            const isOpen = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            
            // Actualizar enlace activo
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ========================
// CARRUSEL DEL PORTAFOLIO
// ========================
function setupPortfolioCarousel() {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let autoPlayInterval;
    
    if (portfolioItems.length > 0) {
        // Mostrar el primer slide
        showSlide(0);
        
        // Event listeners para los botones
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = currentSlide > 0 ? currentSlide - 1 : portfolioItems.length - 1;
                showSlide(currentSlide);
                resetAutoPlay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = currentSlide < portfolioItems.length - 1 ? currentSlide + 1 : 0;
                showSlide(currentSlide);
                resetAutoPlay();
            });
        }
        
        // Event listeners para los indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                resetAutoPlay();
            });
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && prevBtn) {
                prevBtn.click();
            } else if (e.key === 'ArrowRight' && nextBtn) {
                nextBtn.click();
            }
        });
        
        // Auto-play del carrusel
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                currentSlide = currentSlide < portfolioItems.length - 1 ? currentSlide + 1 : 0;
                showSlide(currentSlide);
            }, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        // Pausar autoplay al hacer hover
        const carouselContainer = document.querySelector('.portfolio-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });

            carouselContainer.addEventListener('mouseleave', () => {
                startAutoPlay();
            });
        }

        startAutoPlay();
    }
}

function showSlide(index) {
    // Ocultar todos los slides
    portfolioItems.forEach((item, i) => {
        item.classList.remove('active');
        item.setAttribute('aria-hidden', i !== index);
    });
    
    // Desactivar todos los indicadores
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
        indicator.setAttribute('aria-pressed', 'false');
    });
    
    // Mostrar el slide actual
    if (portfolioItems[index]) {
        portfolioItems[index].classList.add('active');
        portfolioItems[index].setAttribute('aria-hidden', 'false');
    }
    
    // Activar el indicador actual
    if (indicators[index]) {
        indicators[index].classList.add('active');
        indicators[index].setAttribute('aria-pressed', 'true');
    }
}

// ========================
// ANIMACIONES DE SCROLL
// ========================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animar tarjetas de servicio con delay
                if (entry.target.classList.contains('service-card')) {
                    const cards = document.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }

                // Animar elementos con clase especial
                if (entry.target.classList.contains('fade-in-up')) {
                    entry.target.classList.add('animated');
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const elementsToAnimate = document.querySelectorAll('.service-card, .section-header, .about-text, .contact-item, .fade-in-up');
    elementsToAnimate.forEach(el => {
        if (!el.classList.contains('service-card')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        observer.observe(el);
    });
}

// ========================
// CONTADOR ANIMADO
// ========================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
                const increment = target / speed;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 1);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        // Guardar el valor original como data attribute si no existe
        if (!counter.getAttribute('data-target')) {
            counter.setAttribute('data-target', counter.textContent);
        }
        counter.textContent = '0';
        observer.observe(counter);
    });
}

// ========================
// VALIDACIÓN DEL FORMULARIO
// ========================
function setupFormValidation() {
    const form = document.querySelector('.contact-form');
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    if (form) {
        // Validación en tiempo real
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Envío del formulario
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                submitForm(form);
            }
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar errores previos
    clearFieldError(field);
    
    // Validaciones específicas
    switch (fieldName) {
        case 'name':
        case 'nom':
            if (value.length < 2) {
                errorMessage = 'El nom ha de tenir almenys 2 caràcters';
                isValid = false;
            }
            break;
            
        case 'email':
        case 'correu':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Si us plau, introdueix un correu vàlid';
                isValid = false;
            }
            break;
            
        case 'phone':
        case 'telefon':
            const phoneRegex = /^[+]?[\d\s\-\(\)]{9,}$/;
            if (value && !phoneRegex.test(value)) {
                errorMessage = 'Si us plau, introdueix un telèfon vàlid';
                isValid = false;
            }
            break;
            
        case 'message':
        case 'missatge':
            if (value.length < 10) {
                errorMessage = 'El missatge ha de tenir almenys 10 caràcters';
                isValid = false;
            }
            break;
    }
    
    // Campos obligatorios
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Aquest camp és obligatori';
        isValid = false;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.setAttribute('aria-invalid', 'true');
    
    // Crear o actualizar mensaje de error
    let errorDiv = field.parentNode.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.setAttribute('role', 'alert');
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    field.setAttribute('aria-invalid', 'false');
    
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function submitForm(form) {
    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary');
    const originalText = submitBtn ? submitBtn.textContent : '';
    
    if (submitBtn) {
        submitBtn.textContent = 'Enviant...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    }
    
    // Simular envío del formulario (aquí conectarías con tu backend)
    setTimeout(() => {
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
        // Resetear formulario
        form.reset();
        
        // Restaurar botón
        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    }, 2000);
}

function showSuccessMessage() {
    // Crear mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
            text-align: center;
            animation: slideInDown 0.5s ease;
        ">
            ✓ Missatge enviat correctament! Et respondrem aviat.
        </div>
    `;
    
    // Insertar mensaje
    const form = document.querySelector('.contact-form');
    if (form) {
        form.parentNode.insertBefore(successDiv, form);
        
        // Eliminar mensaje después de 5 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// ========================
// SCROLL SUAVE
// ========================
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================
// EFECTO HEADER AL SCROLL
// ========================
function setupHeaderScrollEffect() {
    const header = document.querySelector('header') || document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Agregar/quitar clase para background
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header en scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// ========================
// LAZY LOADING IMÁGENES
// ========================
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================
// TOOLTIPS
// ========================
function setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
    
    e.target.tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target.tooltip) {
        e.target.tooltip.remove();
        e.target.tooltip = null;
    }
}

// ========================
// UTILIDADES ADICIONALES
// ========================

// Función para detectar dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar redimensionado de ventana
window.addEventListener('resize', debounce(() => {
    // Reajustar elementos si es necesario
    if (portfolioItems.length > 0) {
        showSlide(currentSlide);
    }
}, 250));

// Back to top button
function setupBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: #3b82f6;
        color: white;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Inicializar back to top al cargar
document.addEventListener('DOMContentLoaded', () => {
    setupBackToTop();
});

// ========================
// PERFORMANCE OPTIMIZATION
// ========================

// Preload de imágenes críticas
function preloadImages() {
    const criticalImages = document.querySelectorAll('img[data-preload]');
    criticalImages.forEach(img => {
        const imageUrl = img.src || img.dataset.src;
        if (imageUrl) {
            const preloadImg = new Image();
            preloadImg.src = imageUrl;
        }
    });
}

// Ejecutar al cargar la página
window.addEventListener('load', () => {
    preloadImages();
    
    // Remover clase de loading si existe
    document.body.classList.remove('loading');
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
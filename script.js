// Funcionalidad principal de la landing page

// Variables globales
let spotsLeft = 23;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeCountdown();
    initializeFormValidation();
    initializeScrollAnimations();
    updateSpotsCounter();
    initializeParallax();
    initializeSmoothScrolling();
    initializeHeroAnimations();
    initializeStatsCounter();
});

// Función para scroll suave al formulario
function scrollToForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Agregar efecto de highlight al formulario
        const formElement = document.querySelector('.contact-form-element');
        if (formElement) {
            formElement.style.transform = 'scale(1.02)';
            formElement.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                formElement.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Funcionalidad de FAQs
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('i');
    
    // Cerrar otros FAQs abiertos
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-question i');
            otherAnswer.classList.remove('active');
            otherIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle del FAQ actual
    faqItem.classList.toggle('active');
    answer.classList.toggle('active');
    
    if (faqItem.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

// Validación y envío del formulario
function initializeFormValidation() {
    const form = document.getElementById('leadForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (!form || !submitBtn) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos requeridos
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'Este campo es requerido');
            } else {
                clearFieldError(field);
            }
        });
        
        // Validar email
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            isValid = false;
            showFieldError(emailField, 'Por favor ingresa un email válido');
        }
        
        if (isValid) {
            submitForm(form, submitBtn);
        }
    });
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validar campo individual
function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        showFieldError(field, 'Por favor ingresa un email válido');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// Mostrar error en campo
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#dc2626';
    field.style.background = 'rgba(220, 38, 38, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#dc2626';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Limpiar error de campo
function clearFieldError(field) {
    field.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    field.style.background = 'rgba(255, 255, 255, 0.1)';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enviar formulario
function submitForm(form, submitBtn) {
    // Mostrar estado de carga
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simular envío (en producción aquí iría la llamada al servidor)
    setTimeout(() => {
        // Simular éxito
        showSuccessMessage();
        form.reset();
        updateSpotsCounter();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        
        setTimeout(() => {
            submitBtn.classList.remove('success');
        }, 3000);
        
    }, 2000);
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #10b981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
        max-width: 300px;
    `;
    
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
            <div>
                <strong>¡Mensaje enviado!</strong><br>
                <small>Te contactaremos en las próximas 24 horas</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 500);
    }, 5000);
}

// Actualizar contador de cupos
function updateSpotsCounter() {
    const spotsElement = document.getElementById('spots-left');
    if (spotsElement && spotsLeft > 0) {
        spotsLeft--;
        spotsElement.textContent = spotsLeft;
        
        // Efecto de parpadeo
        spotsElement.style.animation = 'pulse 0.5s ease-out';
        setTimeout(() => {
            spotsElement.style.animation = '';
        }, 500);
    }
}

// Initialize parallax effects
function initializeParallax() {
    // Parallax functionality will be handled by existing scroll event
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    // Already handled by existing click event listener
}

// Initialize hero animations
function initializeHeroAnimations() {
    // Add entrance animations to hero elements
    const heroElements = {
        '.hero-badge': { delay: 300, animation: 'fadeInDown' },
        '.hero-title .highlight': { delay: 500, animation: 'fadeInLeft' },
        '.hero-title .main-text': { delay: 700, animation: 'fadeInLeft' },
        '.hero-subtitle': { delay: 900, animation: 'fadeInUp' },
        '.benefit-item': { delay: 1100, animation: 'slideInLeft', stagger: 200 },
        '.cta-container': { delay: 1500, animation: 'fadeInUp' }
    };

    Object.entries(heroElements).forEach(([selector, config]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            const delay = config.delay + (config.stagger ? index * config.stagger : 0);
            element.style.opacity = '0';
            element.style.transform = getInitialTransform(config.animation);
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translate(0, 0) scale(1)';
            }, delay);
        });
    });
}

// Get initial transform for animation
function getInitialTransform(animation) {
    switch (animation) {
        case 'fadeInDown': return 'translateY(-30px)';
        case 'fadeInUp': return 'translateY(30px)';
        case 'fadeInLeft': return 'translateX(-30px)';
        case 'slideInLeft': return 'translateX(-20px)';
        default: return 'translateY(20px)';
    }
}

// Initialize stats counter animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas for large numbers
            const displayValue = Math.floor(current).toLocaleString();
            element.textContent = displayValue;
        }, 16);
    };
    
    // Start animation when hero is visible
    setTimeout(() => {
        statNumbers.forEach(animateCounter);
    }, 2000);
}

// Inicializar countdown (opcional)
function initializeCountdown() {
    // Simular un countdown de 24 horas
    let timeLeft = 24 * 60 * 60; // 24 horas en segundos
    
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    const updateCountdown = () => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        countdownElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft > 0) {
            timeLeft--;
        } else {
            timeLeft = 24 * 60 * 60; // Reiniciar
        }
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Animaciones de scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Agregar un pequeño retraso entre cada elemento para evitar que aparezcan todos a la vez
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // Asegurar que el z-index se aplique correctamente durante la animación
                    entry.target.style.zIndex = '2';
                    
                    // Restaurar el z-index original después de la animación
                    setTimeout(() => {
                        if (entry.target.classList.contains('benefit-card') || 
                            entry.target.classList.contains('testimonial-card')) {
                            entry.target.style.zIndex = '1';
                        }
                    }, 600); // Tiempo igual a la duración de la transición
                }, index * 50); // 50ms de retraso entre cada elemento
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll(
        '.benefit-card, .testimonial-card, .faq-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, z-index 0s';
        observer.observe(el);
    });
}

// Efecto parallax suave para el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Smooth scroll para navegación
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Optimización de rendimiento: debounce para scroll
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

// Aplicar debounce al scroll
const debouncedScroll = debounce(() => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Agregar animaciones CSS adicionales
const additionalStyles = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .field-error {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error en la página:', e.error);
    // En producción, aquí se podría enviar el error a un servicio de logging
});

// Funciones de utilidad
const utils = {
    // Formatear número de teléfono
    formatPhone: function(phone) {
        return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },
    
    // Validar número de teléfono
    isValidPhone: function(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,2}[\s\-\(]?[\d]{1,4}[\s\-\)]?[\d]{1,4}[\s\-]?[\d]{1,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },
    
    // Capitalizar primera letra
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
};

// Hacer utils disponible globalmente
window.utils = utils;

// Inicialización final
console.log('🚀 Landing page cargada correctamente');
console.log('💪 ¡Listos para transformar vidas!');
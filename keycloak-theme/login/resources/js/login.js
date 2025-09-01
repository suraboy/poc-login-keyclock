// MSP Login Theme JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Focus on username field
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.focus();
    }
    
    // Initialize modal system
    initializeModals();
});

// Password toggle functionality
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleButton = document.querySelector('.password-toggle');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="m1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="m1 1 22 22" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
    } else {
        passwordField.type = 'password';
        toggleButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
    }
}

// Modal System
function initializeModals() {
    // Close modal when clicking overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // Initialize close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            closeModal(modal);
        });
    });
}

// Show Modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first focusable element
        const focusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) {
            setTimeout(() => focusable.focus(), 100);
        }
    }
}

// Close Modal
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Create Alert Modal
function showAlert(title, message, type = 'info') {
    const modalId = 'alert-modal-' + Date.now();
    const iconMap = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    const modalHTML = `
        <div id="${modalId}" class="modal-overlay">
            <div class="modal modal-confirm modal-${type}">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button type="button" class="modal-close" aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="modal-icon">${iconMap[type] || iconMap.info}</div>
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="closeModal(document.getElementById('${modalId}'))">
                        OK
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(modalId);
    
    // Initialize modal events
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
    
    showModal(modalId);
    
    // Auto remove after closing
    setTimeout(() => {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 5000);
}

// Create Confirm Modal
function showConfirm(title, message, onConfirm, onCancel = null) {
    const modalId = 'confirm-modal-' + Date.now();
    
    const modalHTML = `
        <div id="${modalId}" class="modal-overlay">
            <div class="modal modal-confirm modal-danger">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button type="button" class="modal-close" aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="modal-icon">?</div>
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancel-btn-${modalId}">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-primary" id="confirm-btn-${modalId}">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(modalId);
    
    // Event handlers
    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
        if (onCancel) onCancel();
    });
    
    modal.querySelector(`#cancel-btn-${modalId}`).addEventListener('click', () => {
        closeModal(modal);
        if (onCancel) onCancel();
    });
    
    modal.querySelector(`#confirm-btn-${modalId}`).addEventListener('click', () => {
        closeModal(modal);
        if (onConfirm) onConfirm();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
            if (onCancel) onCancel();
        }
    });
    
    showModal(modalId);
    
    // Auto remove after closing
    setTimeout(() => {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 10000);
}

// Show Loading Modal
function showLoading(message = 'Loading...') {
    const modalId = 'loading-modal';
    
    // Remove existing loading modal
    const existing = document.getElementById(modalId);
    if (existing) {
        existing.parentNode.removeChild(existing);
    }
    
    const modalHTML = `
        <div id="${modalId}" class="modal-overlay">
            <div class="modal modal-loading">
                <div class="modal-body">
                    <div class="modal-spinner"></div>
                    <span>${message}</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    showModal(modalId);
}

// Hide Loading Modal
function hideLoading() {
    const modal = document.getElementById('loading-modal');
    if (modal) {
        closeModal(modal);
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}
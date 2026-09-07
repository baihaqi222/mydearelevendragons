/**
 * Simplified Apology Website - JavaScript (for index2.html)
 * 
 * Features:
 * - Auto-play background music on page load
 * - Audio control with background music
 * - Error handling for external resources
 */

// ==========================================
// Configuration Constants
// ==========================================
const AUDIO_SOURCES = {
    puisi: 'https://res.cloudinary.com/gdazzryl/video/upload/v1788778957/07-09-2026_16.31_y4dwe8.mp3',
    background: 'https://res.cloudinary.com/gdazzryl/video/upload/v1788779059/Bimbang_Remastered_2024_1_r7ayxw.mp3'
};

const WHATSAPP_LINK = 'https://chat.whatsapp.com/E4ScYTLNnVXAtsllbv3Crr?s=cl&p=a&mlu=4';

// ==========================================
// DOM Elements
// ==========================================
const elements = {
    pageLetter1: document.getElementById('page-letter1'),
    pagePhoto: document.getElementById('page-photo'),
    btnPuisi: document.getElementById('btn-puisi'),
    btnToPhoto: document.getElementById('btn-to-photo'),
    btnTime: document.getElementById('btn-time'),
    btnYes: document.getElementById('btn-yes'),
    audioPuisi: document.getElementById('audio-puisi'),
    audioBg: document.getElementById('audio-bg'),
    audioStatus: document.getElementById('audio-status'),
    btnText: document.querySelector('.btn-text'),
    groupPhoto: document.getElementById('group-photo'),
    timeMessage: document.getElementById('time-message')
};

// ==========================================
// State Management
// ==========================================
const state = {
    currentPage: 'letter1',
    isPuisiPlaying: false,
    bgMusicPlaying: false
};

// ==========================================
// Page Navigation System
// ==========================================

/**
 * Navigate to a specific page with smooth transition
 * @param {string} targetPage - Page identifier (letter1, photo)
 */
function navigateToPage(targetPage) {
    const pageMap = {
        'letter1': elements.pageLetter1,
        'photo': elements.pagePhoto
    };

    const currentPageEl = pageMap[state.currentPage];
    const targetPageEl = pageMap[targetPage];

    if (!targetPageEl || state.currentPage === targetPage) {
        return;
    }

    // Fade out current page
    currentPageEl.classList.add('fade-out');
    
    setTimeout(() => {
        currentPageEl.classList.remove('active', 'fade-out');
        
        // Fade in new page
        targetPageEl.classList.add('active', 'fade-in');
        
        setTimeout(() => {
            targetPageEl.classList.remove('fade-in');
        }, 100);
        
        state.currentPage = targetPage;
    }, 500);
}

// ==========================================
// Audio Control System
// ==========================================

/**
 * Initialize and autoplay background music on page load
 */
function initAudio() {
    // Set up background music - AUTO PLAY at 30%
    elements.audioBg.src = AUDIO_SOURCES.background;
    elements.audioBg.volume = 0.5;
    
    const bgPromise = elements.audioBg.play();
    if (bgPromise !== undefined) {
        bgPromise.then(() => {
            state.bgMusicPlaying = true;
        }).catch(error => {
            console.log('Autoplay blocked, click to enable');
        });
    }
    
    // Set up puisi audio - FULL VOLUME
    elements.audioPuisi.src = AUDIO_SOURCES.puisi;
    elements.audioPuisi.volume = 1.0;
}

/**
 * Toggle puisi audio playback
 */
function togglePuisi() {
    if (state.isPuisiPlaying) {
        // Pause puisi
        elements.audioPuisi.pause();
        
        state.isPuisiPlaying = false;
        elements.btnPuisi.classList.remove('playing');
        elements.btnText.textContent = 'Play Puisi';
        elements.audioStatus.textContent = '';
    } else {
        // Play puisi at FULL VOLUME
        elements.audioPuisi.currentTime = 0;
        elements.audioPuisi.volume = 1.0;
        elements.audioPuisi.play().catch(error => {
            console.error('Puisi error:', error);
        });
        
        // Reduce BG music to 30% when playing puisi
        fadeVolume(elements.audioBg, elements.audioBg.volume, 0.3, 500);
        
        // Start BG music if not playing
        if (!state.bgMusicPlaying) {
            elements.audioBg.currentTime = 0;
            elements.audioBg.play().catch(error => {
                console.error('BG error:', error);
            });
            state.bgMusicPlaying = true;
        }
        
        state.isPuisiPlaying = true;
        elements.btnPuisi.classList.add('playing');
        elements.btnText.textContent = 'Pause Puisi';
        elements.audioStatus.textContent = '🎵 Sedang memutar puisi...';
    }
}

/**
 * Handle when puisi audio ends - background music naik ke FULL VOLUME
 */
function handlePuisiEnd() {
    state.isPuisiPlaying = false;
    elements.btnPuisi.classList.remove('playing');
    elements.btnText.textContent = 'Play Puisi';
    elements.audioStatus.textContent = '✨ Puisi selesai. Musik latar masih berputar...';
    
    // Naikkan volume musik latar dari 30% ke FULL VOLUME
    fadeVolume(elements.audioBg, elements.audioBg.volume, 1.0, 1500);
}

/**
 * Smoothly transition audio volume
 * @param {HTMLAudioElement} audio - Audio element
 * @param {number} from - Start volume
 * @param {number} to - Target volume
 * @param {number} duration - Transition duration in ms
 */
function fadeVolume(audio, from, to, duration) {
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeChange = (to - from) / steps;
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
        if (currentStep < steps) {
            audio.volume = Math.max(0, Math.min(1, from + (volumeChange * currentStep)));
            currentStep++;
        } else {
            audio.volume = to;
            clearInterval(fadeInterval);
        }
    }, stepDuration);
}

// ==========================================
// Photo Error Handling
// ==========================================

/**
 * Handle photo load error with fallback UI
 */
function handlePhotoError() {
    elements.groupPhoto.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.style.cssText = 'min-height:250px;display:flex;align-items:center;justify-content:center;background:#f5e6d3;border-radius:10px;color:#8b6f47;font-size:1.2rem;';
    fallback.innerHTML = '📸 Gagal memuat foto';
    elements.groupPhoto.parentNode.appendChild(fallback);
}

// ==========================================
// Button Event Handlers
// ==========================================

/**
 * Handle "I need time" button click
 */
function handleTimeButtonClick() {
    elements.timeMessage.classList.remove('hidden');
    elements.timeMessage.style.animation = 'none';
    
    // Trigger reflow for animation restart
    setTimeout(() => {
        elements.timeMessage.style.animation = 'fadeInUp 0.8s ease-out';
    }, 10);
}

/**
 * Handle "Yes I want" button click
 */
function handleYesButtonClick() {
    // Open WhatsApp link
    window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer');
}

// ==========================================
// Event Listeners Setup
// ==========================================

function setupEventListeners() {
    // Audio control
    elements.btnPuisi.addEventListener('click', togglePuisi);
    elements.audioPuisi.addEventListener('ended', handlePuisiEnd);
    
    // Navigation buttons
    elements.btnToPhoto.addEventListener('click', () => {
        navigateToPage('photo');
    });
    
    // Photo page buttons
    elements.btnTime.addEventListener('click', handleTimeButtonClick);
    elements.btnYes.addEventListener('click', handleYesButtonClick);
    
    // Photo error handling
    elements.groupPhoto.addEventListener('error', handlePhotoError);
}

// ==========================================
// Initialization
// ==========================================

function init() {
    console.log('✨ Apology Website (index2) initialized');
    
    // Setup all event listeners
    setupEventListeners();
    
    // Initialize audio (auto-play BG music)
    initAudio();
    
    // Set initial page
    elements.pageLetter1.classList.add('active');
    
    console.log('📝 All pages loaded successfully');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/**
 * Love Mail - Interactive Valentine's Card
 * Handles screen navigation, envelope animation, and playful button interactions
 */

(function () {
  'use strict';

  // ===========================
  // Configuration
  // ===========================
  const WOBBLE_DURATION_MS = 600;
  const ENVELOPE_ANIMATION_DELAY = 900;

  // ===========================
  // State Management
  // ===========================
  let currentScreen = 1;
  let envelopeOpened = false;
  let envelopeTimeoutId = null;
  let noWobbleTimeoutId = null;

  // ===========================
  // DOM Element References
  // ===========================
  const screens = Array.from(document.querySelectorAll('.screen'));
  const envelope = document.getElementById('js-envelope');
  const envelopeTrigger = document.getElementById('js-envelope-trigger');
  const yesBtn = document.getElementById('js-yes-btn');
  const noBtn = document.getElementById('js-no-btn');
  const nextButtons = document.querySelectorAll('.js-next');

  // ===========================
  // Core Functions
  // ===========================

  /**
   * Navigate to a specific screen
   * @param {number} id - Screen number to display
   */
  function showScreen(id) {
    currentScreen = id;

    // Reset envelope state when returning to screen 1 (replay)
    if (id === 1 && envelope) {
      resetEnvelope();
    }

    // Update screen visibility
    screens.forEach((screen) => {
      const screenId = Number(screen.getAttribute('data-screen'));
      if (screenId === id) {
        screen.classList.add('screen--active');
      } else {
        screen.classList.remove('screen--active');
      }
    });
  }

  /**
   * Reset envelope to closed state and clear any pending timeouts
   */
  function resetEnvelope() {
    envelopeOpened = false;
    envelope.classList.remove('open');
    
    clearEnvelopeTimeout();
    clearNoButtonTimeout();
  }

  /**
   * Clear envelope animation timeout if it exists
   */
  function clearEnvelopeTimeout() {
    if (envelopeTimeoutId !== null) {
      clearTimeout(envelopeTimeoutId);
      envelopeTimeoutId = null;
    }
  }

  /**
   * Clear "No" button wobble timeout if it exists
   */
  function clearNoButtonTimeout() {
    if (noWobbleTimeoutId !== null) {
      clearTimeout(noWobbleTimeoutId);
      noWobbleTimeoutId = null;
    }
  }

  // ===========================
  // Event Handlers
  // ===========================

  /**
   * Handle envelope click - open animation and transition to next screen
   */
  function handleEnvelopeClick() {
    // Prevent multiple clicks
    if (envelopeOpened) return;
    
    envelopeOpened = true;
    envelope.classList.add('open');
    
    // Transition to next screen after animation completes
    clearEnvelopeTimeout();
    envelopeTimeoutId = window.setTimeout(() => {
      envelopeTimeoutId = null;
      showScreen(2);
    }, ENVELOPE_ANIMATION_DELAY);
  }

  /**
   * Handle "Yes" button click - proceed to next screen
   */
  function handleYesClick() {
    showScreen(4);
  }

  /**
   * Handle "No" button hover - trigger playful wobble animation
   */
  function handleNoHover() {
    // Restart wobble animation
    noBtn.classList.remove('mischief');
    void noBtn.offsetWidth; // Force reflow to restart animation
    noBtn.classList.add('mischief');

    // Remove animation class after completion
    clearNoButtonTimeout();
    noWobbleTimeoutId = window.setTimeout(() => {
      noWobbleTimeoutId = null;
      noBtn.classList.remove('mischief');
    }, WOBBLE_DURATION_MS);
  }

  /**
   * Handle "No" button click - show playful alert
   */
  function handleNoClick() {
    alert("Nice try 😌 but my heart is set on 'Yes'.");
  }

  /**
   * Handle navigation button clicks
   * @param {Event} event - Click event
   */
  function handleNextClick(event) {
    const nextScreen = Number(event.currentTarget.getAttribute('data-next'));
    if (!Number.isNaN(nextScreen)) {
      showScreen(nextScreen);
    }
  }

  // ===========================
  // Event Listeners Setup
  // ===========================

  /**
   * Initialize all event listeners
   */
  function initializeEventListeners() {
    // Navigation buttons
    nextButtons.forEach((btn) => {
      btn.addEventListener('click', handleNextClick);
    });

    // Envelope interaction
    if (envelope && envelopeTrigger) {
      envelopeTrigger.addEventListener('click', handleEnvelopeClick);
    }

    // Yes/No buttons
    if (yesBtn) {
      yesBtn.addEventListener('click', handleYesClick);
    }

    if (noBtn) {
      noBtn.addEventListener('mouseenter', handleNoHover);
      noBtn.addEventListener('click', handleNoClick);
    }
  }

  // ===========================
  // Initialization
  // ===========================

  /**
   * Initialize the application
   */
  function init() {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeEventListeners);
    } else {
      initializeEventListeners();
    }
  }

  // Start the application
  init();

})();

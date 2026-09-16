import { slidesData, questionsData } from './slidesData.js';
import { ThreeScene } from './threeBg.js';
import { initSimulation } from './simulations.js';
import { sound } from './audioFx.js';
import katex from 'katex';

class PresentationApp {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = slidesData.length;
    this.isAutoplay = false;
    this.autoplayTimer = null;
    this.currentSimulation = null;

    this.threeScene = null;
    this.slideContainer = document.getElementById('slide-viewport');
    this.overviewModal = document.getElementById('overview-modal');
    this.questionsModal = document.getElementById('questions-modal');

    this.init();
  }

  init() {
    // 1. Initialize 3D Three.js background
    const bgCanvas = document.getElementById('three-bg-canvas');
    if (bgCanvas) {
      this.threeScene = new ThreeScene(bgCanvas);
    }

    // 2. Build bottom navigation bar pills
    this.buildTopicNav();

    // 3. Build Overview Matrix
    this.buildOverviewMatrix();

    // 4. Build Questions Modal content
    this.buildQuestionsModal();

    // 5. Setup event listeners
    this.setupEventListeners();

    // 6. Render initial slide (Slide 0: Hero)
    this.renderSlide(0);
  }

  buildTopicNav() {
    const navTrack = document.getElementById('nav-pills-track');
    if (!navTrack) return;
    navTrack.innerHTML = '';

    // Intro pill
    const introBtn = document.createElement('button');
    introBtn.className = 'nav-pill active';
    introBtn.dataset.slide = '0';
    introBtn.innerHTML = `<span class="pill-code">00</span><span class="pill-label">INTRO</span>`;
    introBtn.addEventListener('click', () => this.goToSlide(0));
    navTrack.appendChild(introBtn);

    // 10 Topics (each mapped to its first slide: 1, 3, 5, 7, 9, 11, 13, 15, 17, 19)
    const topicLabels = [
      'Bands', 'Carriers', 'Density', 'Fermi', 'Equil',
      'Drift', 'Mobility', 'Lifetime', 'Poisson', 'Hall'
    ];

    for (let t = 1; t <= 10; t++) {
      const numStr = t < 10 ? `0${t}` : `${t}`;
      const topicSlideIndex = slidesData.findIndex(s => s.topicNum === numStr);
      if (topicSlideIndex !== -1) {
        const pill = document.createElement('button');
        pill.className = 'nav-pill';
        pill.dataset.topic = numStr;
        pill.dataset.slide = topicSlideIndex;
        pill.innerHTML = `<span class="pill-code">${numStr}</span><span class="pill-label">${topicLabels[t - 1]}</span>`;
        pill.addEventListener('click', () => this.goToSlide(topicSlideIndex));
        navTrack.appendChild(pill);
      }
    }

    // Conclusion pill
    const outroIndex = this.totalSlides - 1;
    const outroBtn = document.createElement('button');
    outroBtn.className = 'nav-pill';
    outroBtn.dataset.slide = `${outroIndex}`;
    outroBtn.innerHTML = `<span class="pill-code">END</span><span class="pill-label">Q&A</span>`;
    outroBtn.addEventListener('click', () => this.goToSlide(outroIndex));
    navTrack.appendChild(outroBtn);
  }

  buildOverviewMatrix() {
    const grid = document.getElementById('overview-grid');
    if (!grid) return;
    grid.innerHTML = '';

    slidesData.forEach((slide, idx) => {
      const card = document.createElement('div');
      card.className = `overview-card ${idx === this.currentSlide ? 'active' : ''}`;
      card.dataset.slide = idx;
      card.innerHTML = `
        <div class="ov-header">
          <span class="ov-num">${idx < 10 ? '0' + idx : idx}</span>
          <span class="ov-cat">${slide.category}</span>
        </div>
        <h4 class="ov-title">${slide.title}</h4>
        <p class="ov-sub">${slide.tagline || slide.subtitle || ''}</p>
        <div class="ov-footer">
          <span class="ov-type">${slide.type.toUpperCase()}</span>
          ${slide.subSlide ? `<span class="ov-subslide">${slide.subSlide}</span>` : ''}
        </div>
      `;
      card.addEventListener('click', () => {
        this.goToSlide(idx);
        this.closeOverview();
      });
      grid.appendChild(card);
    });
  }

  buildQuestionsModal() {
    const qList = document.getElementById('questions-list');
    if (!qList) return;
    qList.innerHTML = '';

    questionsData.forEach((item, qIdx) => {
      const qCard = document.createElement('div');
      qCard.className = 'question-accordion-card';
      qCard.innerHTML = `
        <div class="q-header">
          <span class="q-topic-badge">${item.topic}</span>
          <h4 class="q-title">${item.question}</h4>
          <button class="q-toggle-btn">REVEAL ANSWER</button>
        </div>
        <div class="q-answer-body hidden">
          <p>${item.answer}</p>
        </div>
      `;

      const toggleBtn = qCard.querySelector('.q-toggle-btn');
      const answerBody = qCard.querySelector('.q-answer-body');
      toggleBtn.addEventListener('click', () => {
        sound.quantumBlip();
        answerBody.classList.toggle('hidden');
        toggleBtn.textContent = answerBody.classList.contains('hidden') ? 'REVEAL ANSWER' : 'HIDE ANSWER';
      });

      qList.appendChild(qCard);
    });
  }

  renderSlide(index) {
    if (this.currentSimulation && typeof this.currentSimulation.destroy === 'function') {
      this.currentSimulation.destroy();
      this.currentSimulation = null;
    }

    this.currentSlide = index;
    const slide = slidesData[index];

    // Update 3D Three.js camera/chip focus
    if (this.threeScene) {
      this.threeScene.updateForSlide(index, this.totalSlides);
    }

    // Update HUD counters
    const counterEl = document.getElementById('hud-counter');
    if (counterEl) {
      const currStr = index < 10 ? `0${index}` : `${index}`;
      const totStr = this.totalSlides < 10 ? `0${this.totalSlides}` : `${this.totalSlides}`;
      counterEl.textContent = `${currStr} / ${totStr}`;
    }

    // Update HUD Breadcrumbs
    const breadcrumbEl = document.getElementById('hud-breadcrumb');
    if (breadcrumbEl) {
      if (index === 0) {
        breadcrumbEl.innerHTML = `<span class="hud-tag">HOME</span> SYSTEM OVERVIEW // LANDING`;
      } else if (index === this.totalSlides - 1) {
        breadcrumbEl.innerHTML = `<span class="hud-tag">CONCLUSION</span> INTERACTIVE Q&A & ARCHIVE`;
      } else {
        const subStr = slide.subSlide ? ` [${slide.subSlide}]` : '';
        breadcrumbEl.innerHTML = `<span class="hud-tag">TOPIC ${slide.topicNum}${subStr}</span> ${slide.topicTitle}`;
      }
    }

    // Update progress bar
    const progressFill = document.getElementById('progress-bar-fill');
    if (progressFill) {
      const pct = (index / (this.totalSlides - 1)) * 100;
      progressFill.style.width = `${pct}%`;
    }

    // Update bottom nav active state
    document.querySelectorAll('.nav-pill').forEach((pill) => {
      const targetSlide = parseInt(pill.dataset.slide, 10);
      if (index === 0 && targetSlide === 0) {
        pill.classList.add('active');
      } else if (index === this.totalSlides - 1 && targetSlide === this.totalSlides - 1) {
        pill.classList.add('active');
      } else if (slide.topicNum && pill.dataset.topic === slide.topicNum) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Render slide HTML
    this.slideContainer.innerHTML = '';
    const slideWrapper = document.createElement('div');
    slideWrapper.className = `slide-content-wrapper slide-type-${slide.type} animate-slide-in`;

    if (slide.type === 'hero') {
      slideWrapper.innerHTML = this.getHeroHtml(slide);
    } else if (slide.type === 'conclusion') {
      slideWrapper.innerHTML = this.getConclusionHtml(slide);
    } else {
      slideWrapper.innerHTML = this.getContentHtml(slide);
    }

    this.slideContainer.appendChild(slideWrapper);

    // Render KaTeX formulas
    this.renderFormulas(slideWrapper);

    // Initialize interactive simulation if defined
    if (slide.interactiveType) {
      const simContainerId = `sim-container-${slide.id}`;
      this.currentSimulation = initSimulation(simContainerId, slide.interactiveType);
    }

    // Attach button listeners inside slide
    const heroStartBtn = slideWrapper.querySelector('#hero-start-btn');
    if (heroStartBtn) {
      heroStartBtn.addEventListener('click', () => {
        sound.slideTransition();
        this.goToSlide(1);
      });
    }

    const openQBtn = slideWrapper.querySelector('#open-q-btn');
    if (openQBtn) {
      openQBtn.addEventListener('click', () => {
        sound.modalOpen();
        this.openQuestions();
      });
    }

    // Update Overview Matrix Active Card
    document.querySelectorAll('.overview-card').forEach((card) => {
      if (parseInt(card.dataset.slide, 10) === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  getHeroHtml(slide) {
    return `
      <div class="hero-layout">
        <div class="hero-left-panel">
          <div class="cyber-badge-row">
            <span class="cyber-badge-dot"></span>
            <span class="cyber-badge-text">SUBJECT CODE: ${slide.subjectCode || 'PCEC-514'} // SOLID STATE ELECTRONICS</span>
          </div>

          <h1 class="hero-main-title">
            Semiconductor Physics
          </h1>
          <h2 class="hero-subtitle">“${slide.subtitle}”</h2>

          <!-- Faculty Mentor & Course Info Banner -->
          <div class="faculty-mentor-banner">
            <div class="fmb-item">
              <span class="fmb-icon">🎓</span>
              <div class="fmb-content">
                <span class="fmb-label">FACULTY MENTOR / TEACHER</span>
                <span class="fmb-value text-cyan">${slide.teacherName || 'Dr. Paramjit Kaur'}</span>
              </div>
            </div>
            <div class="fmb-divider"></div>
            <div class="fmb-item">
              <span class="fmb-icon">📋</span>
              <div class="fmb-content">
                <span class="fmb-label">SUBJECT CODE</span>
                <span class="fmb-value text-amber">${slide.subjectCode || 'PCEC-514'}</span>
              </div>
            </div>
          </div>

          <p class="hero-desc">${slide.description}</p>

          <div class="hero-features-grid">
            ${slide.bullets.map(b => `
              <div class="hero-feature-card">
                <span class="hfc-glow"></span>
                <div class="hfc-label">${b.label}</div>
                <div class="hfc-text">${b.text}</div>
              </div>
            `).join('')}
          </div>

          <div class="hero-action-row">
            <button id="hero-start-btn" class="cyber-btn-primary">
              <span class="btn-shine"></span>
              <span class="btn-text">INITIALIZE PRESENTATION</span>
              <span class="btn-arrow">→</span>
            </button>
            <button class="cyber-btn-secondary" id="hero-overview-btn">
              <span>EXPLORE ALL 22 SLIDES [O]</span>
            </button>
          </div>
        </div>

        <div class="hero-right-panel">
          <div class="team-showcase-card">
            <div class="tsc-header">
              <div class="tsc-badge-wrap">
                <span class="tsc-pulse-dot"></span>
                <span class="tsc-tag">PROJECT PRESENTATION TEAM</span>
              </div>
              <span class="tsc-batch">${slide.subjectCode || 'PCEC-514'}</span>
            </div>

            <div class="team-members-list">
              ${(slide.teamMembers || []).map((m, idx) => `
                <div class="team-member-item">
                  <div class="tm-id-badge">0${idx + 1}</div>
                  <div class="tm-info">
                    <div class="tm-name">${m.name}</div>
                    <div class="tm-reg">
                      <span class="reg-label">REG. NO:</span>
                      <span class="reg-val">${m.regNo}</span>
                    </div>
                  </div>
                  <div class="tm-status-chip">
                    <span class="tm-dot"></span> PRESENTER
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="tsc-footer">
              <div class="tsc-footer-item">
                <span class="tsc-icon">🎓</span>
                <span>MENTOR: ${slide.teacherName ? slide.teacherName.toUpperCase() : 'DR. PARAMJIT KAUR'}</span>
              </div>
              <div class="tsc-footer-id">DEPT OF ECE</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getContentHtml(slide) {
    return `
      <div class="content-slide-layout">
        <div class="slide-header-pane">
          <div class="shp-top">
            <span class="shp-category">${slide.category}</span>
            ${slide.subSlide ? `<span class="shp-subslide">SUB-SECTION ${slide.subSlide}</span>` : ''}
          </div>
          <h2 class="shp-title">${slide.title}</h2>
          <p class="shp-tagline">${slide.tagline}</p>
        </div>

        <div class="slide-body-split">
          <!-- Left: Technical Breakdown & Equations -->
          <div class="slide-theory-col">
            ${slide.formula ? `
              <div class="formula-glass-card">
                <div class="fgc-header">
                  <span class="fgc-tag">GOVERNING RELATION</span>
                  <span class="fgc-desc">${slide.formulaDesc || ''}</span>
                </div>
                <div class="katex-render-target" data-formula="${this.escapeHtml(slide.formula)}"></div>
              </div>
            ` : ''}

            <p class="theory-overview">${slide.overview}</p>

            <div class="theory-points-list">
              ${slide.points.map((pt, i) => `
                <div class="point-glass-card">
                  <div class="pgc-num">0${i + 1}</div>
                  <div class="pgc-content">
                    <h4 class="pgc-title">${pt.title}</h4>
                    <p class="pgc-detail">${pt.detail}</p>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="key-takeaway-bar">
              <span class="ktb-icon">⚡</span>
              <div class="ktb-content">
                <strong>CORE INSIGHT:</strong> ${slide.keyTakeaway}
              </div>
            </div>
          </div>

          <!-- Right: Interactive Physics / Diagram Viewport -->
          <div class="slide-visual-col">
            <div id="sim-container-${slide.id}" class="visual-viewport-host">
              <!-- Interactive Canvas or Visualizer mounts here -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getConclusionHtml(slide) {
    return `
      <div class="conclusion-slide-layout">
        <div class="concl-badge">
          <span class="blink-dot"></span> CURRICULUM COMPLETE // QUANTUM HORIZONS
        </div>

        <h1 class="concl-title">THANK YOU</h1>
        <h3 class="concl-subtitle">${slide.subtitle}</h3>
        <p class="concl-desc">${slide.description}</p>

        <div class="concl-summary-cards">
          ${slide.points.map(pt => `
            <div class="concl-card">
              <h4 class="concl-card-title text-cyan">${pt.title}</h4>
              <p class="concl-card-detail">${pt.detail}</p>
            </div>
          `).join('')}
        </div>

        <div class="concl-cta-row">
          <button id="open-q-btn" class="cyber-btn-primary pulse-btn">
            <span class="btn-shine"></span>
            <span>QUESTIONS & CONCEPT EXPLORER</span>
            <span class="btn-arrow">?</span>
          </button>
          <button class="cyber-btn-secondary" id="concl-restart-btn">
            <span>↺ RESTART PRESENTATION</span>
          </button>
        </div>
      </div>
    `;
  }

  renderFormulas(container) {
    container.querySelectorAll('.katex-render-target').forEach((el) => {
      const formula = el.getAttribute('data-formula');
      if (formula) {
        try {
          katex.render(formula, el, {
            displayMode: true,
            throwOnError: false
          });
        } catch (e) {
          el.textContent = formula;
        }
      }
    });
  }

  setupEventListeners() {
    // Prev / Next Navigation Buttons
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        sound.slideTransition();
        this.prevSlide();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sound.slideTransition();
        this.nextSlide();
      });
    }

    // Top HUD controls
    const toggleAudioBtn = document.getElementById('btn-toggle-sound');
    if (toggleAudioBtn) {
      toggleAudioBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        toggleAudioBtn.classList.toggle('muted', isMuted);
        toggleAudioBtn.querySelector('.hud-btn-label').textContent = isMuted ? 'MUTED' : 'AUDIO';
      });
    }

    const toggleFsBtn = document.getElementById('btn-toggle-fs');
    if (toggleFsBtn) {
      toggleFsBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    const overviewBtn = document.getElementById('btn-open-overview');
    if (overviewBtn) {
      overviewBtn.addEventListener('click', () => {
        sound.modalOpen();
        this.openOverview();
      });
    }

    const questionsBtn = document.getElementById('btn-open-questions');
    if (questionsBtn) {
      questionsBtn.addEventListener('click', () => {
        sound.modalOpen();
        this.openQuestions();
      });
    }

    const autoplayBtn = document.getElementById('btn-toggle-autoplay');
    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
    }

    // Modal close buttons
    const closeOvBtn = document.getElementById('btn-close-overview');
    if (closeOvBtn) {
      closeOvBtn.addEventListener('click', () => this.closeOverview());
    }

    const closeQBtn = document.getElementById('btn-close-questions');
    if (closeQBtn) {
      closeQBtn.addEventListener('click', () => this.closeQuestions());
    }

    // Dynamic delegate for hero & restart buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('#hero-overview-btn')) {
        sound.modalOpen();
        this.openOverview();
      }
      if (e.target.closest('#concl-restart-btn')) {
        sound.slideTransition();
        this.goToSlide(0);
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if modal search is active
      if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          sound.slideTransition();
          this.nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          sound.slideTransition();
          this.prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case 'o':
        case 'O':
          e.preventDefault();
          sound.modalOpen();
          this.toggleOverview();
          break;
        case 'q':
        case 'Q':
          e.preventDefault();
          sound.modalOpen();
          this.toggleQuestions();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          this.toggleAutoplay();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          if (toggleAudioBtn) toggleAudioBtn.click();
          break;
        case 'Escape':
          this.closeOverview();
          this.closeQuestions();
          break;
      }
    });
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  goToSlide(idx) {
    if (idx >= 0 && idx < this.totalSlides) {
      this.renderSlide(idx);
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  toggleAutoplay() {
    this.isAutoplay = !this.isAutoplay;
    const btn = document.getElementById('btn-toggle-autoplay');
    if (btn) {
      btn.classList.toggle('active', this.isAutoplay);
      btn.querySelector('.hud-btn-label').textContent = this.isAutoplay ? 'PAUSE' : 'AUTO';
    }

    if (this.isAutoplay) {
      this.autoplayTimer = setInterval(() => {
        if (this.currentSlide < this.totalSlides - 1) {
          sound.slideTransition();
          this.nextSlide();
        } else {
          this.goToSlide(0);
        }
      }, 7000);
    } else {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  openOverview() {
    if (this.overviewModal) {
      this.overviewModal.classList.add('visible');
    }
  }

  closeOverview() {
    if (this.overviewModal) {
      this.overviewModal.classList.remove('visible');
    }
  }

  toggleOverview() {
    if (this.overviewModal) {
      this.overviewModal.classList.toggle('visible');
    }
  }

  openQuestions() {
    if (this.questionsModal) {
      this.questionsModal.classList.add('visible');
    }
  }

  closeQuestions() {
    if (this.questionsModal) {
      this.questionsModal.classList.remove('visible');
    }
  }

  toggleQuestions() {
    if (this.questionsModal) {
      this.questionsModal.classList.toggle('visible');
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

// Instantiate presentation app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new PresentationApp();
});

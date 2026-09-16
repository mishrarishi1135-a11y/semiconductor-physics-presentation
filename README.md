# ⚡ Semiconductor Physics — Interactive 3D Presentation Deck

> **A futuristic cybernetic web application and interactive classroom presentation for Semiconductor Physics.**  
> Built with Three.js, KaTeX, HTML5 Canvas, and Vanilla CSS/JS.

---

## 🏛️ Academic Course Details

- **Course**: Semiconductor Physics
- **Subject Code**: `PCEC-514`
- **Department**: Electronics & Communication Engineering (ECE)
- **Faculty Mentor**: **Dr. Paramjit Kaur**

### 👥 Project Presentation Team
| # | Name | Registration No. | Role |
| :-: | :--- | :--- | :--- |
| **01** | **Avanish Kumar** | `254044038` | Presenter |
| **02** | **Anuj Mishra** | `254074003` | Presenter |
| **03** | **Khushi Ezaz** | `2633033` | Presenter |
| **04** | **Aanand Kumar Singh** | `254044037` | Presenter |
| **05** | **Dheeraj Kumar** | `254044039` | Presenter |

---

## 🚀 Key Highlights & Interactive Features

- **Cyberpunk / Sci-Fi HUD Interface**: Sleek dark navy/cyan glassmorphism theme (`#040814` / `#00f2fe`) with dynamic telemetry, status indicators, and smooth micro-animations.
- **Real-Time 3D Background**: Live Three.js interactive silicon wafer/microchip lattice responding to camera focus and slide transitions.
- **Physics-Accurate Interactive Simulators**:
  - **The Law of Charge Neutrality Engine**: Dual-pan holographic balance scale and live crystal volume demonstrating $\rho = q(p - n + N_D^+ - N_A^-) = 0$ with interactive dopant sliders.
  - **Fermi-Dirac Distribution Plotter**: Interactive temperature slider ($0\text{ K} - 800\text{ K}$) showcasing quantum step transition vs. thermal broadening.
  - **Carrier Drift Transport Engine**: Real-time electron and hole drift dynamics under adjustable electric fields ($\mathcal{E}$).
  - **Hall Effect Deflection Simulator**: Visualizes Lorentz force $\vec{F} = q(\vec{v} \times \vec{B})$ and transverse Hall voltage generation ($V_H$).
  - **3D Lattice Scattering & Matthiessen Model**: Interactive temperature slider visualizing phonon (acoustic) scattering vs. ionized impurity scattering.
  - **Carrier Recombination Visualizer**: Compares Band-to-Band (Radiative), Shockley-Read-Hall (SRH defect traps), and Auger processes.
- **KaTeX Math Engine**: High-fidelity mathematical rendering of governing semiconductor equations.
- **Synthesized Audio Effects**: Web Audio API cyber sound effects for slide shifts, modal popups, and user interaction.
- **Interactive Q&A Bank**: Built-in accordion formula and concept hub with revealable answers.
- **Slide Matrix Grid**: Instant bird's-eye overview modal allowing seamless jumping between modules.

---

## 📚 Curriculum Structure (18 Slides)

| # | Topic | Slide Title | Key Governing Formula | Interactive / Visual Focus |
| :-: | :--- | :--- | :--- | :--- |
| **00** | **System Overview** | Semiconductor Physics | $\Delta E = h\nu$ | 3D Silicon Lattice & Team Console |
| **01** | **01. Energy Bands** | Formation of Energy Bands & Bandgap | $E_g = E_c - E_v$ | Bandgap Comparison Model |
| **02** | **02. Charge Carriers** | Generation of Electrons & Holes | $E_{bond} \approx E_g \xrightarrow{k_B T} e^- + h^+$ | Thermal Generation ($e^-$/$h^+$) |
| **03** | **02. Charge Carriers** | Extrinsic Semiconductors: Doping | $N_D^+ \approx N_D, \quad N_A^- \approx N_A$ | 3D Doping Model & Impurity Ionization |
| **04** | **03. Carrier Concentrations** | Fermi-Dirac Function | $f(E) = \frac{1}{1 + \exp\left(\frac{E - E_F}{k_B T}\right)}$ | Interactive Temperature Slider ($0\text{-}800\text{ K}$) |
| **05** | **03. Carrier Concentrations** | The Law of Charge Neutrality & Mass Action | $p_0 + N_D^+ = n_0 + N_A^-, \quad n_0 p_0 = n_i^2$ | Dual-Pan Holographic Balance Gauge |
| **06** | **04. Fermi Level ($E_F$)** | Doping & Temperature Dependence of $E_F$ | $E_F - E_i = k_B T \ln\left(\frac{n_0}{n_i}\right)$ | Band Alignment & Fermi Shifts |
| **07** | **05. Equilibrium Concentrations** | Degenerate vs Non-Degenerate | $(E_c - E_F) > 3k_B T \iff n_0 < 0.1 N_c$ | Degeneracy & Bandgap Narrowing |
| **08** | **06. Drift & Diffusion** | Carrier Drift & Electric Field Transport | $v_d = \mu \mathcal{E}, \quad J_{drift} = q(n\mu_n + p\mu_p)\mathcal{E}$ | Live Carrier Drift Simulator |
| **09** | **06. Drift & Diffusion** | Carrier Diffusion & The Einstein Relation | $\frac{D_n}{\mu_n} = \frac{D_p}{\mu_p} = \frac{k_B T}{q}$ | Diffusion Gradients & Einstein Relation |
| **10** | **07. Conductivity & Mobility** | Mobility & Scattering Mechanisms | $\frac{1}{\mu} = \frac{1}{\mu_L} + \frac{1}{\mu_I}$ | 3D Lattice Scattering & Matthiessen Model |
| **11** | **08. Carrier Lifetime** | Recombination-Generation Mechanisms | $R_{net} = \frac{\Delta n}{\tau_n} = \frac{\Delta p}{\tau_p}$ | Radiative, SRH & Auger Mechanisms |
| **12** | **08. Carrier Lifetime** | Carrier Lifetime & Diffusion Length | $L_n = \sqrt{D_n \tau_n}, \quad L_p = \sqrt{D_p \tau_p}$ | Minority Lifetime & Diffusion Length |
| **13** | **09. Poisson & Continuity** | Poisson's Equation in Semiconductors | $\frac{d^2\psi}{dx^2} = -\frac{\rho(x)}{\epsilon_s} = -\frac{q}{\epsilon_s}(p - n + N_D^+ - N_A^-)$ | Space Charge & Electric Field Profile |
| **14** | **09. Poisson & Continuity** | The Continuity Equation & Transport | $\frac{\partial n}{\partial t} = \frac{1}{q}\nabla \cdot J_n + (G_n - R_n)$ | Continuity Current Divergence |
| **15** | **10. Hall Effect** | Lorentz Force & Hall Voltage Generation | $V_H = \frac{I B}{q n t} = R_H \frac{I B}{t}$ | Live Hall Effect Simulator |
| **16** | **10. Hall Effect** | Hall Coefficient & Modern Sensors | $R_H = -\frac{1}{q n} \quad \text{or} \quad +\frac{1}{q p}$ | Sensor Applications & Hall Mobility |
| **17** | **Conclusion** | THANK YOU — Semiconductor Physics | $\oint_{\text{silicon}} \text{Future} = \infty$ | Interactive Q&A Accordion Bank |

---

## 🎮 Presentation Controls & Keyboard Shortcuts

| Key | Action |
| :-: | :--- |
| `→` / `Space` / `PageDown` | Advance to Next Slide |
| `←` / `Backspace` / `PageUp` | Return to Previous Slide |
| `Home` / `End` | Jump to First / Final Slide |
| `O` | Toggle 18-Slide Matrix Grid Overview |
| `Q` | Open Interactive Q&A / Formula Hub |
| `F` | Toggle Fullscreen Presentation Mode |
| `P` | Toggle Auto-Play Presentation (8s timer) |
| `M` | Mute / Unmute Cyber Sound Effects |

---

## 💻 Tech Stack

- **Core Engine**: Vanilla JavaScript (ES Modules)
- **Styling**: CSS3 Custom Properties (Cyber-Dashboard, Neon Glassmorphism)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Formula Typesetting**: [KaTeX](https://katex.org/)
- **Bundler / Dev Server**: [Vite](https://vitejs.dev/)

---

## 🛠️ Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn`

### Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mishrarishi1135-a11y/semiconductor-physics-presentation.git
   cd semiconductor-physics-presentation
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   The compiled bundle will be in the `dist/` directory ready for deployment.

---

## 📄 License & Attribution

Developed for academic presentation and classroom instruction in **Semiconductor Physics (`PCEC-514`)**.  
All rights reserved © 2026 Presentation Team (Avanish Kumar, Anuj Mishra, Khushi Ezaz, Aanand Kumar Singh, Dheeraj Kumar).
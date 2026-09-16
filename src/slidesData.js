// Complete Semiconductor Physics Presentation Data
// 22 Slides total: Slide 0 (Landing) + 10 Topics x 2 Slides (1 to 20) + Slide 21 (Thank You & Q&A)

export const slidesData = [
  // ==========================================
  // SLIDE 0: HERO LANDING PAGE
  // ==========================================
  {
    id: 0,
    topicNum: "00",
    topicTitle: "SYSTEM OVERVIEW",
    title: "Semiconductor Physics",
    subtitle: "The Foundation of Modern Electronics",
    category: "WELCOME & OVERVIEW",
    tagline: "Interactive 3D Masterclass Presentation",
    subjectCode: "PCEC-514",
    teacherName: "Dr. Paramjit Kaur",
    type: "hero",
    description: "Welcome to this interactive presentation on Semiconductor Physics. Explore how atomic-scale quantum phenomena empower every computer chip, sensor, and solar cell powering human civilization.",
    bullets: [
      { label: "10 Core Topics", text: "From Energy Band Theory to the Hall Effect & Continuity Equations" },
      { label: "20 Deep-Dive Slides", text: "Mathematically rigorous derivations & physical insights" },
      { label: "Interactive Simulations", text: "Real-time carrier drift, band bending, and Lorentz force simulators" },
      { label: "Futuristic HUD", text: "Keyboard navigation, slide overview matrix, and live concept explorer" }
    ],
    cta: "LAUNCH PRESENTATION",
    teamMembers: [
      { name: "Avanish Kumar", regNo: "254044038", role: "Presenter / Researcher" },
      { name: "Anuj Mishra", regNo: "254074003", role: "Lead Presenter / Architecture" },
      { name: "Khushi Ezaz", regNo: "2633033", role: "Presenter / Analysis" },
      { name: "Aanand Kumar Singh", regNo: "254044037", role: "Presenter / Device Physics" },
      { name: "Dheeraj Kumar", regNo: "254044039", role: "Presenter / Solid State" }
    ]
  },

  // ==========================================
  // TOPIC 01: ENERGY BAND THEORY IN CRYSTALS
  // ==========================================
  {
    id: 1,
    topicNum: "01",
    subSlide: "",
    topicTitle: "ENERGY BAND THEORY",
    title: "Formation of Energy Bands & Bandgap",
    category: "BAND THEORY IN CRYSTALS",
    tagline: "From Discrete Atomic Orbitals to Continuous Energy Bands",
    type: "content",
    formula: "E_g = E_c - E_v",
    formulaDesc: "The fundamental energy gap separating the valence and conduction bands",
    overview: "When isolated atoms are brought together to form a periodic crystal lattice, discrete atomic energy levels split due to wave-function overlap and the Pauli Exclusion Principle, forming continuous energy bands separated by forbidden energy gaps.",
    points: [
      {
        title: "Pauli Exclusion & Orbital Splitting",
        detail: "As N atoms condense into an interatomic spacing 'a', each isolated atomic level splits into N closely spaced sub-levels, forming virtually continuous bands."
      },
      {
        title: "Valence Band (VB) vs Conduction Band (CB)",
        detail: "The Valence Band corresponds to the highest occupied energy states at 0K. The Conduction Band represents the lowest unoccupied states available for free electrical conduction."
      },
      {
        title: "The Forbidden Bandgap (Eg)",
        detail: "No electron states exist inside Eg in an ideal crystal. In Insulators Eg > 5 eV (e.g., Diamond ~5.5 eV); in Semiconductors Eg ≈ 0.2 to 3.0 eV (Silicon = 1.12 eV, Germanium = 0.66 eV); in Metals bands overlap (Eg = 0)."
      }
    ],
    interactiveType: "bandgap-comparison",
    keyTakeaway: "Semiconductors are uniquely characterized by an intermediate band gap (Eg ~ 1 eV), allowing thermal energy at room temperature (kT ≈ 26 meV) to excite significant carriers across the gap."
  },

  // ==========================================
  // TOPIC 02: CHARGE CARRIERS IN SEMICONDUCTORS
  // ==========================================
  {
    id: 3,
    topicNum: "02",
    subSlide: "1/2",
    topicTitle: "CHARGE CARRIERS",
    title: "Generation of Electrons & Holes",
    category: "CARRIERS IN SEMICONDUCTORS",
    tagline: "Thermal Agitation and the Physics of Holes",
    type: "content",
    formula: "E_{bond} \\approx E_g \\quad \\xrightarrow{k_B T} \\quad e^- + h^+",
    formulaDesc: "Thermal generation creates an Electron-Hole Pair (EHP) conserving net neutrality",
    overview: "In a tetravalent semiconductor crystal like Silicon, each atom forms four covalent bonds. At absolute zero (0K), all valence electrons are bound. At room temperature (300K), thermal energy ruptures bonds, creating mobile electrons and vacancies called holes.",
    points: [
      {
        title: "Electron-Hole Pair (EHP) Generation",
        detail: "When a covalent bond is broken, an electron is promoted to the conduction band, leaving an unfilled state (vacancy) in the valence band."
      },
      {
        title: "The Nature of a 'Hole'",
        detail: "A hole behaves mathematically as a particle with positive electric charge (+q), positive effective mass (m_p*), and positive drift velocity along the electric field."
      },
      {
        title: "Intrinsic Equilibrium",
        detail: "In pure (undoped) semiconductors, charge carriers are always created in pairs: intrinsic electron concentration (n) strictly equals intrinsic hole concentration (p = n = ni)."
      }
    ],
    interactiveType: "lattice-carrier",
    keyTakeaway: "Conduction in semiconductors is dual: negative electrons moving in the conduction band, and adjacent valence electrons sequentially hopping into vacant states, effectively moving positive holes."
  },

  {
    id: 4,
    topicNum: "02",
    subSlide: "2/2",
    topicTitle: "CHARGE CARRIERS",
    title: "Extrinsic Semiconductors: Doping (n-type & p-type)",
    category: "CARRIERS IN SEMICONDUCTORS",
    tagline: "Controlled Impurities: Donors, Acceptors and Ionization",
    type: "content",
    formula: "N_D^+ \\approx N_D \\quad \\text{(n-type)} \\qquad N_A^- \\approx N_A \\quad \\text{(p-type)}",
    formulaDesc: "Complete ionization of dopants at room temperature determines majority carrier concentration",
    overview: "Doping is the intentional introduction of specific impurity atoms into the semiconductor lattice to dramatically manipulate electrical conductivity by many orders of magnitude.",
    points: [
      {
        title: "n-type Doping (Pentavalent Donors)",
        detail: "Group V elements (P, As, Sb) substitute Silicon atoms. Four valence electrons bond with Si; the 5th electron is loosely bound (binding energy ~ 0.045 eV) and ionizes at 300K, creating donor ions (ND+) and free electrons (n >> p)."
      },
      {
        title: "p-type Doping (Trivalent Acceptors)",
        detail: "Group III elements (B, Ga, In) create a missing bond. An electron from an adjacent bond is easily accepted, leaving a mobile hole in the VB and a stationary negative acceptor ion (NA-), making p >> n."
      },
      {
        title: "Ionization Energies & Freeze-out",
        detail: "At very low T (< 50K), carriers freeze out onto parent impurity atoms. At 300K, nearly 100% of dopants are ionized."
      }
    ],
    interactiveType: "doping-visualizer",
    keyTakeaway: "Doping allows conductivity to be tuned over 8 orders of magnitude (from 10^-6 S/cm in pure Si to 10^3 S/cm in heavily doped Si) without changing the physical crystal matrix."
  },

  // ==========================================
  // TOPIC 03: CARRIER CONCENTRATIONS
  // ==========================================
  {
    id: 5,
    topicNum: "03",
    subSlide: "1/2",
    topicTitle: "CARRIER CONCENTRATIONS",
    title: "Fermi-Dirac Function",
    category: "CARRIER DYNAMICS",
    tagline: "Occupancy Probability Distribution in Thermal Equilibrium",
    type: "content",
    formula: "f(E) = \\frac{1}{1 + \\exp\\left(\\frac{E - E_F}{k_B T}\\right)}",
    formulaDesc: "Fermi-Dirac probability distribution determining quantum state occupancy at temperature T",
    overview: "The Fermi-Dirac function gives the probability that an available energy state of E will be occupied by an electron at a given temperature.",
    points: [
      {
        title: "Physical Meaning & Definition",
        detail: "The Fermi-Dirac function f(E) gives the probability that an available quantum energy state of E will be occupied by an electron at a given temperature T."
      },
      {
        title: "Occupancy at Fermi Energy (E = EF)",
        detail: "At E = EF, the exponential term is e^0 = 1, so f(EF) = 1 / (1 + 1) = 0.5 (exactly 50% probability) at all temperatures T > 0K."
      },
      {
        title: "Absolute Zero (0K) vs Boltzmann Tail",
        detail: "At T = 0K, f(E) is a perfect step: 1 for E < EF, and 0 for E > EF. When (E - EF) > 3 kBT, it simplifies to the Maxwell-Boltzmann tail: f(E) ≈ exp[-(E - EF) / kBT]."
      }
    ],
    interactiveType: "fermi-dirac-plot",
    keyTakeaway: "The Fermi-Dirac function f(E) provides the statistical foundation of semiconductor physics, dictating that states below EF are predominantly filled while states above EF are predominantly empty."
  },

  {
    id: 6,
    topicNum: "03",
    subSlide: "2/2",
    topicTitle: "CARRIER CONCENTRATIONS",
    title: "The Law of Charge Neutrality and Mass Action Law",
    category: "CARRIER DYNAMICS",
    tagline: "Electrostatic Balance, Dopant Ionization & The Neutrality Equation",
    type: "content",
    formula: "p_0 + N_D^+ = n_0 + N_A^- \\qquad \\& \\qquad n_0 \\cdot p_0 = n_i^2",
    formulaDesc: "Coupled Fundamental Relations: Macroscopic Charge Neutrality and the Law of Mass Action",
    overview: "The Law of Charge Neutrality states that any semiconductor in macroscopic thermal equilibrium remains electrically neutral throughout its bulk volume. The sum of all positive charge densities (free holes and ionized donors) exactly balances the sum of all negative charge densities (free electrons and ionized acceptors).",
    points: [
      {
        title: "The Charge Neutrality Equation",
        detail: "Under thermal equilibrium, the net space charge density ρ = 0 everywhere: p + ND+ = n + NA-. Under complete dopant ionization at room temperature (300K), this becomes p + ND = n + NA."
      },
      {
        title: "Coupling with Law of Mass Action (n·p = ni²)",
        detail: "Substituting p = ni² / n yields the quadratic form: n² - (ND - NA)n - ni² = 0. Solving this gives n0 = [(ND - NA) + √((ND - NA)² + 4ni²)] / 2. For uncompensated n-type (ND >> ni), n0 ≈ ND and minority p0 ≈ ni² / ND."
      },
      {
        title: "Compensated Semiconductors & Neutrality",
        detail: "In crystals with both donor (ND) and acceptor (NA) impurities, the net effective dopant density (ND - NA) dictates carrier concentration while the crystal remains strictly electrically neutral."
      }
    ],
    interactiveType: "charge-neutrality-sim",
    keyTakeaway: "A doped semiconductor is NOT electrically charged: introducing donor or acceptor atoms introduces equal numbers of mobile carriers and oppositely charged immobile ionic cores, strictly preserving net electrostatic neutrality (ρ = 0)."
  },

  // ==========================================
  // TOPIC 04: FERMI LEVEL (EF)
  // ==========================================
  {
    id: 8,
    topicNum: "04",
    subSlide: "",
    topicTitle: "FERMI LEVEL",
    title: "Doping & Temperature Dependence of EF",
    category: "ELECTROCHEMICAL POTENTIAL",
    tagline: "Tuning the Fermi Level across the Bandgap",
    type: "content",
    formula: "E_F - E_i = k_B T \\ln\\left( \\frac{N_D}{n_i} \\right) \\quad \\text{or} \\quad E_i - E_F = k_B T \\ln\\left( \\frac{N_A}{n_i} \\right)",
    formulaDesc: "Quantitative shift of EF relative to midgap Ei as a function of donor or acceptor doping",
    overview: "Doping moves the Fermi level closer to the majority band edge: upward toward the conduction band for n-type, and downward toward the valence band for p-type.",
    points: [
      {
        title: "Doping Shift Magnitude",
        detail: "For n-type Si with ND = 10^17 cm^-3, EF lies ~0.41 eV above Ei (just ~0.15 eV below Ec). For p-type with NA = 10^17 cm^-3, EF lies ~0.41 eV below Ei."
      },
      {
        title: "Three Temperature Regimes",
        detail: "1. Freeze-out Regime (T < 100K): thermal energy is insufficient to ionize dopants; EF is pinned near donor/acceptor levels. 2. Extrinsic Regime (100K - 450K): all dopants ionized, n0 ≈ ND, EF slowly moves toward midgap. 3. Intrinsic Regime (T > 500K): ni >> ND, semiconductor reverts to intrinsic behavior and EF → Ei."
      },
      {
        title: "Practical Device Limit",
        detail: "At elevated temperatures (e.g. > 150-200°C for Si), ni exceeds intentional doping, causing junction leakage and thermal breakdown of semiconductor devices."
      }
    ],
    interactiveType: "fermi-temp-shift",
    keyTakeaway: "Controlling the position of EF via doping is the fundamental mechanism used to create built-in potentials and depletion barriers across PN junctions and MOSFETs."
  },

  // ==========================================
  // TOPIC 05: EQUILIBRIUM CARRIER CONCENTRATION
  // ==========================================
  {
    id: 10,
    topicNum: "05",
    subSlide: "",
    topicTitle: "EQUILIBRIUM CONCENTRATIONS",
    title: "Degenerate vs Non-Degenerate Semiconductors",
    category: "STATISTICAL EQUILIBRIUM",
    tagline: "Heavy Doping Limits and Fermi-Dirac Integrals",
    type: "content",
    formula: "n_0 = N_c \\mathcal{F}_{1/2}\\left(\\frac{E_F - E_c}{k_B T}\\right), \\quad \\text{Degeneracy when } N_D > N_c",
    formulaDesc: "Exact carrier formulation requiring the complete Fermi-Dirac Integral of order 1/2",
    overview: "When doping is moderate (ND < 10^18 cm^-3), semiconductors are 'non-degenerate' and follow simple Boltzmann statistics. When doping is extremely high (ND > 10^19 cm^-3), the semiconductor becomes 'degenerate' and displays metallic properties.",
    points: [
      {
        title: "Non-Degenerate Criterion",
        detail: "The Fermi level remains inside the forbidden gap and is separated from both band edges by at least 3 kBT (~75 meV at 300K). The Boltzmann approximation is valid with < 5% error."
      },
      {
        title: "Degenerate Behavior (n+ and p+ Regions)",
        detail: "When ND approaches or exceeds Nc, EF moves into the conduction band (EF > Ec). The states near the band edge are fully filled, requiring full Fermi-Dirac integrals."
      },
      {
        title: "Bandgap Narrowing (BGN)",
        detail: "High dopant density causes wave-function overlap between impurity atoms and band-tailing, physically shrinking Eg by 50-100 meV in emitter regions of bipolar transistors."
      }
    ],
    interactiveType: "degeneracy-diagram",
    keyTakeaway: "Degenerate semiconductors (n+, p+) behave like metals with low contact resistance and high electrical conductivity, serving as interconnects, source/drain terminals, and tunnel junctions."
  },

  // ==========================================
  // TOPIC 06: CARRIER DRIFT AND DIFFUSION
  // ==========================================
  {
    id: 11,
    topicNum: "06",
    subSlide: "1/2",
    topicTitle: "DRIFT & DIFFUSION",
    title: "Carrier Drift & Electric Field Transport",
    category: "CARRIER TRANSPORT MECHANISMS",
    tagline: "Field-Driven Acceleration, Collisions, and Drift Velocity",
    type: "content",
    formula: "v_d = \\mu \\mathcal{E}, \\qquad J_{drift} = q (n \\mu_n + p \\mu_p) \\mathcal{E}",
    formulaDesc: "Drift velocity and total drift current density driven by an applied electric field E",
    overview: "Drift is the net motion of charged carriers superimposed upon random thermal motion caused by the electrostatic force of an applied electric field.",
    points: [
      {
        title: "Microscopic Drift Mechanism",
        detail: "Electrons undergo rapid random thermal motion (~10^7 cm/s at 300K), colliding with lattice atoms every ~0.1 picoseconds (τc). An applied field E accelerates them between collisions, creating a slow net drift velocity vd."
      },
      {
        title: "Linear Low-Field Drift",
        detail: "At low electric fields (E < 10^3 V/cm), drift velocity is strictly proportional to field: vd = μ E. Electron mobility μn is higher than hole mobility μp due to lighter effective mass."
      },
      {
        title: "High-Field Velocity Saturation",
        detail: "At high electric fields (E > 10^4 V/cm, standard in modern nanoscale MOSFETs), optical phonon emission limits carrier speed to a saturation velocity vsat ≈ 10^7 cm/s."
      }
    ],
    interactiveType: "drift-sim",
    keyTakeaway: "Drift current is proportional to carrier density, carrier mobility, and electric field. Velocity saturation places an intrinsic upper limit on the switching speed of modern transistors."
  },

  {
    id: 12,
    topicNum: "06",
    subSlide: "2/2",
    topicTitle: "DRIFT & DIFFUSION",
    title: "Carrier Diffusion & The Einstein Relation",
    category: "CARRIER TRANSPORT MECHANISMS",
    tagline: "Concentration Gradients, Fick's Law, and Thermal Equilibrium",
    type: "content",
    formula: "J_{diff} = q D_n \\frac{dn}{dx} - q D_p \\frac{dp}{dx}, \\qquad \\frac{D}{\\mu} = \\frac{k_B T}{q} = V_t",
    formulaDesc: "Total diffusion current density and the fundamental Einstein Relation linking D and μ",
    overview: "Diffusion is the natural transport of particles from regions of high concentration to regions of low concentration via random thermal motion. In semiconductors, this particle flux carries electrical current.",
    points: [
      {
        title: "Diffusion Current Polarity",
        detail: "Electrons diffuse down their gradient (negative dn/dx). Since electron charge is -q, the electrical current flows in the same direction as the spatial gradient: Jn,diff = +q Dn (dn/dx)."
      },
      {
        title: "Total Current Density (Drift + Diffusion)",
        detail: "The unified current equation is: J_total = Jn + Jp = (q n μn E + q Dn dn/dx) + (q p μp E - q Dp dp/dx)."
      },
      {
        title: "The Einstein Relation",
        detail: "At thermal equilibrium with no external bias, drift and diffusion currents must exactly cancel everywhere (J_net = 0). This requires Dn / μn = Dp / μp = kBT / q = Vt (Thermal voltage ≈ 25.85 mV at 300K)."
      }
    ],
    interactiveType: "diffusion-sim",
    keyTakeaway: "The Einstein relation is a deep thermodynamic truth: the same thermal scattering mechanisms that impede drift mobility (μ) also govern particle diffusion (D)."
  },

  // ==========================================
  // TOPIC 07: CONDUCTIVITY AND MOBILITY
  // ==========================================
  {
    id: 13,
    topicNum: "07",
    subSlide: "",
    topicTitle: "CONDUCTIVITY & MOBILITY",
    title: "Mobility & Scattering Mechanisms",
    category: "MATERIAL CONDUCTANCE",
    tagline: "Lattice Phonons vs Ionized Impurity Scattering",
    type: "content",
    formula: "\\frac{1}{\\mu} = \\frac{1}{\\mu_{lattice}} + \\frac{1}{\\mu_{impurity}} \\quad \\text{(Matthiessen's Rule)}",
    formulaDesc: "Carrier mobility limited by parallel independent microscopic scattering probabilities",
    overview: "Carrier mobility μ = q τc / m* measures how easily an electron or hole drifts through a crystal under an applied electric field. It is primarily limited by two independent scattering mechanisms.",
    points: [
      {
        title: "Lattice (Acoustic Phonon) Scattering (μL)",
        detail: "Thermal vibration of crystal atoms disturbs lattice periodicity. As temperature rises, lattice vibrations increase, causing more collisions: μL ∝ T^(-3/2). Dominates at high temperatures in lightly doped crystals."
      },
      {
        title: "Ionized Impurity Scattering (μI)",
        detail: "Coulombic deflection by stationary charged dopant ions (ND+, NA-). At higher temperatures, faster carriers spend less time near ions and deflect less: μI ∝ T^(+3/2) / N_impurity. Dominates at low temperatures and heavy doping."
      },
      {
        title: "Combined Temperature Profile",
        detail: "Mobility exhibits a characteristic peak at intermediate temperatures where the competing T^(3/2) and T^(-3/2) dependencies intersect."
      }
    ],
    interactiveType: "mobility-temp-plot",
    keyTakeaway: "Matthiessen's rule dictates that the strongest scattering mechanism always limits overall mobility. Heavy doping substantially degrades mobility due to intense Coulombic scattering."
  },

  // ==========================================
  // TOPIC 08: CARRIER LIFETIME
  // ==========================================
  {
    id: 15,
    topicNum: "08",
    subSlide: "1/2",
    topicTitle: "CARRIER LIFETIME",
    title: "Recombination-Generation Mechanisms",
    category: "CARRIER RECOMBINATION DYNAMICS",
    tagline: "Restoring Thermal Equilibrium via Energy Dissipation",
    type: "content",
    formula: "R_{net} = R - G = \\frac{\\Delta n}{\\tau}, \\qquad \\Delta n(t) = \\Delta n_0 \\exp\\left(-\\frac{t}{\\tau}\\right)",
    formulaDesc: "Net recombination rate and exponential relaxation of excess carriers back to equilibrium",
    overview: "When external excitation (optical illumination, electrical injection) creates excess carriers (Δn, Δp), the system seeks to return to thermal equilibrium through recombination, releasing energy as photons or heat.",
    points: [
      {
        title: "Radiative (Band-to-Band) Recombination",
        detail: "An electron directly transitions from the conduction band into an empty state in the valence band, emitting a photon with energy hν ≈ Eg. Highly dominant in direct bandgap materials like GaAs and InP."
      },
      {
        title: "Shockley-Read-Hall (SRH) Recombination",
        detail: "Defect or impurity deep-level states (traps) in the midgap capture electrons and holes sequentially, releasing energy as lattice phonons (heat). Dominant recombination mechanism in indirect bandgap Silicon."
      },
      {
        title: "Auger Recombination",
        detail: "A three-particle collision where an electron and hole recombine, but the released energy is transferred as kinetic energy to a third carrier (electron or hole). Dominates at very high injection levels and heavy doping."
      }
    ],
    interactiveType: "recombination-types",
    keyTakeaway: "Silicon's indirect bandgap suppresses fast radiative recombination, enabling long carrier lifetimes (microseconds to milliseconds) that make high-gain transistors and solar cells possible."
  },

  {
    id: 16,
    topicNum: "08",
    subSlide: "2/2",
    topicTitle: "CARRIER LIFETIME",
    title: "Carrier Lifetime & Diffusion Length",
    category: "CARRIER RECOMBINATION DYNAMICS",
    tagline: "Minority Carrier Longevity and Characteristic Travel Distance",
    type: "content",
    formula: "L_n = \\sqrt{D_n \\tau_n}, \\qquad L_p = \\sqrt{D_p \\tau_p}",
    formulaDesc: "Diffusion length L: the average distance a minority carrier travels before recombining",
    overview: "Minority carrier lifetime (τ) and diffusion length (L) are the paramount figures of merit for bipolar junction transistors (BJTs), solar cells, and p-i-n photodetectors.",
    points: [
      {
        title: "Minority Carrier Lifetime (τ)",
        detail: "Because majority carriers are overwhelmingly abundant, the lifetime of injected minority carriers dictates device physics. In clean float-zone Silicon, τ can exceed 1 ms; in defective silicon, it drops to nanoseconds."
      },
      {
        title: "Physical Meaning of Diffusion Length (L)",
        detail: "L represents the spatial decay constant of injected excess carriers: Δn(x) = Δn(0) exp(-x/L). In typical Silicon, Ln ≈ 100 to 300 μm."
      },
      {
        title: "BJT Base Transit Requirement",
        detail: "For a BJT to exhibit high current gain (β > 100), the physical base width Wb must be designed much smaller than the minority carrier diffusion length (Wb << Lb), ensuring nearly all injected carriers reach the collector."
      }
    ],
    interactiveType: "diffusion-length-decay",
    keyTakeaway: "Diffusion length Ln = √(Dn τn) connects time (τ) and space (L). High-efficiency devices require ultra-clean wafers to maximize minority carrier lifetime."
  },

  // ==========================================
  // TOPIC 09: POISSON'S AND CONTINUITY EQUATIONS
  // ==========================================
  {
    id: 17,
    topicNum: "09",
    subSlide: "1/2",
    topicTitle: "POISSON'S & CONTINUITY",
    title: "Poisson's Equation in Semiconductors",
    category: "DEVICE PHYSICS EQUATIONS",
    tagline: "Linking Electrostatic Potential to Space Charge Densities",
    type: "content",
    formula: "\\nabla^2 \\psi = -\\frac{\\rho}{\\epsilon_s} = -\\frac{q}{\\epsilon_s}\\left(p - n + N_D^+ - N_A^-\\right)",
    formulaDesc: "Poisson's equation for electrostatic potential ψ in a medium with semiconductor dielectric permittivity εs",
    overview: "Poisson's equation is Gauss's law in differential form applied to semiconductors. It provides the exact mathematical link between the local net space charge density ρ(x) and electrostatic potential ψ(x).",
    points: [
      {
        title: "Net Space Charge Density ρ(x)",
        detail: "The charge density accounts for both mobile carriers (holes p, electrons n) and fixed uncompensated ionized dopants (ND+, NA-): ρ = q(p - n + ND - NA)."
      },
      {
        title: "The Depletion Approximation",
        detail: "In a PN junction depletion region, mobile carriers are swept out by the high field (n ≈ 0, p ≈ 0). The space charge consists solely of ionized donors (+q ND) on the n-side and ionized acceptors (-q NA) on the p-side."
      },
      {
        title: "Electric Field Integration",
        detail: "Integrating Poisson's equation once yields the electric field: E(x) = -dψ/dx = (1/εs) ∫ ρ(x') dx'. The peak electric field occurs precisely at the metallurgical junction."
      }
    ],
    interactiveType: "poisson-pn-junction",
    keyTakeaway: "Poisson's equation enables engineers to calculate the depletion width, peak electric field, junction capacitance, and breakdown voltage of any semiconductor junction."
  },

  {
    id: 18,
    topicNum: "09",
    subSlide: "2/2",
    topicTitle: "POISSON'S & CONTINUITY",
    title: "The Continuity Equation & Transport Physics",
    category: "DEVICE PHYSICS EQUATIONS",
    tagline: "Conservation of Charge: Drift, Diffusion, Generation, and Recombination",
    type: "content",
    formula: "\\frac{\\partial n}{\\partial t} = \\frac{1}{q} \\nabla \\cdot \\vec{J}_n + (G_n - R_n), \\quad \\frac{\\partial p}{\\partial t} = -\\frac{1}{q} \\nabla \\cdot \\vec{J}_p + (G_p - R_p)",
    formulaDesc: "Fundamental continuity equations governing the time rate of change of carrier concentrations",
    overview: "The continuity equations are the semiconductor equivalents of the Navier-Stokes equations in fluid dynamics. They enforce conservation of electric charge within any differential control volume.",
    points: [
      {
        title: "Physical Interpretation of Terms",
        detail: "The rate of carrier buildup (∂n/∂t) equals the spatial divergence of incoming current (flux gradient ∇·Jn/q) plus the volumetric generation rate Gn minus the volumetric recombination rate Rn."
      },
      {
        title: "1D Steady-State Diffusion Equation",
        detail: "Under steady state (∂n/∂t = 0), zero electric field (drift = 0), and low-level injection, the equation simplifies to: Dn (d²Δn/dx²) - Δn/τn = 0, whose solution is exponential decay Δn(x) ∝ exp(-x/Ln)."
      },
      {
        title: "The Semiconductor Device Equation Set",
        detail: "Together with Poisson's equation and the drift-diffusion current equations, the continuity equations form the fundamental system of coupled non-linear differential equations solved by all modern TCAD device simulators."
      }
    ],
    interactiveType: "continuity-flow",
    keyTakeaway: "Every semiconductor device in existence—from simple diodes to 2nm GAA-FETs—is mathematically governed by the simultaneous solution of Poisson's and Continuity equations."
  },

  // ==========================================
  // TOPIC 10: THE HALL EFFECT
  // ==========================================
  {
    id: 19,
    topicNum: "10",
    subSlide: "1/2",
    topicTitle: "THE HALL EFFECT",
    title: "Lorentz Force & Hall Voltage Generation",
    category: "GALVANOMAGNETIC PHENOMENA",
    tagline: "Magnetic Deflection of Moving Carriers in Solids",
    type: "content",
    formula: "\\vec{F} = q\\left(\\vec{\\mathcal{E}} + \\vec{v} \\times \\vec{B}\\right), \\qquad V_H = \\frac{I B}{q n w} = \\frac{R_H I B}{w}",
    formulaDesc: "The Lorentz force balance generating transverse Hall voltage across a current-carrying semiconductor",
    overview: "Discovered by Edwin Hall in 1879, the Hall effect occurs when a current-carrying conductor or semiconductor is placed in a perpendicular magnetic field, generating a transverse electric voltage perpendicular to both current and field.",
    points: [
      {
        title: "The Lorentz Force Mechanism",
        detail: "When a current I flows along the x-axis and a magnetic field B is applied along the z-axis, moving carriers experience a lateral Lorentz force FL = q (vx × Bz) along the y-axis."
      },
      {
        title: "Transverse Charge Accumulation",
        detail: "Both electrons and holes are deflected to the SAME lateral edge if current flows in the same direction! However, electrons build a negative surface charge while holes build a positive surface charge, producing opposite Hall voltages."
      },
      {
        title: "Dynamic Equilibrium",
        detail: "Charge piles up until the induced transverse electrostatic Hall field EH exactly cancels the magnetic Lorentz force: q EH = q vd B. At this balance, net lateral deflection stops."
      }
    ],
    interactiveType: "hall-effect-sim",
    keyTakeaway: "The Hall effect is the definitive experimental technique used to unambiguously prove whether conduction is dominated by negative electrons or positive holes."
  },

  {
    id: 20,
    topicNum: "10",
    subSlide: "2/2",
    topicTitle: "THE HALL EFFECT",
    title: "Hall Coefficient & Modern Sensor Technology",
    category: "GALVANOMAGNETIC PHENOMENA",
    tagline: "Carrier Metrology, Hall Mobility, and Industrial Applications",
    type: "content",
    formula: "R_H = -\\frac{1}{q n} \\quad \\text{(n-type)}, \\qquad R_H = +\\frac{1}{q p} \\quad \\text{(p-type)}, \\qquad \\mu_H = |R_H| \\sigma",
    formulaDesc: "The Hall coefficient RH directly yields majority carrier type, concentration, and Hall mobility",
    overview: "The Hall coefficient RH is a definitive material property. Measuring RH alongside electrical conductivity σ provides the complete electronic profile of any unknown semiconductor wafer.",
    points: [
      {
        title: "Determining Carrier Type and Density",
        detail: "The sign of RH immediately indicates the carrier type (negative for n-type, positive for p-type). The magnitude |RH| directly yields carrier concentration: n = 1 / (q |RH|)."
      },
      {
        title: "Determining Hall Mobility (μH)",
        detail: "Combining Hall measurement with conductivity (σ = q n μ) yields mobility directly: μH = |RH| σ. This eliminates geometric uncertainties in contact resistance."
      },
      {
        title: "Modern Industrial Applications",
        detail: "1. Gaussmeters & Precision Magnetometers. 2. Brushless DC (BLDC) Motor rotor position sensors in electric vehicles (EVs). 3. Contactless Hall current sensors in smartphone power ICs. 4. Quantum Hall Effect (von Klitzing constant RK = h/e²) used as the worldwide resistance standard."
      }
    ],
    interactiveType: "hall-applications",
    keyTakeaway: "From fundamental quantum physics standards to billions of brushless motor sensors produced annually, the Hall effect is an indispensable bridge between magnetism and semiconductor electronics."
  },

  // ==========================================
  // SLIDE 21: FUTURISTIC THANK YOU & Q&A HUB
  // ==========================================
  {
    id: 21,
    topicNum: "11",
    subSlide: "CONCLUSION",
    topicTitle: "CONCLUSION & Q&A",
    title: "THANK YOU",
    subtitle: "Empowering the Next Century of Quantum & Semiconductor Innovation",
    category: "INTERACTIVE Q&A & ARCHIVE",
    tagline: "Questions, Mathematical Review & Open Discussion",
    type: "conclusion",
    description: "Thank you for attending this presentation on Semiconductor Physics. From the quantum mechanics of band theory to device-scale transport, these principles power every microprocessor, neural accelerator, and quantum computer on the planet.",
    points: [
      {
        title: "Presentation Summary",
        detail: "Covered all 10 foundational pillars: Energy Bands, Carriers, Concentrations, Fermi Level, Equilibrium, Drift-Diffusion, Mobility, Lifetimes, Poisson/Continuity, and Hall Effect."
      },
      {
        title: "Interactive Features",
        detail: "Use the 'Questions?' button or press 'Q' to open the interactive Concept & Formula Quick Finder for in-class queries."
      },
      {
        title: "Full Deck Navigation",
        detail: "Press 'O' at any time to open the full visual 22-slide overview matrix and jump directly to any topic for discussion."
      }
    ],
    cta: "OPEN QUESTIONS & FORMULA HUB"
  }
];

// Quick Q&A Database for the interactive "Questions?" Modal
export const questionsData = [
  {
    topic: "Energy Bands",
    question: "Why does Silicon have an indirect bandgap while GaAs has a direct bandgap?",
    answer: "In Silicon, the conduction band minimum is shifted along the [100] k-axis relative to the valence band maximum at k=0. Conserving crystal momentum during recombination requires emitting or absorbing a lattice phonon. In GaAs, both extrema align at k=0 (the Γ point), enabling direct photon emission with 1000x higher optical efficiency."
  },
  {
    topic: "Carrier Concentrations",
    question: "Why does the Law of Mass Action (n·p = ni²) hold true even for heavily doped semiconductors?",
    answer: "At thermal equilibrium, the product of the probabilities that conduction states are occupied and valence states are empty is governed by the Boltzmann tails. Increasing electrons enhances the recombination rate with holes until a new equilibrium is reached where the n·p product remains equal to ni²(T), provided the semiconductor remains non-degenerate."
  },
  {
    topic: "Fermi Level",
    question: "What happens to the Fermi level as temperature approaches absolute zero (0K)?",
    answer: "In an n-type semiconductor at T → 0K (freeze-out regime), thermal energy is insufficient to ionize donor atoms. Electrons fall back into the donor states, and the Fermi level EF rises to settle halfway between the donor energy level ED and the conduction band edge Ec."
  },
  {
    topic: "Drift & Diffusion",
    question: "What is the physical meaning of the Einstein Relation Dn/μn = kBT/q?",
    answer: "Both drift and diffusion arise from the same microscopic collision mechanisms. The Einstein relation proves that the ratio of particle diffusion (thermal random walk) to drift mobility (directed acceleration) is fundamentally fixed by thermal voltage Vt = kBT/q."
  },
  {
    topic: "Hall Effect",
    question: "Why do electrons and holes accumulate on the SAME side of a sample in the Hall effect?",
    answer: "Because holes move along the current direction (+vx) with positive charge (+q), while electrons move opposite to the current (-vx) with negative charge (-q). Calculating the Lorentz force F = q (v × B): for holes, (+q)(+vx × +Bz) = -y direction; for electrons, (-q)(-vx × +Bz) = -y direction! Both are deflected to the same physical edge, but their opposite charges create opposite polarity Hall voltages."
  },
  {
    topic: "Continuity Equations",
    question: "How do the continuity equations reduce in steady-state minority carrier injection?",
    answer: "Under steady state (∂n/∂t = 0), zero electric field in the neutral region, and uniform thermal generation, the equation simplifies to the 1D diffusion equation: Dn (d²Δn/dx²) = Δn/τn. The solution is an exponential decay with characteristic spatial decay length Ln = √(Dn τn)."
  }
];

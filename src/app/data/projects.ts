export type ProjectCategory = 'Software' | 'Hardware';
export type ProjectDiscipline = 'Robotics' | 'AI / ML' | 'Simulation' | 'Web';

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: ProjectCategory;
  discipline: ProjectDiscipline;
  featured: boolean;
  tech: string[];
  image: string;
  imageAlt: string;
  description: string;
  fullDescription: string;
  role: string;
  status: string;
  year: string;
  challenge: string;
  approach: string;
  outcomes: string[];
  stats: { label: string; value: string }[];
  github: string;
  demo: string;
  color: string;
}

const githubPreview = (repository: string) =>
  `https://opengraph.githubassets.com/portfolio-phase-2/paneendrakumar0/${repository}`;

export const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    slug: 'uav-autonomous-telemetry',
    title: 'UAV Autonomous Telemetry',
    category: 'Hardware',
    discipline: 'Robotics',
    featured: true,
    tech: ['ROS 2', 'PX4 SITL', 'Gazebo', 'Python', 'Geometric Control'],
    image: '/projects/uav-trajectory.png',
    imageAlt: 'Plot comparing the reference and actual UAV figure-eight trajectory',
    description: 'A research-grade UAV control and telemetry workspace with slung-payload validation.',
    fullDescription:
      'A ROS 2 and PX4 SITL research workspace for offboard UAV control, telemetry logging, figure-eight trajectory validation, controller benchmarking, and slung-payload experiments in Gazebo Classic.',
    role: 'Control systems, simulation, telemetry, and experimental validation',
    status: 'Active research',
    year: '2026',
    challenge:
      'Validate autonomous flight and payload-aware control while keeping every experiment reproducible and measurable.',
    approach:
      'Built ROS 2 offboard-control nodes, PX4/Gazebo payload models, CSV telemetry pipelines, plotting tools, repeatability runs, parameter sweeps, and matched-rate controller comparisons.',
    outcomes: [
      'Completed sustained figure-eight flight with a native ball-joint slung payload.',
      'Documented a matched-rate comparison where geometric control reduced mean payload tracking error by 20.2%.',
      'Calibrated payload instrumentation and recorded an 11.7% reduction in mean cable angle versus the PX4 baseline.',
    ],
    stats: [
      { label: 'Tracking improvement', value: '20.2%' },
      { label: 'Cable-angle reduction', value: '11.7%' },
      { label: 'Environment', value: 'PX4 SITL' },
      { label: 'Year', value: '2026' },
    ],
    github: 'https://github.com/paneendrakumar0/uav-autonomous-telemetry',
    demo: '',
    color: '#22d3ee',
  },
  {
    id: 2,
    slug: 'aim-rl',
    title: 'AIM-RL Robotic Arm Stack',
    category: 'Hardware',
    discipline: 'AI / ML',
    featured: true,
    tech: ['ROS 2', 'Gazebo', 'OpenCV', 'C++', 'Reinforcement Learning', 'MoveIt'],
    image: '/projects/aim-rl-architecture.png',
    imageAlt: 'Architecture diagram for the AIM-RL robotic arm software stack',
    description: 'A simulation-first 6-DOF robotic-arm stack spanning perception, control, RL, and hardware.',
    fullDescription:
      'A seven-package ROS 2 workspace designed to mature a robotic arm in simulation before hardware deployment, covering a digital twin, perception, Cartesian control, reinforcement-learning scaffolding, planning, and serial communication.',
    role: 'System architecture, ROS 2 integration, control, perception, and validation',
    status: 'Validated scaffold',
    year: '2026',
    challenge:
      'Create one coherent path from camera observations to safe joint commands without requiring physical hardware during early development.',
    approach:
      'Connected synthetic and Gazebo camera streams to an OpenCV tracker, Cartesian IK, JointTrajectory output, checksum-protected serial packets, and automated smoke tests.',
    outcomes: [
      'Built a 6-DOF URDF/Xacro digital twin with Gazebo and optional ros2_control integration.',
      'Connected camera perception to target pose, Cartesian IK, joint trajectory, and serial dry-run output.',
      'Added automated build, launch, dependency, topic-flow, and RL smoke tests.',
    ],
    stats: [
      { label: 'ROS packages', value: '7' },
      { label: 'Arm', value: '6-DOF' },
      { label: 'Validation', value: 'Smoke-tested' },
      { label: 'Year', value: '2026' },
    ],
    github: 'https://github.com/paneendrakumar0/AIM-RL',
    demo: '',
    color: '#a855f7',
  },
  {
    id: 3,
    slug: 'ros2-robotic-hand',
    title: 'ROS 2 Robotic Hand Digital Twin',
    category: 'Software',
    discipline: 'Simulation',
    featured: true,
    tech: ['ROS 2', 'RViz2', 'Python', 'MediaPipe', 'URDF'],
    image: '/acreenshot 2026-01-17 225251.png',
    imageAlt: 'DexHand robotic hand digital twin displayed in RViz',
    description: 'An articulated robotic-hand digital twin with demo and camera-tracking modes.',
    fullDescription:
      'A ROS 2 simulation package for DexHand V2 with full finger articulation, wrist rotation, a preconfigured RViz2 environment, automated motion demonstrations, and real-time camera hand tracking.',
    role: 'ROS package design, visualization, motion control, and camera tracking',
    status: 'Public and documented',
    year: '2026',
    challenge:
      'Make a high-DOF robotic hand easy to inspect and control without requiring repeated manual RViz configuration.',
    approach:
      'Packaged controller logic, launch files, RViz configuration, smoothing, automated gestures, and MediaPipe tracking into repeatable ROS 2 launch modes.',
    outcomes: [
      'Supports automated range-of-motion demonstrations and real-time camera mirroring.',
      'Provides a preconfigured RViz2 layout with RobotModel and TF displays.',
      'Published complete installation, launch, and package-structure documentation.',
    ],
    stats: [
      { label: 'Modes', value: 'Demo + Camera' },
      { label: 'Runtime', value: 'ROS 2' },
      { label: 'Language', value: 'Python' },
      { label: 'Year', value: '2026' },
    ],
    github: 'https://github.com/paneendrakumar0/Robotic-Hand-Simulation-in-ROS2',
    demo: '',
    color: '#8b5cf6',
  },
  {
    id: 4,
    slug: 'video-to-mesh',
    title: 'Video-to-Mesh Pipeline',
    category: 'Software',
    discipline: 'AI / ML',
    featured: false,
    tech: ['Python', 'Nerfstudio', 'COLMAP', 'Gaussian Splatting', 'FFmpeg'],
    image: '/projects/v2m.png',
    imageAlt: 'GitHub preview for the Video-to-Mesh reconstruction pipeline',
    description: 'An automated pipeline that converts raw video into a reusable 3D mesh.',
    fullDescription:
      'A command-line video-to-mesh pipeline that extracts frames, estimates camera poses with COLMAP, trains a Gaussian Splatting representation through Nerfstudio, and exports OBJ or PLY geometry.',
    role: 'Pipeline automation, CLI design, logging, and tests',
    status: 'Working pipeline',
    year: '2026',
    challenge:
      'Turn a multi-tool 3D reconstruction workflow into one repeatable process with clear outputs and failure visibility.',
    approach:
      'Automated preprocessing, camera-pose estimation, reconstruction training, mesh export, structured logging, and pytest coverage behind a single CLI.',
    outcomes: [
      'Accepts a raw video and orchestrates the full reconstruction workflow.',
      'Exports standard OBJ or PLY geometry for downstream 3D tools.',
      'Includes unit tests and logging suitable for repeatable pipeline runs.',
    ],
    stats: [
      { label: 'Input', value: 'Video' },
      { label: 'Output', value: 'OBJ / PLY' },
      { label: 'Compute', value: 'CUDA GPU' },
      { label: 'Year', value: '2026' },
    ],
    github: 'https://github.com/paneendrakumar0/V2M',
    demo: '',
    color: '#f472b6',
  },
  {
    id: 5,
    slug: 'dual-arm-interception',
    title: 'Dual-Arm Interception Simulation',
    category: 'Software',
    discipline: 'Simulation',
    featured: false,
    tech: ['Python', 'PyBullet', 'NumPy', 'Robot Kinematics', 'Experiment Automation'],
    image: githubPreview('dual-arm-interception-simulation'),
    imageAlt: 'GitHub preview for the dual-arm interception simulation',
    description: 'Two simulated robot arms coordinate to intercept and stabilize a moving component.',
    fullDescription:
      'A deterministic PyBullet research demonstrator for trajectory prediction, coordinated interception, contact measurement, experiment reporting, and cinematic output generation.',
    role: 'Simulation architecture, experiment automation, and visualization',
    status: 'PyBullet baseline',
    year: '2026',
    challenge:
      'Coordinate two manipulators around a dynamic target while producing measurable results and presentation-ready visual evidence.',
    approach:
      'Implemented a portable simulator with configurable trials, contact metrics, rendered frames, report generation, and a roadmap toward ROS 2 and Isaac Sim.',
    outcomes: [
      'Produces capture metrics, timing data, rendered frames, and encoded demonstration videos.',
      'Includes randomized experiment runs with CSV, JSON, and Markdown reports.',
      'Keeps the current PyBullet baseline separate from the planned ROS 2 and Isaac Sim stages.',
    ],
    stats: [
      { label: 'Arms', value: 'Dual' },
      { label: 'Physics', value: 'PyBullet' },
      { label: 'Reports', value: 'CSV + JSON' },
      { label: 'Year', value: '2026' },
    ],
    github: 'https://github.com/paneendrakumar0/dual-arm-interception-simulation',
    demo: '',
    color: '#f59e0b',
  },
  {
    id: 6,
    slug: 'hybrid-racing-controller',
    title: 'Hybrid AI Racing Controller',
    category: 'Hardware',
    discipline: 'Robotics',
    featured: false,
    tech: ['Arduino', 'Python', 'OpenCV', 'MediaPipe', 'PySerial'],
    image: '/projects/hybrid-racing.png',
    imageAlt: 'GitHub preview for the hybrid AI racing controller',
    description: 'A physical steering wheel paired with touchless gesture-based throttle and braking.',
    fullDescription:
      'A DIY racing interface that combines potentiometer steering with webcam gesture recognition, serial communication, and virtual input control for PC racing games.',
    role: 'Hardware integration, computer vision, and input control',
    status: 'Active prototype',
    year: '2026',
    challenge:
      'Combine low-cost analog steering with touchless controls while keeping the interaction responsive and configurable.',
    approach:
      'Mapped potentiometer readings to steering input and used OpenCV plus MediaPipe gestures for acceleration and braking over a 115200-baud serial link.',
    outcomes: [
      'Supports analog-like steering with configurable dead zones and sensitivity.',
      'Maps open-palm and closed-fist gestures to throttle and brake actions.',
      'Documents hardware wiring, firmware, and the Python control stack.',
    ],
    stats: [
      { label: 'Serial', value: '115200 baud' },
      { label: 'Sensor', value: '10kΩ pot' },
      { label: 'Vision', value: 'MediaPipe' },
      { label: 'Year', value: '2026' },
    ],
    github: 'https://github.com/paneendrakumar0/Hybrid-Racing-Sim',
    demo: '',
    color: '#ef4444',
  },
  {
    id: 7,
    slug: 'expense-tracker',
    title: 'Expense Tracker',
    category: 'Software',
    discipline: 'Web',
    featured: false,
    tech: ['JavaScript', 'HTML', 'CSS', 'localStorage'],
    image: githubPreview('expensetracker'),
    imageAlt: 'GitHub preview for the browser expense tracker',
    description: 'A responsive browser app for tracking income, expenses, and running balance.',
    fullDescription:
      'A lightweight personal-finance interface built with vanilla web technologies, persistent browser storage, transaction creation and deletion, and a live running balance.',
    role: 'Frontend development and browser data persistence',
    status: 'Live demo',
    year: '2025',
    challenge:
      'Create a useful financial tracker without frameworks or a backend.',
    approach:
      'Used DOM state, transaction calculations, responsive CSS, and localStorage persistence.',
    outcomes: [
      'Supports adding and deleting income or expense transactions.',
      'Recalculates the running balance immediately.',
      'Persists data locally between browser sessions.',
    ],
    stats: [
      { label: 'Framework', value: 'Vanilla JS' },
      { label: 'Storage', value: 'Local' },
      { label: 'Demo', value: 'Live' },
      { label: 'Year', value: '2025' },
    ],
    github: 'https://github.com/paneendrakumar0/expensetracker',
    demo: 'https://paneendrakumar0.github.io/expensetracker/',
    color: '#34d399',
  },
  {
    id: 8,
    slug: 'color-palette-generator',
    title: 'Color Palette Generator',
    category: 'Software',
    discipline: 'Web',
    featured: false,
    tech: ['JavaScript', 'HTML', 'CSS', 'Clipboard API'],
    image: '/projects/color-palette.png',
    imageAlt: 'GitHub preview for the color palette generator',
    description: 'A live color tool for generating and copying reusable HEX palettes.',
    fullDescription:
      'A compact browser tool that generates configurable color palettes and lets designers or developers copy HEX values for immediate use.',
    role: 'Frontend development and interaction design',
    status: 'Live demo',
    year: '2025',
    challenge:
      'Make palette exploration fast, understandable, and immediately reusable.',
    approach:
      'Combined random color generation, configurable palette size, clear HEX presentation, and clipboard interaction.',
    outcomes: [
      'Generates a fresh set of colors on demand.',
      'Displays reusable HEX values clearly.',
      'Publishes a public GitHub Pages demo.',
    ],
    stats: [
      { label: 'Output', value: 'HEX' },
      { label: 'Copy', value: 'One click' },
      { label: 'Demo', value: 'Live' },
      { label: 'Year', value: '2025' },
    ],
    github: 'https://github.com/paneendrakumar0/paneendrakumar.colorpalette.io',
    demo: 'https://paneendrakumar0.github.io/paneendrakumar.colorpalette.io/',
    color: '#60a5fa',
  },
];

/**
 * Starfield Video & Phase Configuration
 *
 * Use this file to:
 * 1. Add, remove, or modify videos streaming through hyperspace.
 * 2. Configure timing, phases, angles, or sizing without editing Starfield.tsx.
 */

export interface VideoItemConfig {
  /** Optional unique identifier. Defaults to 'v-' + index */
  id?: string;
  /** Video file name in public directory (e.g. 'Dj Night.mp4') */
  filename: string;
  /**
   * Display title.
   * If omitted, automatically derived from filename (e.g. 'Dj Night.mp4' -> 'Dj Night').
   */
  name?: string;
  /** Base directory in public folder. Defaults to '/shishir-2024' */
  baseDir?: string;
  /**
   * Radial flight angle in degrees (-180 to 180).
   * If omitted, automatically distributed around 360 degrees.
   */
  angleDeg?: number;
  /**
   * Timeline start time in GSAP units.
   * If omitted, automatically calculated across the flight phase.
   */
  start?: number;
  /**
   * Timeline end time in GSAP units.
   * If omitted, automatically calculated as (start + videoFlightDuration).
   */
  end?: number;
  /** Optional phase / category tag (e.g. 'phase-1', 'culture', 'dance') */
  phase?: number | string;
}

export interface ResolvedStarfieldVideo {
  id: string;
  name: string;
  videoSrc: string;
  angleDeg: number;
  start: number;
  end: number;
  phase?: number | string;
}

export interface StarfieldPhaseTiming {
  /** Duration of Phase A (Portal expanding from 0px & logo zoom-in). Default: 2.2 */
  portalOpenDuration: number;
  /** Start time of video flight phase (Phase B). Default: 2.4 */
  flightPhaseStart: number;
  /**
   * ⏱️ PARAMETER 1: VIDEO FLIGHT DURATION (Flight-time on screen)
   * How many GSAP seconds an individual video takes to travel from center (0,0) to edge.
   * - Higher (e.g. 5.0s): Video stays on screen longer, flies more leisurely.
   * - Lower (e.g. 3.0s): Video flies faster across the screen.
   * Default: 4.2
   */
  videoFlightDuration: number;
  /**
   * ⏱️ PARAMETER 2: TIME BETWEEN CONSECUTIVE VIDEOS (Gap between video-frames)
   * Time delay before the NEXT video starts emerging from the center.
   * - Higher (e.g. 1.8s): Slower cadence, more breathing room between videos.
   * - Lower (e.g. 0.9s): Faster cadence, videos emerge in rapid succession.
   * Default: 1.35
   * 💡 Rule of thumb: (videoFlightDuration / timeBetweenVideos) determines how many
   * videos are active on screen simultaneously. 4.2 / 1.35 = ~3 concurrent videos!
   */
  timeBetweenVideos: number;
  /** End time of video flight phase (Phase B). Default: 19.0 */
  flightPhaseEnd: number;
  /** Start time of Phase C (Portal shrinking back to 0px & logo zoom-out). Default: 19.2 */
  portalCloseStart: number;
  /** Duration of Phase C portal shrink. Default: 2.6 */
  portalCloseDuration: number;
  /** Total timeline duration. Default: 22.0 */
  totalTimelineDuration: number;
  /**
   * 📜 PARAMETER 3: SCROLL RUNWAY (Scroll duration of entire section)
   * Controls how much physical wheel/trackpad scrolling is needed to complete the flight.
   * - Higher (e.g. '+=2500%'): Slower scroll velocity, more effortless viewing.
   * - Lower (e.g. '+=1200%'): Faster scroll velocity, fewer wheel spins needed.
   * Default: '+=2000%'
   */
  scrollRunway: string;
}

export interface StarfieldVisualConfig {
  /** Responsive CSS class for video card width. Sized generously for high visual impact */
  cardWidthClass: string;
  /** Initial scale at center singularity */
  initialScale: number;
  /** Exit scale as video passes screen borders */
  exitScale: number;
  /** Distance factor beyond viewport edge */
  distanceFactor: number;
}

/**
 * =========================================================================
 * ⏱️ TIMING & SCROLL CONTROLS
 * =========================================================================
 * Modify these parameters to adjust flight durations, gap between videos, and scroll length!
 */
export const STARFIELD_TIMING: StarfieldPhaseTiming = {
  portalOpenDuration: 2.2,
  flightPhaseStart: 2.4,

  // 1️⃣ VIDEO FLIGHT TIME (how long each video card is visible flying across screen)
  videoFlightDuration: 7.2,

  // 2️⃣ TIME BETWEEN VIDEOS (time delay before next video emerges from center)
  timeBetweenVideos: 1.3,

  // 3️⃣ SCROLL RUNWAY (physical scroll length of the entire Starfield section)
  scrollRunway: '+=1800%',

  // End of video flight phase (calculated as flightPhaseStart + (numVideos - 1) * timeBetweenVideos + videoFlightDuration)
  flightPhaseEnd: 19.0,

  // Phase C: Portal shrink & exit logo
  portalCloseStart: 19.2,
  portalCloseDuration: 2.6,
  totalTimelineDuration: 22.0,
};

/**
 * =========================================================================
 * 🔍 VIDEO SCALE & SIZING CONTROLS
 * =========================================================================
 * Modify these parameters to easily change how large or small the videos appear!
 */
export const STARFIELD_VISUAL: StarfieldVisualConfig = {
  /**
   * 1. BASE CARD DIMENSIONS (CSS Width)
   * Sized generously so 2-3 cards float across separate quadrants with zero area overlap
   * - clamp(min, preferred, max)
   */
  cardWidthClass: 'w-[clamp(300px,30vw,480px)]',

  /**
   * 2. STARTING SCALE (at center singularity)
   * Scale factor when the video first emerges from the center point (0, 0):
   * - Default: 0.06 (6% of base card width)
   */
  initialScale: 0.04,

  /**
   * 3. MAXIMUM / EXIT SCALE (at screen borders & beyond)
   * Scale multiplier when the video reaches its closest point to the camera:
   * - Default: 2.7 (270% of base card width)
   */
  exitScale: 2.9,

  /**
   * 4. TRAVEL DISTANCE BEYOND SCREEN
   * Multiplier of screen diagonal hypot(W, H):
   * - Default: 0.85 (flies completely past screen borders)
   */
  distanceFactor: 0.85,
};

/**
 * Raw video items list with non-overlapping 4-quadrant rotation.
 * 
 * 💡 You DO NOT need to calculate start and end times manually!
 * They are automatically calculated from:
 *   start = STARFIELD_TIMING.flightPhaseStart + index * STARFIELD_TIMING.timeBetweenVideos
 *   end   = start + STARFIELD_TIMING.videoFlightDuration
 *
 * (You can still supply explicit `start` and `end` if you want a custom override for a specific video).
 */
export const RAW_STARFIELD_VIDEOS: VideoItemConfig[] = [
  {
    filename: 'Dj Night.mp4',
    angleDeg: -35, // Quadrant 1: Top-Right
    phase: 1,
  },
  {
    filename: 'Cultural Dance.mp4',
    angleDeg: 145, // Quadrant 3: Bottom-Left
    phase: 1,
  },
  {
    filename: 'Dance Competition.mp4',
    angleDeg: -145, // Quadrant 2: Top-Left
    phase: 1,
  },
  {
    filename: 'Modeling.mp4',
    angleDeg: 35, // Quadrant 4: Bottom-Right
    phase: 2,
  },
  {
    filename: 'Flute Guest.mp4',
    angleDeg: -65, // Quadrant 1: Top-Right (Up)
    phase: 2,
  },
  {
    filename: 'Drama.mp4',
    angleDeg: 115, // Quadrant 3: Bottom-Left (Down)
    phase: 2,
  },
  {
    filename: 'Singing.mp4',
    angleDeg: -160, // Quadrant 2: Top-Left (Far)
    phase: 3,
  },
  {
    filename: 'Prom-Night.mp4',
    angleDeg: 70, // Quadrant 4: Bottom-Right (Down)
    phase: 3,
  },
  {
    filename: 'Symphony.mp4',
    angleDeg: -115, // Quadrant 2: Top-Left (Up)
    phase: 3,
  },
  {
    filename: 'Panache.mp4',
    angleDeg: 20, // Quadrant 4: Bottom-Right (Far)
    phase: 3,
  },
];

/**
 * Resolves video items, ensuring valid paths, derived event names (matching video name),
 * well-spaced flight timings, and balanced directional angles.
 */
export function getResolvedStarfieldVideos(
  customVideos: VideoItemConfig[] = RAW_STARFIELD_VIDEOS,
  timing: StarfieldPhaseTiming = STARFIELD_TIMING
): ResolvedStarfieldVideo[] {
  const count = customVideos.length;
  if (count === 0) return [];

  const flightDuration = timing.videoFlightDuration;
  const timeStep = timing.timeBetweenVideos ?? 1.35;

  // Antipodal alternating angles (each consecutive video points to opposite quadrant)
  const defaultAngles = [-30, 150, -135, 45, -75, 105, -15, 165, -120, 60];

  return customVideos.map((item, idx) => {
    // Name is strictly derived from the video filename (without .mp4) unless explicitly given
    const cleanName = item.name || item.filename.replace(/\.mp4$/i, '').trim();

    const baseDir = item.baseDir || '/shishir-2024';
    const normalizedDir = baseDir.endsWith('/') ? baseDir.slice(0, -1) : baseDir;
    const encodedFilename = encodeURIComponent(item.filename).replace(/%2F/g, '/');
    const videoSrc = `${normalizedDir}/${encodedFilename}`;

    const angleDeg = item.angleDeg !== undefined
      ? item.angleDeg
      : (idx < defaultAngles.length ? defaultAngles[idx] : ((idx * 137.5) % 360) - 180);

    const start = item.start !== undefined
      ? item.start
      : Number((timing.flightPhaseStart + idx * timeStep).toFixed(2));

    const end = item.end !== undefined
      ? item.end
      : Number((start + flightDuration).toFixed(2));

    return {
      id: item.id || `v-${idx + 1}`,
      name: cleanName,
      videoSrc,
      angleDeg,
      start,
      end,
      phase: item.phase,
    };
  });
}

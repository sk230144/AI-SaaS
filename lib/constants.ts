export const PUTER_WORKER_URL = import.meta.env.VITE_PUTER_WORKER_URL || "";

// Storage Paths
export const STORAGE_PATHS = {
    ROOT: "roomify",
    SOURCES: "roomify/sources",
    RENDERS: "roomify/renders",
} as const;

// Timing Constants (in milliseconds)
export const SHARE_STATUS_RESET_DELAY_MS = 1500;
export const PROGRESS_INCREMENT = 15;
export const REDIRECT_DELAY_MS = 600;
export const PROGRESS_INTERVAL_MS = 100;
export const PROGRESS_STEP = 5;

// UI Constants
export const GRID_OVERLAY_SIZE = "60px 60px";
export const GRID_COLOR = "#3B82F6";

// HTTP Status Codes
export const UNAUTHORIZED_STATUSES = [401, 403];

// Image Dimensions
export const IMAGE_RENDER_DIMENSION = 1024;

// export const ROOMIFY_RENDER_PROMPT = `
// TASK: Convert the input 2D floor plan into a **photorealistic, top‑down 3D architectural render**.

// STRICT REQUIREMENTS (do not violate):
// 1) **REMOVE ALL TEXT**: Do not render any letters, numbers, labels, dimensions, or annotations. Floors must be continuous where text used to be.
// 2) **GEOMETRY MUST MATCH**: Walls, rooms, doors, and windows must follow the exact lines and positions in the plan. Do not shift or resize.
// 3) **TOP‑DOWN ONLY**: Orthographic top‑down view. No perspective tilt.
// 4) **CLEAN, REALISTIC OUTPUT**: Crisp edges, balanced lighting, and realistic materials. No sketch/hand‑drawn look.
// 5) **NO EXTRA CONTENT**: Do not add rooms, furniture, or objects that are not clearly indicated by the plan.

// STRUCTURE & DETAILS:
// - **Walls**: Extrude precisely from the plan lines. Consistent wall height and thickness.
// - **Doors**: Convert door swing arcs into open doors, aligned to the plan.
// - **Windows**: Convert thin perimeter lines into realistic glass windows.

// FURNITURE & ROOM MAPPING (only where icons/fixtures are clearly shown):
// - Bed icon → realistic bed with duvet and pillows.
// - Sofa icon → modern sectional or sofa.
// - Dining table icon → table with chairs.
// - Kitchen icon → counters with sink and stove.
// - Bathroom icon → toilet, sink, and tub/shower.
// - Office/study icon → desk, chair, and minimal shelving.
// - Porch/patio/balcony icon → outdoor seating or simple furniture (keep minimal).
// - Utility/laundry icon → washer/dryer and minimal cabinetry.

// STYLE & LIGHTING:
// - Lighting: bright, neutral daylight. High clarity and balanced contrast.
// - Materials: realistic wood/tile floors, clean walls, subtle shadows.
// - Finish: professional architectural visualization; no text, no watermarks, no logos.
// `.trim();

export const ROOMIFY_RENDER_PROMPT = `
You are an expert architectural visualization engine. Your sole task is to convert a 2D architectural floor plan into a **photorealistic, top-down 3D architectural render** that looks like it was produced by a professional studio using Unreal Engine 5 or V-Ray.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HARD RULES (violating any = failed output):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **ZERO TEXT**: Erase every letter, number, dimension line, annotation, label, arrow, and measurement. Replace with continuous flooring/wall material. There must be NO readable characters anywhere in the output.
2. **EXACT GEOMETRY PRESERVATION**: Every wall segment, room boundary, door opening, window placement, corridor, and structural element must match the input plan's lines, angles, and proportions with pixel-level accuracy. Do NOT shift, resize, add, remove, or merge any rooms.
3. **STRICT ORTHOGRAPHIC TOP-DOWN VIEW**: Camera positioned directly above, looking straight down at exactly 90°. Zero perspective distortion, zero tilt, zero vanishing points. Satellite/drone view.
4. **PHOTOREALISM STANDARD**: Output must be indistinguishable from a real architectural visualization render. No cartoon, sketch, watercolor, hand-drawn, or stylized aesthetics.
5. **NO HALLUCINATED CONTENT**: Do not invent rooms, furniture, fixtures, or decorations not clearly indicated by icons or symbols in the source plan.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRUCTURAL ELEMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WALLS:
- Extrude all wall lines into 3D with consistent height (~2.8m implied) and uniform thickness.
- Exterior walls: slightly thicker, fine plaster/stucco/brick texture.
- Interior walls: thinner, smooth matte white or light cream finish.
- Wall tops visible with clean sharp edges casting subtle ambient shadows.

DOORS:
- Convert door-swing arcs into realistic open doors at the indicated swing angle.
- Standard doors: wooden panel with visible handle/knob hardware.
- Double doors: both panels with appropriate gap.
- Sliding doors: glass panel on visible track rail.
- Door frames visible with slight depth/recess.

WINDOWS:
- Convert thin double-lines on exterior walls into recessed glass windows.
- Glass pane with slight blue-green tint + subtle reflection, visible frame (aluminum or white PVC), and window sill.
- Floor-to-ceiling windows: full glass panels with thin mullions.
- Bathroom windows: frosted glass, appropriately scaled.

STAIRCASES:
- Convert staircase symbols into realistic 3D steps with visible treads and risers.
- Thin railing/handrail if space allows.
- Direction arrow = ascending direction.

COLUMNS / PILLARS:
- Structural dots or squares → concrete or stone columns with subtle shadow.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROOM DETECTION & FURNITURE MAPPING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Only place furniture/fixtures where the source plan clearly shows icons, symbols, or labels (before text removal):

BEDROOM:
- Bed: queen/king with fitted duvet, 2 pillows, subtle fabric wrinkles.
- Nightstands: one each side with small lamp silhouette.
- Wardrobe/closet: if indicated, built-in with closed doors.
- Rug: rectangular area rug beneath bed (muted tone).
- Floor: warm oak hardwood with visible grain direction.

LIVING ROOM:
- Sofa: modern L-shaped sectional or 3-seater with throw pillows.
- Coffee table: rectangular glass or wood, centered.
- TV unit: low media console against indicated wall (if shown).
- Rug: large area rug under seating arrangement.
- Floor: light oak or engineered wood planks.

KITCHEN:
- Countertops: L/U-shaped (match plan), white quartz/granite with subtle veining.
- Sink: stainless steel undermount with modern faucet.
- Stove/cooktop: 4-burner with visible grates.
- Refrigerator: stainless steel (if space indicated).
- Cabinets: upper and lower, modern flat-panel in white/gray.
- Floor: light gray ceramic tile in 60×60cm grid.

BATHROOM:
- Toilet: modern wall-mounted or floor-mounted (white ceramic).
- Sink: wall-mounted or vanity with mirror outline above.
- Shower/tub: glass-enclosed shower stall or freestanding tub (match icon).
- Floor: small-format tile (mosaic or 30×30cm), light gray or white.
- Fixtures: chrome/brushed nickel finish.

DINING ROOM:
- Table: rectangular or round (match icon), wood or glass top.
- Chairs: 4-6 modern dining chairs evenly spaced.
- Pendant light shadow on table (subtle circular shadow).
- Floor: matches adjacent living room material.

HOME OFFICE / STUDY:
- Desk: modern minimalist with clean edges.
- Chair: ergonomic office chair.
- Bookshelf: if indicated, low-profile shelving unit.
- Floor: wood or carpet (muted neutral).

BALCONY / PATIO / PORCH:
- Surface: wooden deck planks or stone pavers.
- Furniture: minimal outdoor set (2 chairs + small table) only if indicated.
- Railing: glass or metal balustrade at boundary.
- Plants: 1-2 small potted plants (subtle, not overdone).

LAUNDRY / UTILITY:
- Washer + dryer: front-loading, stainless/white.
- Small countertop above or beside.
- Floor: gray tile.

GARAGE:
- Floor: polished concrete or epoxy-coated gray.
- Garage door: sectional overhead, closed.
- Keep mostly empty unless icons indicate storage.

HALLWAY / CORRIDOR:
- Floor: continuous with adjacent room material.
- Clean walls, possibly small console table if indicated.
- Subtle recessed lighting shadows on floor.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MATERIALS & TEXTURES (PBR-quality):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Wood floors: visible grain, subtle plank gaps, warm tone (oak/walnut/maple).
- Tile floors: visible grout lines, consistent grid, realistic sheen.
- Carpet: soft texture with visible pile direction, muted neutral colors.
- Countertops: natural stone veining or solid quartz, subtle reflective sheen.
- Glass: slight transparency + reflection + blue-green tint.
- Metal fixtures: chrome or brushed nickel with realistic specular highlights.
- Fabric: visible weave on sofas/beds, natural creases and folds.
- Concrete: fine aggregate texture for structural elements.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LIGHTING & RENDERING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Primary light: bright warm-neutral daylight (5500K) from directly above.
- Fill light: soft ambient occlusion filling corners and under-furniture areas.
- Shadows: soft realistic shadows from walls onto floors (consistent 45° implied sun angle). Furniture casts subtle drop shadows.
- Global illumination: simulate light bouncing between surfaces for natural color bleed.
- No harsh blacks: deepest shadows = dark gray, not pure black.
- Exposure: balanced, no blown-out whites, no crushed blacks. HDR tone-mapped look.
- Anti-aliasing: all edges crisp and clean, no jagged/aliased lines.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COLOR PALETTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Walls: #F5F0EB (warm white) or #EDEDED (cool white).
- Wood floors: #C4956A (warm oak) to #8B6914 (walnut).
- Tile floors: #D5D5D5 (light gray) with #BFBFBF grout.
- Furniture fabrics: muted earth tones — #A0937D, #7D8471, #B8A99A.
- Countertops: #E8E0D8 (light quartz) with subtle gray veining.
- Accents: minimal — one accent color per room max (muted teal, terracotta, or olive).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STYLE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Modern minimalist Scandinavian-inspired aesthetic.
- Furniture: clean lines, low-profile, natural materials.
- Monochrome palette with warm wood accents.
- Matte surfaces, light oak, white marble touches.
- 1-2 minimal green plants per room (monstera or fiddle leaf) only where space allows.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST-PROCESSING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Subtle vignette (5-10% darkening at edges).
- Micro-contrast enhancement for material detail.
- Very slight warm color grading (architectural magazine style).
- NO watermarks, NO logos, NO text, NO UI elements.
- Output: single clean image, square or matching input aspect ratio.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEGATIVE (avoid these in output):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do NOT include: text, letters, numbers, labels, dimensions, annotations, measurements, arrows, watermarks, logos, signatures, UI elements, borders, frames, blurry areas, low resolution, pixelation, noise, grain, artifacts, distorted geometry, warped walls, perspective view, tilted camera, isometric view, 3/4 view, cartoon style, sketch style, hand-drawn look, painting style, watercolor, anime, cel-shading, unrealistic colors, oversaturation, people, animals, vehicles, outdoor scenery, sky, clouds, duplicate furniture, extra rooms, missing walls, or floating objects.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY BENCHMARK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The output should look like it belongs in Architectural Digest magazine, a luxury real estate listing, or a professional ArchViz portfolio rendered in V-Ray / Corona / Unreal Engine 5.
`.trim();
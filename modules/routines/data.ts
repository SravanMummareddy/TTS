import type { Routine, RoutineLog } from './types'

// ── Routines ──────────────────────────────────────────────────────────────────

export const SEED_ROUTINES: Routine[] = [
  {
    id: 'routine-ms',
    name: 'Morning Skincare',
    category: 'skincare',
    color: '#ec4899',
    icon: '✨',
    timeSlot: 'morning',
    customTime: null,
    active: true,
    createdAt: '2026-04-09',
    variants: [
      {
        id: 'variant-ms-default',
        routineId: 'routine-ms',
        days: [],  // default — fires every day
        label: null,
        order: 0,
        items: [
          { id: 'ms-1', variantId: 'variant-ms-default', text: 'Cleanser',        optional: false, order: 0, notes: null },
          { id: 'ms-2', variantId: 'variant-ms-default', text: 'Toner',           optional: false, order: 1, notes: null },
          { id: 'ms-3', variantId: 'variant-ms-default', text: 'Vitamin C serum', optional: false, order: 2, notes: null },
          { id: 'ms-4', variantId: 'variant-ms-default', text: 'Moisturiser',     optional: false, order: 3, notes: null },
          { id: 'ms-5', variantId: 'variant-ms-default', text: 'SPF 50',          optional: false, order: 4, notes: null },
          { id: 'ms-6', variantId: 'variant-ms-default', text: 'Eye cream',       optional: true,  order: 5, notes: null },
        ],
      },
    ],
  },
  {
    id: 'routine-ns',
    name: 'Night Skincare',
    category: 'skincare',
    color: '#a855f7',
    icon: '🌙',
    timeSlot: 'night',
    customTime: null,
    active: true,
    createdAt: '2026-04-09',
    variants: [
      {
        id: 'variant-ns-default',
        routineId: 'routine-ns',
        days: [],  // default — fires every day
        label: null,
        order: 0,
        items: [
          { id: 'ns-1', variantId: 'variant-ns-default', text: 'Makeup remover',    optional: false, order: 0, notes: null },
          { id: 'ns-2', variantId: 'variant-ns-default', text: 'Cleanser',          optional: false, order: 1, notes: null },
          { id: 'ns-3', variantId: 'variant-ns-default', text: 'Exfoliating toner', optional: false, order: 2, notes: null },
          { id: 'ns-4', variantId: 'variant-ns-default', text: 'Retinol',           optional: true,  order: 3, notes: 'Skip if skin is irritated' },
          { id: 'ns-5', variantId: 'variant-ns-default', text: 'Night moisturiser', optional: false, order: 4, notes: null },
        ],
      },
    ],
  },
  {
    id: 'routine-hc',
    name: 'Hair Care',
    category: 'hair',
    color: '#0ea5e9',
    icon: '💆',
    timeSlot: 'morning',
    customTime: null,
    active: true,
    createdAt: '2026-04-09',
    variants: [
      {
        id: 'variant-hc-mwf',
        routineId: 'routine-hc',
        days: [1, 3, 5],  // Mon, Wed, Fri — no default so absent on other days
        label: null,
        order: 0,
        items: [
          { id: 'hc-1', variantId: 'variant-hc-mwf', text: 'Pre-shampoo oil',         optional: true,  order: 0, notes: null },
          { id: 'hc-2', variantId: 'variant-hc-mwf', text: 'Shampoo',                 optional: false, order: 1, notes: null },
          { id: 'hc-3', variantId: 'variant-hc-mwf', text: 'Conditioner (3 min)',     optional: false, order: 2, notes: null },
          { id: 'hc-4', variantId: 'variant-hc-mwf', text: 'Hair mask',               optional: true,  order: 3, notes: 'Once a week' },
          { id: 'hc-5', variantId: 'variant-hc-mwf', text: 'Heat protect + blow dry', optional: false, order: 4, notes: null },
          { id: 'hc-6', variantId: 'variant-hc-mwf', text: 'Style',                   optional: false, order: 5, notes: null },
        ],
      },
    ],
  },
  {
    id: 'routine-gym',
    name: 'Gym',
    category: 'fitness',
    color: '#f97316',
    icon: '💪',
    timeSlot: 'afternoon',
    customTime: null,
    active: true,
    createdAt: '2026-04-09',
    variants: [
      {
        id: 'variant-gym-weekdays',
        routineId: 'routine-gym',
        days: [1, 2, 3, 4, 5],  // Mon–Fri — absent on weekends
        label: null,
        order: 0,
        items: [
          { id: 'gym-1', variantId: 'variant-gym-weekdays', text: 'Pre-workout meal',       optional: false, order: 0, notes: null },
          { id: 'gym-2', variantId: 'variant-gym-weekdays', text: 'Warm up 10 min',         optional: false, order: 1, notes: null },
          { id: 'gym-3', variantId: 'variant-gym-weekdays', text: 'Main workout 45–60 min', optional: false, order: 2, notes: null },
          { id: 'gym-4', variantId: 'variant-gym-weekdays', text: 'Cool down stretch',      optional: false, order: 3, notes: null },
          { id: 'gym-5', variantId: 'variant-gym-weekdays', text: 'Protein shake',          optional: false, order: 4, notes: null },
        ],
      },
    ],
  },
]

// ── Historical logs (past 14 days relative to 2026-04-22) ────────────────────

function log(
  id: string,
  routineId: string,
  variantId: string,
  date: string,
  completionPct: number,
  skipped = false,
): RoutineLog {
  return { id, routineId, variantId, date, completionPct, skipped, notes: null, itemLogs: [] }
}

export const SEED_LOGS: RoutineLog[] = [
  // Morning Skincare — complete every day Apr 10–21 (12-day streak)
  log('log-ms-0410', 'routine-ms', 'variant-ms-default', '2026-04-10', 100),
  log('log-ms-0411', 'routine-ms', 'variant-ms-default', '2026-04-11', 100),
  log('log-ms-0412', 'routine-ms', 'variant-ms-default', '2026-04-12', 100),
  log('log-ms-0413', 'routine-ms', 'variant-ms-default', '2026-04-13', 100),
  log('log-ms-0414', 'routine-ms', 'variant-ms-default', '2026-04-14', 100),
  log('log-ms-0415', 'routine-ms', 'variant-ms-default', '2026-04-15', 100),
  log('log-ms-0416', 'routine-ms', 'variant-ms-default', '2026-04-16', 100),
  log('log-ms-0417', 'routine-ms', 'variant-ms-default', '2026-04-17', 100),
  log('log-ms-0418', 'routine-ms', 'variant-ms-default', '2026-04-18', 100),
  log('log-ms-0419', 'routine-ms', 'variant-ms-default', '2026-04-19', 100),
  log('log-ms-0420', 'routine-ms', 'variant-ms-default', '2026-04-20', 100),
  log('log-ms-0421', 'routine-ms', 'variant-ms-default', '2026-04-21', 100),

  // Night Skincare — Apr 14 partial, Apr 15–21 complete (7-day streak)
  log('log-ns-0414', 'routine-ns', 'variant-ns-default', '2026-04-14', 60),
  log('log-ns-0415', 'routine-ns', 'variant-ns-default', '2026-04-15', 100),
  log('log-ns-0416', 'routine-ns', 'variant-ns-default', '2026-04-16', 100),
  log('log-ns-0417', 'routine-ns', 'variant-ns-default', '2026-04-17', 100),
  log('log-ns-0418', 'routine-ns', 'variant-ns-default', '2026-04-18', 100),
  log('log-ns-0419', 'routine-ns', 'variant-ns-default', '2026-04-19', 100),
  log('log-ns-0420', 'routine-ns', 'variant-ns-default', '2026-04-20', 100),
  log('log-ns-0421', 'routine-ns', 'variant-ns-default', '2026-04-21', 100),

  // Hair Care (Mon/Wed/Fri) — Apr 10(Fri), 13(Mon), 15(Wed), 17(Fri), 20(Mon) all complete
  log('log-hc-0410', 'routine-hc', 'variant-hc-mwf', '2026-04-10', 100),
  log('log-hc-0413', 'routine-hc', 'variant-hc-mwf', '2026-04-13', 100),
  log('log-hc-0415', 'routine-hc', 'variant-hc-mwf', '2026-04-15', 100),
  log('log-hc-0417', 'routine-hc', 'variant-hc-mwf', '2026-04-17', 100),
  log('log-hc-0420', 'routine-hc', 'variant-hc-mwf', '2026-04-20', 100),

  // Gym (weekdays) — Apr 16 missed, rest complete → 3-day streak (Apr 17, 18, 21)
  log('log-gym-0409', 'routine-gym', 'variant-gym-weekdays', '2026-04-09', 100),
  log('log-gym-0410', 'routine-gym', 'variant-gym-weekdays', '2026-04-10', 100),
  log('log-gym-0413', 'routine-gym', 'variant-gym-weekdays', '2026-04-13', 100),
  log('log-gym-0414', 'routine-gym', 'variant-gym-weekdays', '2026-04-14', 100),
  log('log-gym-0415', 'routine-gym', 'variant-gym-weekdays', '2026-04-15', 100),
  // Apr 16 intentionally omitted — missed
  log('log-gym-0417', 'routine-gym', 'variant-gym-weekdays', '2026-04-17', 100),
  log('log-gym-0418', 'routine-gym', 'variant-gym-weekdays', '2026-04-18', 100),
  log('log-gym-0420', 'routine-gym', 'variant-gym-weekdays', '2026-04-20', 100),
  log('log-gym-0421', 'routine-gym', 'variant-gym-weekdays', '2026-04-21', 100),
]

// ── Today's item check state (April 22, Tuesday) ─────────────────────────────
// Morning Skincare: 4/5 required done (ms-1–ms-4 checked, ms-5 not yet, ms-6 optional)
// Night Skincare: not started (scheduled, time hasn't come yet)
// Hair Care: not scheduled Tuesday (Mon/Wed/Fri only) — hc keys kept as dead state
// Gym: not started (scheduled but afternoon)

export const SEED_TODAY_STATE: Record<string, boolean> = {
  'ms-1': true,  'ms-2': true,  'ms-3': true,  'ms-4': true,  'ms-5': false, 'ms-6': false,
  'ns-1': false, 'ns-2': false, 'ns-3': false, 'ns-4': false, 'ns-5': false,
  'hc-1': false, 'hc-2': false, 'hc-3': false, 'hc-4': false, 'hc-5': false, 'hc-6': false,
  'gym-1': false, 'gym-2': false, 'gym-3': false, 'gym-4': false, 'gym-5': false,
}

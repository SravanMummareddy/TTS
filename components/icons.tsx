export const ICON_PATHS: Record<string, string> = {
  dashboard: 'M2 2h5v5H2zm7 0h5v5H9zM2 9h5v5H2zm7 0h5v5H9z',
  journal:   'M3 2h8l2 2v11H3V2zm2 4h6M5 9h6m-6 3h4',
  notes:     'M2 3h12v10H2zm2 3h8m-8 3h5',
  gallery:   'M2 2h12v12H2zM2 9.5l3-3 2.5 2 3-4 3.5 4.5',
  tasks:     'M4 8l2.5 2.5L12 5M2 2h12v12H2z',
  routines:  'M8 2a6 6 0 100 12A6 6 0 008 2zm0 3v3l2 2',
  fasting:   'M8 3a5 5 0 100 10A5 5 0 008 3zm0 2v3l2 1.5',
  nutrition: 'M5 2c0 2-2 3-2 5h10c0-2-2-3-2-5M3 7v7h10V7',
  body:      'M8 2a2 2 0 100 4 2 2 0 000-4zM5 8l-1 6h8l-1-6',
  insights:  'M2 12l3-4.5 3 2 3-5.5 3 4',
  settings:  'M6.5 2.5A5.5 5.5 0 018 2a5.5 5.5 0 011.5.5L10.5 4a4 4 0 011 1l1.5.5c.3.6.5 1.3.5 2s-.2 1.4-.5 2L11.5 11a4 4 0 01-1 1L9.5 13.5A5.5 5.5 0 018 14a5.5 5.5 0 01-1.5-.5L5 12a4 4 0 01-1-1L2.5 10.5A5.5 5.5 0 012 8.5c0-.7.2-1.4.5-2L4 6a4 4 0 011-1zm0 4a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z',
  logout:    'M10 8H3m4-4-4 4 4 4m3-9h4v10h-4',
}

interface IcoProps {
  d: string
  size?: number
  style?: React.CSSProperties
}

export function Ico({ d, size = 16, style = {} }: IcoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <path d={d} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

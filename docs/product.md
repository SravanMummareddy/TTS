# Product

## Vision

Personal OS is a single private dashboard for one user to track and reflect on all areas of their life — health, body, mind, and daily habits — in one dark, distraction-free interface.

## Users

Single user (self-hosted or private deployment). No social features, no multi-tenancy in v1.

## Module specs

### Dashboard
- Daily summary: tasks due, active fast, last journal entry date, recent body log
- Shortcut cards to each module

### Journal
- Daily entries with optional mood tag
- Calendar view to browse past entries
- Streak tracking

### Notes
- Free-form rich text notes
- Tag-based organisation
- Quick-capture from any page

### Gallery
- Photo upload via Cloudinary [see docs/links.md → CLOUDINARY_URL]
- Date-grouped grid view
- Caption support

### Fasting
- Start/stop intermittent fast timer
- Log goal vs actual window
- History chart

### Nutrition
- Food search powered by external API [see docs/links.md → FOOD_API_URL]
- Log meals by day
- Macro totals (protein, carbs, fat, calories)

### Body
- Log weight, body fat %, measurements
- Progress charts over time

### Tasks
- Create tasks with title, priority (low/medium/high), due date
- Mark complete
- Filter by status

### Routines
- Create daily or weekly routine templates
- Mark routine items complete per day
- Completion rate over time

### Insights
- Aggregated view across all modules
- Streaks, weekly averages, trend arrows
- No third-party analytics — all data is local

### Settings
- Accent colour (purple / green / teal / orange)
- Sidebar density (compact / normal / spacious)
- Sidebar width

## Non-goals (v1)

- Multi-user / auth system
- Mobile app
- AI-generated insights
- Social or sharing features
- Notifications / reminders

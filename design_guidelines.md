# Design Guidelines for Zenchain Tic-Tac-Toe DApp

## Design Approach
**Reference-Based Approach** inspired by modern gaming platforms like Chess.com, Lichess, and crypto gaming interfaces. The design emphasizes interactive engagement while maintaining the professional look needed for blockchain applications.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Parrot Green: 145 85% 45% (main brand color)
- Deep Green: 145 70% 25% (darker variant)
- Pure Black: 0 0% 8% (primary dark)
- Charcoal: 0 0% 15% (secondary dark)

**Supporting Colors:**
- White: 0 0% 98% (text/contrast)
- Gray: 0 0% 60% (secondary text)
- Success Green: 145 85% 55% (wins/positive actions)
- Warning Red: 0 85% 55% (losses/errors)

**Background Treatments:**
Dark mode throughout with subtle gradients from deep black to charcoal, particularly effective behind the game board area and hero sections.

### B. Typography
**Primary Font:** Inter (Google Fonts)
- Headers: 600-700 weight
- Body: 400-500 weight
- Game UI: 500-600 weight for readability

**Hierarchy:**
- H1: 2.5rem/3rem (hero titles)
- H2: 2rem (section headers)
- H3: 1.5rem (component titles)
- Body: 1rem (general text)
- Small: 0.875rem (secondary info)

### C. Layout System
**Tailwind Spacing Primitives:** 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, m-2 (buttons, small gaps)
- Standard spacing: p-4, m-4, gap-4 (cards, sections)
- Component spacing: p-6, m-6 (larger components)
- Section spacing: p-8, m-8, py-12, py-16 (major sections)

### D. Component Library

**Navigation:**
- Dark header with parrot green accent for active states
- Wallet connection button prominently displayed
- Network status indicator

**Game Board:**
- 3x3 grid with rounded corners and subtle borders
- Cells with hover states in parrot green glow
- X/O markers with smooth animations
- Game status display with clear typography

**Cards & Containers:**
- Dark backgrounds (charcoal) with subtle borders
- Rounded corners (rounded-lg to rounded-xl)
- Parrot green accent borders for active/selected states

**Buttons:**
- Primary: Parrot green background with white text
- Secondary: Outline parrot green with transparent background
- Disabled: Muted gray with reduced opacity

**Forms & Inputs:**
- Dark input fields with parrot green focus states
- Clear validation feedback using success/warning colors

**Modals & Overlays:**
- Dark overlay backgrounds
- Centered content with parrot green accent borders
- Wallet connection and game result modals

### E. Gaming-Specific Elements

**Game Board Design:**
- Central focus with generous whitespace
- Subtle grid lines in gray
- Hover effects with parrot green glow
- Win condition highlighting with animated parrot green

**Score Display:**
- Clean scoreboard with player vs computer stats
- Win streaks and total games played
- Balance display for on-chain fees

**Interactive Feedback:**
- Subtle hover animations
- Click confirmations
- Game state transitions with smooth fades
- Loading states for blockchain transactions

## Images
No hero images required. The game board serves as the primary visual focus. Consider adding:
- Subtle blockchain/network icons in the connection status
- Simple geometric patterns as background textures
- Minimal iconography for wallet, settings, and game actions

## Layout Structure
1. **Header:** Wallet connection, network status, user balance
2. **Game Section:** Central tic-tac-toe board with score display
3. **Action Panel:** Game controls, fee payment, restart options
4. **Footer:** Minimal with Zenchain branding

The design prioritizes the game experience while seamlessly integrating blockchain functionality through clear visual hierarchy and the distinctive parrot green and black theme.
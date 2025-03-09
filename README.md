# Color Flash Cards

A modern web application for learning and exploring color schemes. Built with Next.js, TypeScript, and Tailwind CSS using Cursor AI.

## Features

- **Multiple Color Schemes**
  - Complementary
  - Monochromatic
  - Analogous
  - Triadic

- **Interactive Cards**
  - Click to copy color codes
  - Visual feedback on hover
  - Responsive design for all devices

- **Auto-Refresh Mode**
  - Configurable refresh intervals
  - Visual countdown timer
  - Start/Stop controls

- **Customization**
  - Adjustable number of cards (3-5)
  - Custom refresh intervals
  - Dark/Light mode support

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Color Management**: Chroma.js
- **Icons**: Heroicons
- **State Management**: React Hooks

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/color-recall.git
   cd color-recall
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Selecting Color Schemes**
   - Click the settings icon (⚙️) in the top right
   - Choose from available color schemes
   - Changes apply immediately

2. **Auto-Refresh Mode**
   - Click "Start" to begin auto-refresh
   - Watch the countdown timer
   - Click "Stop" to pause

3. **Copying Colors**
   - Click any color card to copy its hex code
   - Visual feedback confirms the copy action

4. **Adjusting Settings**
   - Change number of cards (3-5)
   - Set custom refresh intervals
   - Toggle dark/light mode

## Development

### Project Structure
```
color-recall/
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main page component
│   │   ├── layout.tsx       # Root layout
│   │   └── ThemeContext.tsx # Dark mode context
│   └── components/
│       ├── ColorCard.tsx    # Color card component
│       └── Settings.tsx     # Settings panel component
├── public/
└── package.json
```

### Key Features Implementation

1. **Color Generation**
   - Uses Chroma.js for color manipulation
   - Implements color scheme algorithms
   - Ensures color contrast and uniqueness

2. **Responsive Design**
   - Mobile-first approach
   - Fluid layouts with Tailwind
   - Optimized for all screen sizes

3. **Theme Support**
   - System-based dark mode detection
   - Persistent theme preference
   - Smooth transitions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chroma.js](https://gka.github.io/chroma.js/)
- [Heroicons](https://heroicons.com/)

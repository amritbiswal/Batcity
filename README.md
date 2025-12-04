# 🦇 Batman Runner - Batcity Game

A minimalist, Chrome Dino-inspired endless runner game featuring Batman chasing the Joker through Gotham City. Built with vanilla JavaScript, HTML5, and CSS3.

![Game Preview](https://img.shields.io/badge/Status-Playable-success)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Mobile Friendly](https://img.shields.io/badge/Mobile-Friendly-blue)

---

## 🎮 **Game Overview**

Batman Runner is a 2D side-scrolling endless runner where you control Batman avoiding obstacles, defeating enemies, and saving civilians. The game features a unique boss fight against the Joker after reaching certain score milestones.

### **Key Features**

- ✅ **Endless Runner Gameplay** - Classic side-scrolling action
- ✅ **Double Jump Mechanic** - Enhanced mobility
- ✅ **Shooting System** - Eliminate enemies with projectiles
- ✅ **Boss Fight** - Epic showdown with the Joker
- ✅ **Progressive Difficulty** - Game speed increases with score
- ✅ **Theme Toggle** - Light/Dark mode support
- ✅ **Sound Effects** - Web Audio API-powered retro sounds
- ✅ **Mobile Optimized** - Touch controls and responsive design
- ✅ **High Score Tracking** - LocalStorage persistence
- ✅ **Pause/Resume** - Game state management

---

## 🕹️ **How to Play**

### **Objective**

- **Survive as long as possible** while avoiding obstacles and enemies
- **Save civilians** by touching them (+5 points each)
- **Shoot enemies** to destroy them (+3 points each)
- **Pass obstacles** to gain points (+2 points each)
- **Defeat the Joker** when he appears (boss fight at 100+ score)

### **Game Over Conditions**

- ❌ Hitting an **obstacle**
- ❌ Colliding with an **enemy**
- ❌ **Shooting a civilian** (instant game over!)
- ❌ Getting caught by the **Joker**

---

## 🎯 **Controls**

### **Desktop Controls**

| Action                  | Keys                          |
| ----------------------- | ----------------------------- |
| Jump                    | `SPACE` or `↑`                |
| Double Jump             | Press jump again while in air |
| Shoot                   | `F`                           |
| Move Left (Boss Phase)  | `A` or `←`                    |
| Move Right (Boss Phase) | `D` or `→`                    |
| Pause/Resume            | `ESC` or `P`                  |

### **Mobile Controls**

- **Jump Button** - Tap to jump (tap twice for double jump)
- **Shoot Button** - Tap to shoot projectiles
- **Pause Button** - Top-right corner pause icon
- **Theme Toggle** - Switch between light/dark themes
- **Mute Button** - Toggle sound effects

---

## 🚀 **Getting Started**

### **Prerequisites**

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/amritbiswal/Batcity.git
   cd Batcity
   ```

2. **Open in browser**

   ```bash
   # Simply open index.html in your browser
   open index.html
   ```

   Or use a local server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server
   ```

3. **Play the game**
   - Navigate to `https://amritbiswal.github.io/Batcity/`
   - Click "Start Game"
   - Enjoy!

---

## 📁 **Project Structure**

```
Batcity/
├── index.html          # Main HTML file
├── style.css           # All styles (including responsive design)
├── game.js             # Game logic and mechanics
├── README.md           # This file
└── assets/             # (Optional) Future assets folder
```

---

## 🎨 **Game Mechanics**

### **Phases**

1. **Phase 1** - Normal enemies and obstacles
2. **Phase 2** - Increased speed (50+ score)
3. **Boss Phase** - Joker chase sequence (100+ score)

### **Entities**

| Entity       | Symbol | Behavior             | Points        |
| ------------ | ------ | -------------------- | ------------- |
| **Obstacle** | ▮      | Static barrier       | +2 (pass)     |
| **Enemy**    | 👾     | Moving threat        | +3 (shoot)    |
| **Civilian** | 🧍     | Must save, not shoot | +5 (save)     |
| **Joker**    | 🃏     | Boss enemy (10 HP)   | Win condition |

### **Difficulty Scaling**

- **Speed**: Increases by 10% every 10 points
- **Spawn Rate**: Decreases as score increases
- **Boss Trigger**: Appears at score >= 100

---

## 🛠️ **Technologies Used**

- **HTML5** - Structure and canvas
- **CSS3** - Styling, animations, and theming
- **Vanilla JavaScript** - Game logic (ES6+)
- **Web Audio API** - Sound effects
- **LocalStorage API** - High score persistence

### **Key JavaScript Features**

- `requestAnimationFrame()` for smooth game loop
- CSS transitions and animations
- Event delegation for input handling
- Collision detection with bounding boxes
- State management pattern

---

## 📱 **Mobile Optimization**

### **Responsive Design**

- Adaptive layout for all screen sizes
- Touch-optimized button sizes
- Prevents double-tap zoom
- CSS media queries for breakpoints

### **Touch Events**

```javascript
// Prevents zoom on double-tap
button.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAction();
  },
  { passive: false }
);
```

---

## 🎵 **Sound System**

### **Web Audio API Implementation**

- **Jump Sound** - Frequency sweep (400Hz → 750Hz)
- **Shoot Sound** - Square wave beep (900Hz)
- **Enemy Hit** - Descending sweep (800Hz → 400Hz)
- **Civilian Save** - Ascending sweep (500Hz → 900Hz)
- **Game Over** - Long descending sweep (400Hz → 150Hz)

### **Audio Unlocking (Mobile)**

```javascript
Sound.unlock(); // Called on first user interaction
```

---

## 🌈 **Theme System**

### **Light/Dark Theme Toggle**

- Persistent via `localStorage`
- Smooth transitions between themes
- CSS custom properties for theming

```css
:root {
  --bg-primary: #000;
  --text-primary: #fff;
  --accent: #ffcc00;
}

body.light-theme {
  --bg-primary: #f5f5f5;
  --text-primary: #1a1a1a;
}
```

---

## 🐛 **Known Issues & Solutions**

### **Issue: Double-tap zoom on mobile**

**Solution**: Added `touch-action: manipulation` and `viewport` meta tag

### **Issue: Sound not working on iOS**

**Solution**: Audio unlock on first touch interaction

### **Issue: Double jump not registering on mobile**

**Solution**: Removed duplicate event listeners, added `stopPropagation()`

### **Issue: Game freezing on collision**

**Solution**: Added collision flag to prevent multiple game-over triggers

---

## 🔮 **Future Enhancements**

- [ ] Add more enemy types (Penguin, Riddler, etc.)
- [ ] Power-ups (shield, speed boost, extra life)
- [ ] Parallax scrolling background
- [ ] Particle effects for collisions
- [ ] Achievement system
- [ ] Leaderboard (online)
- [ ] Multiple difficulty modes
- [ ] Mobile gyroscope controls
- [ ] Progressive Web App (PWA) support
- [ ] Background music toggle

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 **Code Style Guidelines**

- Use **camelCase** for variable names
- Use **UPPER_SNAKE_CASE** for constants
- Comment complex logic
- Keep functions small and focused
- Use semantic HTML
- Follow BEM naming for CSS classes

---

## 🧪 **Testing**

### **Browser Compatibility**

| Browser | Version | Status             |
| ------- | ------- | ------------------ |
| Chrome  | 90+     | ✅ Fully Supported |
| Firefox | 88+     | ✅ Fully Supported |
| Safari  | 14+     | ✅ Fully Supported |
| Edge    | 90+     | ✅ Fully Supported |

### **Device Testing**

- ✅ Desktop (Windows, macOS, Linux)
- ✅ Mobile (iOS Safari, Chrome Android)
- ✅ Tablet (iPad, Android tablets)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 **Credits**

- **Developer**: [Your Name](https://github.com/amritbiswal)
- **Inspired by**: Chrome Dino Game
- **Theme**: Batman & Gotham City
- **Course**: Ironhack Web Development Bootcamp (Week 3 Project)

---

## 📧 **Contact**

- **GitHub**: [@amritbiswal](https://github.com/amritbiswal)
- **Email**: amrit.k.biswal@gmail.com
- **LinkedIn**: [Amrit Biswal](https://linkedin.com/in/amritbiswal)

---

## 🎮 **Play Online**

🔗 **Live Demo**: [https://amritbiswal.github.io/Batcity/](https://amritbiswal.github.io/Batcity/)

---

## 📸 **Screenshots**

### Start Screen

![Start Screen](screenshots/start-screen.png)

### Gameplay

![Gameplay](screenshots/gameplay.png)

### Boss Fight

![Boss Fight](screenshots/boss-fight.png)

### Game Over

![Game Over](screenshots/game-over.png)

---

## 🙏 **Acknowledgments**

- Ironhack for the web development bootcamp
- Chrome Dino Game for inspiration
- Batman franchise for the theme
- Open-source community

---

**Made with ❤️ and ☕ by [ Amrit Biswal ]**

---

### 📊 **Game Statistics** (Optional Section)

If you want to track stats, add this section:

```javascript
// Game Statistics
const stats = {
  totalGames: localStorage.getItem("totalGames") || 0,
  highScore: localStorage.getItem("highScore") || 0,
  totalScore: localStorage.getItem("totalScore") || 0,
  civiliansShot: localStorage.getItem("civiliansShot") || 0,
  enemiesKilled: localStorage.getItem("enemiesKilled") || 0,
};
```

---

## 🔧 **Configuration**

You can customize game parameters in `game.js`:

```javascript
// Game Configuration
const GAME_SPEED = 4; // Base scroll speed
const MAX_JUMPS = 2; // Double jump enabled
const OBSTACLE_SPAWN_RATE = 2000; // Milliseconds
const BOSS_SCORE_STEP = 100; // Boss appears every 100 points
const JOKER_MAX_HP = 10; // Boss health
```

---

**Happy Gaming! 🦇🎮**

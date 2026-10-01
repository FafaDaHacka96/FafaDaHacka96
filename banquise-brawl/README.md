# Banquise Brawl

A browser remake of *Projet Intégration* (SIM, winter 2025) by Rafael Malservisi, Fayssal Si-Ali and Anh Khoi Nguyen. Open `index.html` in a browser to play. The game is one file with no build step; the only assets are the four tracks in `music/`.

## Music

The soundtrack is the original game's, trimmed so it loops without a gap, loudness-matched (the final-minute track no longer clips) and encoded as MP3.

| Screen | File | Original |
|---|---|---|
| Menus | `music/menu.mp3` | `project 9 DRAFT.wav` |
| Match | `music/match.mp3` | `project 5 final tweak.wav` |
| Last 60 seconds | `music/blizzard.mp3` | `project 11(final).wav` |
| Victory | `music/victory.mp3` | `win music.wav` |

Tracks crossfade between screens, the music is muffled while paused, and the menu theme fades back in after the victory jingle. Opened straight from disk (`file://`), the browser can't fetch the files, so the game falls back to plain audio elements.

## What carries over from the original

- Two penguins, each kept to their own half of the ice floe.
- A spinning flipper with angular acceleration (`ω = ω0 + α·t`) that slows down when you let go.
- Scoop a snowball when the flipper points at the snow, then hold to roll it bigger while the snow underneath sinks and slowly grows back.
- The ball is thrown along the flipper's tangent. Damage scales with mass × speed, and knockback uses conservation of momentum.
- Stamina for moving and jumping (below 70% you slow down) and slippery bare ice.
- Three characters with the original stats, colours and ultimates: heal (black), fireball (red), ice wall (blue).
- The original penguin design, redrawn as smooth vector shapes: hunched bean body, droopy beak, dot eyes, low belly patch, pointed flipper, and the scarf and medal from the victory sprite.
- A 3-minute timer; in the last minute ultimates charge faster.

## What changed

- **Physics:** a fixed 60 Hz timestep with velocity integration and air drag. The original added `Vx·t` to the position every frame, so balls sped up over time.
- **Flipper:** speed is capped, and heavier balls spin slower (both were on the original's to-do list). At rest the flipper settles on a damped spring.
- **Snow:** the ground is a smooth heightfield. Missed snowballs leave snow where they land.
- **Animation:** procedural squash and stretch, waddle, lean, blinking, hit flash, knockback tilt and a fall on KO.
- **Effects:** particles, screen shake, hit-stop, damage numbers and a dotted preview of the throw arc.
- **Gameplay:** a CPU opponent with three levels, sudden death on a tied time-out, snowballs that collide with each other, coyote time and jump buffering.
- **Sound:** synthesized sound effects and key labels that follow your keyboard layout.

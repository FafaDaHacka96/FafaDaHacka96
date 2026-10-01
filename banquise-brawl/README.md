# Banquise Brawl

A browser remake of *Projet Intégration* (SIM, winter 2025) by Rafael Malservisi, Fayssal Si-Ali and Anh Khoi Nguyen. Open `index.html` in a browser to play: everything is in one file, with no build step or assets.

## What carries over from the original

- Two penguins, each kept to their own half of the ice floe.
- A spinning flipper with angular acceleration (`ω = ω0 + α·t`) that slows down when you let go.
- Scoop a snowball when the flipper points at the snow, then hold to roll it bigger while the snow underneath sinks and slowly grows back.
- The ball is thrown along the flipper's tangent. Damage scales with mass × speed, and knockback uses conservation of momentum.
- Stamina for moving and jumping (below 70% you slow down) and slippery bare ice.
- Three characters with the original stats and ultimates: heal (black), fireball (red), ice wall (blue).
- A 3-minute timer; in the last minute ultimates charge faster.

## What changed

- **Physics:** a fixed 60 Hz timestep with velocity integration and air drag. The original added `Vx·t` to the position every frame, so balls sped up over time.
- **Flipper:** speed is capped, and heavier balls spin slower (both were on the original's to-do list). At rest the flipper settles on a damped spring.
- **Snow:** the ground is a smooth heightfield. Missed snowballs leave snow where they land.
- **Animation:** procedural squash and stretch, waddle, lean, blinking, hit flash, knockback tilt and a fall on KO.
- **Effects:** particles, screen shake, hit-stop, damage numbers and a dotted preview of the throw arc.
- **Gameplay:** a CPU opponent with three levels, sudden death on a tied time-out, snowballs that collide with each other, coyote time and jump buffering.
- **Sound:** synthesized effects and music (no audio files), plus layout-aware key labels.

#### Spectral Run – Gleam Game Jam 2025

Spectral Run is a psychedelic fast-paced runner made with Gleam + Paint + Tiramisu, created for the Gleam Game Jam 2025.

Inspired by the theme “Lucy in the Sky With Diamonds”, the game blends neon tunnels, spectral color-shifting and hypnotic movement.

🎮 Play the game:


### Concept

You control a spectral runner sliding through a neon tunnel.
Three spectral states — Red, Green, Blue — define what you can phase through.

### Goal

Switch your spectre color to safely pass through matching obstacles

Collect diamonds for points

Survive as long as possible, as speed continuously ramps up

Simple controls, high speed, intense color-driven decision making.

### Tech Stack

Spectral Run is built entirely with Gleam and minimal JavaScript glue.

```table
Component	Technology
Game logic	Gleam
Rendering	Paint (Canvas 2D)
Game loop, timing	Tiramisu
Web build	JavaScript
No engines	100% custom
```

### Project Structure



### Installation & Running Locally
1. Build the Gleam code
```code gleam build ```

2. Serve the frontend

Use any static server:

cd frontend
python3 -m http.server


Or VSCode’s Live Server extension.

Open:

http://localhost:8000


Done.


### Game Jam Compliance

✔ Built entirely during the Jam
✔ Mostly written in Gleam
✔ Open source
✔ No offensive content
✔ Follows theme creatively

### Exporting for itch.io

Zip this folder:

frontend/
 ├ index.html
 ├ index.js
 ├ style.css
 └ build/       ← compiled Gleam JS output


Upload the ZIP as an HTML5 game.

### License

This project is released under the MIT License.
You are free to reuse, modify, and expand the game.

### Credits

Made with ❤️ using:

Gleam

Paint

Tiramisu

Open-source Gleam ecosystem
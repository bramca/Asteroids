# Asteroids
![asteroids game](./img/asteroids_game.PNG)
This repo contains a clone of the classic [Asteroids](https://en.wikipedia.org/wiki/Asteroids_(video_game)) game from Atari in 1979.
It is written in `javascript` and `html`. <br>
It uses [p5.js](https://p5js.org/) for the game objects and the game rendering. <br>

# How to run
You can run this game by opening the [index.html](./index.html) in your browser or you can run a simple http server in the root folder of this repo e.g. (in python) `python -m http.server`

# Controls
`space bar` hold it to shoot the laser beam.<br>
`arrow up` hold to thrust forward.<br>
`arrow left/right` turn the ship left or right.<br>
`1` shoot 1 laser<br>
`2` shoot 2 lasers<br>
`3` guess...<br>
`l` shoot bullets instead of laser<br>
`b` shoot a laser pulse outward surrounding the ship<br>
`w` lay down a bomb wall in front of you<br>
`x` shoot a nuke (not really a big explosion, just a chain reaction of particles splitting)<br>
`p` pause the game<br>
`r` restart the game

# Features
It contains 4 levels with each level an increasing number of asteroids floating around.<br>
The 4th level is an infinite one where asteroids will keep spawning until the end of time.

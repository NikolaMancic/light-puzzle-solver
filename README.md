# Heroes of Hammerwatch Prison Puzzle Solver

## About

This is a solver for the [lights out puzzle](http://wiki.heroesofhammerwatch.com/Puzzlesecrets#Lights_Out) found in the prison stages of [Heroes of Hammerwatch](https://store.steampowered.com/app/677120/Heroes_of_Hammerwatch/).

## How to Use

1. Play it [here](https://nikolamancic.github.io/light-puzzle-solver/)
2. Open your browser's console (Usually `F12` or `Ctrl + Shift + i`)
3. Type `solve();` into the console

## Notes

The solver uses a brute force approach by generating moves randomly and then checking if the puzzle is solved or not. It will do 1000 attempts of 10 moves per invocation of `solve()`. It is possible that it will not give you the best possible answer after one call, so call `solve()` multiple times just in case.

I may add an actual UI in the future, but for now this is good enough ...

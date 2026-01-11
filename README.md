# Fallout Lockpick minigamne

Recreating the minigame from the Fallout series as well as Skyrim. There is a limit for lockpick, as well as a score counter to keep track of how much locks you have sucessfully picked in one life (3 lockpicks per life). Try aiming for a highscore!

## Control
Mouse Movement: Choose an angle for the pick inside the lock.
W,A,S,D: Begin lockpicking.

## How to - From fallout 3 and new vegas

![s8Wmt-HB](https://static.wikia.nocookie.net/fallout_gamepedia/images/9/9a/VDSG_MANUAL-Lockpicking.png/revision/latest/scale-to-width-down/855?cb=20130313214957)

## Implementation
- Track lockpick angle based on mousemovement.
- Lock max rotation is based on lockpick relative distance to the sweetspot.
- Lockpick get more stressed and wobble based on stress level, which increase by trying to force the lock to turn further than the current max rotation.
- Use a combination of game loop, events listener and css animation to indicate game state.

## References

The app is heaviliy inspired by the minigame inside Bethesda's Fallout and Skyrim series. However the implementations of Assets as well as game mechanic is solely by myself.

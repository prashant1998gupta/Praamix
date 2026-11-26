# Day 02

```
Ever seen other players teleport across your screen? 👻

Same snapshots from the server, two ways to draw them:

🔴 Draw the newest snapshot: packets arrive late, some get lost, and the player jumps.
🟢 Interpolation buffer: keep the last few snapshots, draw about 100 ms in the past, and blend between them. Slightly behind, perfectly smooth.

Buffer. Render behind. Interpolate.

How much delay would you trade for smoothness? 👇

Day 2 of 30.

#GameDev #Unity #Multiplayer #Netcode #GameDevelopment
```

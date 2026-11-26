Got a frame spike nobody can find? 🔍

Same gun, same fire rate:

🔴 Instantiate + Destroy: every shot creates a new bullet and destroys it a second later. Garbage piles up until the garbage collector runs, and the frame freezes.
🟢 Object pool: create the bullets once while loading, then take one from the pool and give it back. Flat frame times.

Pre-warm. Reuse. Profile (watch GC Alloc in the Unity Profiler).

Do you pool everything, or only hot paths? 👇

Day 6 of 30.

#GameDev #Unity #Performance #GameOptimization #CSharp

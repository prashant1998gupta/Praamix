Why do fast bullets fly straight through walls? 🧱

A fast object, a thin wall, one physics step at a time:

🔴 Discrete collision: the engine only checks where the bullet is at each step. If one step lands before the wall and the next lands past it, nothing ever touched.
🟢 Continuous collision: the engine checks the whole swept path between steps, so the wall is found. In Unity, set fast Rigidbodies to Continuous Dynamic, or use a raycast for hitscan bullets.

Continuous. Raycast. Thicker walls.

Raycast bullets, or physical ones? 👇

Day 12 of 30.

#GameDev #Unity #GamePhysics #FPS #GameDevelopment

Why does your movement jitter, even at 120 FPS? 🎮

Physics and rendering don't tick together:

🔴 Rigidbody moved in Update: the screen shows wherever the last physics step left it. Some frames it moves, some it doesn't. That uneven spacing is the jitter you feel.
🟢 FixedUpdate + Interpolate: apply forces or velocity in FixedUpdate, and turn on the Rigidbody's Interpolate option. Rendering blends between physics steps, so every frame has the same spacing.

FixedUpdate. Interpolate. Input in Update.

Rigidbody or CharacterController for your player? 👇

Day 11 of 30.

#GameDev #Unity #GamePhysics #Unity3D #GameDevelopment

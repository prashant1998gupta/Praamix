Here's what a draw call actually looks like. 📦📦📦

36 crates:

🔴 One call per object: every crate has its own material, so the CPU sets up a separate draw for each.
🟢 Batched / instanced: a shared material and mesh, drawn together. Same crates, far less CPU work.

Share materials (atlases). Batch (static batching or the SRP Batcher). Instance repeated meshes.

SRP Batcher or static batching: which saves you more? 👇

Day 8 of 30.

#GameDev #Unity #Rendering #Performance #TechArt

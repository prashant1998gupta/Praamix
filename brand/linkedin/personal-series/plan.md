# Prashant's daily explainer videos: 30-day plan

Short animated explainers for Prashant Gupta's personal LinkedIn (not the Praamix page). One a day, about 25 seconds, 1080 × 1350, silent-safe with on-screen text, optional ElevenLabs voice-over.

**Format, every day**
1. A title that names a pain the viewer has felt ("Why your online game feels laggy").
2. A side-by-side: the common way (red) vs the better way (green), animated so the difference is *seen*, not read.
3. A three-line takeaway.
4. A question with two defensible sides, so people argue in the comments.

**Rule:** only techniques Prashant actually uses or can defend in the comments. No made-up numbers: where timings are shown, the video says they are slowed down or illustrative.

**Sample (built):** `client-prediction.mp4` — Day 01.

## The 30 days

| Day | Pillar | Title | Side-by-side | Comment bait |
|---|---|---|---|---|
| 01 | Multiplayer | Why your online game feels laggy | Wait for server vs client-side prediction | Would you trust the client with movement? |
| 02 | Multiplayer | Why other players teleport | Raw snapshots vs interpolation buffer | How much delay would you add for smoothness? |
| 03 | Multiplayer | "I shot him first!" | No lag compensation vs server rewind | Favour the shooter or the target? |
| 04 | Multiplayer | Sending too much data | Every frame, every field vs delta + quantised | Photon, Netcode, Mirror or Fish-Net? |
| 05 | Multiplayer | Who owns the physics? | Server authority vs client authority | Is client authority ever OK? |
| 06 | Performance | The frame spike nobody can find | `Instantiate` every shot vs object pool (GC graph) | Do you pool everything? |
| 07 | Performance | Update() is not free | 1,000 Update() calls vs one manager loop | Manager pattern: clean or overkill? |
| 08 | Performance | Draw calls, visualised | 300 separate meshes vs batched / GPU instancing | SRP Batcher or static batching? |
| 09 | Performance | GetComponent in Update | Lookup every frame vs cached reference | Still a problem in 2026? |
| 10 | Performance | Why your Quest build stutters | Real-time shadows + post FX vs baked light | 72 Hz or 90 Hz target? |
| 11 | Physics | Jittery movement | Moving a Rigidbody in Update vs FixedUpdate + interpolation | Rigidbody or CharacterController? |
| 12 | Physics | Bullets through walls | Discrete vs continuous collision | Raycast bullets or physical ones? |
| 13 | Physics | Floaty jumps | Linear gravity vs faster fall + coyote time | Is coyote time cheating? |
| 14 | Gameplay | Input that feels bad | Instant input check vs input buffer | How many ms of buffer? |
| 15 | Animation | Feet sliding (our take) | Speed mismatch vs matching stride to velocity | Root motion or code? |
| 16 | Gameplay | Camera that makes people sick | Hard follow vs damped follow + look-ahead | Cinemachine or custom? |
| 17 | VR | Why VR hands go through tables | Hand follows controller vs physics hand | Physics hands: worth it? |
| 18 | VR | Teleport vs smooth locomotion | Side by side with comfort meter | Which should be the default? |
| 19 | VR | Grabbing that feels real | Snap to hand vs grab at contact point | Snap or free grab? |
| 20 | VR | Motion sickness in one picture | Moving horizon vs vignette + snap turn | Vignette on or off by default? |
| 21 | Architecture | Singletons everywhere | Singleton web vs events / ScriptableObject channels | Are singletons evil? |
| 22 | Architecture | The 2,000-line Player script | God class vs components | How small is too small? |
| 23 | Architecture | State machines | if/else soup vs states | FSM or behaviour tree for AI? |
| 24 | Architecture | Saving game data | PlayerPrefs everywhere vs one save model | JSON or binary saves? |
| 25 | AI | Enemies that all bunch up | Everyone chases player vs slots around player | Smart AI or fun AI? |
| 26 | AI | Pathfinding that looks robotic | Raw NavMesh path vs smoothed + steering | NavMesh or A*? |
| 27 | Workflow | Hard-coded numbers | Values in code vs ScriptableObject tuning | Designers in the Inspector: yes or no? |
| 28 | Workflow | Testing a feature takes 2 minutes | Play from main menu vs debug scene + cheats | Ship debug tools in builds? |
| 29 | Behind the scenes | How we built the Ice Gun (Sheriff Town VR) | Freeze sequence, frame by frame | Which tool gun should we break down next? |
| 30 | Behind the scenes | 30 days, 30 lessons | Montage of all 30 takeaways | What should month two cover? |

**Rhythm:** post 9:00–10:00 AM India time (earlier than the Praamix page's 7 PM), reply to every comment in the first hour, and pin your own answer to the question as the first comment.

## Day 01 voice-over (ElevenLabs, about 65 words, timed to the video)

| Time | Line |
|---|---|
| 0:00 | Your online game isn't slow. It's waiting. |
| 0:03 | Top: the client sends your input and waits for the server. Every move shows up a hundred and fifty milliseconds late. |
| 0:09 | Bottom: client-side prediction. You move instantly, and the server, in gold, catches up behind you. |
| 0:15 | When the server agrees, nothing changes. When it doesn't, you correct, smoothly. |
| 0:19 | Predict. Confirm. Reconcile. |
| 0:23 | Would you trust the client with movement? Tell me below. |

## Day 01 post text

```
Your online game isn't slow. It's waiting. 🎮

Same 150 ms ping, two approaches:

🔴 Wait for the server: press a key, send it, move only when the reply comes back. Every action feels late.
🟢 Client-side prediction: move the instant you press. The server checks your input and replies. If it disagrees, you correct, smoothly.

Predict. Confirm. Reconcile. That's most of why good multiplayer games feel "instant".

The catch: you're trusting the client for a moment. So, would you trust the client with movement? Tell me why 👇

Day 1 of 30. Every day this month: one game-dev concept, animated.

#GameDev #Unity #Multiplayer #Netcode #GameDevelopment
```

## Day 02 post text

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

## Day 03 post text

```
"I shot him first!" Every player has said it. 🎯

You aim at what you see, but what you see is a little in the past.

🔴 Check the shot against now: your crosshair was on him, but the server says he already moved. Miss.
🟢 Server rewind: the server keeps a short history, rewinds to where you saw him when you fired, and the hit counts.

Record. Rewind. And limit how far back.

So who should win: the shooter, or the player who got shot? 👇

Day 3 of 30.

#GameDev #Unity #Multiplayer #Netcode #FPS
```

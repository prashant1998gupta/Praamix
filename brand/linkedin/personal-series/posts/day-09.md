Still calling GetComponent in Update? 🔁

Same script, same Rigidbody:

🔴 Look it up every frame: search the GameObject for the component, find it, forget it, repeat.
🟢 Cache the reference: find it once in Awake(), keep it in a field, use it every frame.

Cache. Reuse. Use TryGetComponent when it might be missing.

GetComponent has got faster over the years. Is this still a real problem in 2026, or a myth that won't die? 👇

Day 9 of 30.

#GameDev #Unity #CSharp #Performance #CleanCode

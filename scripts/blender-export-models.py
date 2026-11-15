# Converts game models from FBX to GLB for the website's 3D viewer.
#
# Run by scripts/stage-game-models.mjs, inside Blender with no window:
#   blender -b --python scripts/blender-export-models.py -- <jobs.json>
#
# jobs.json is a list of {"source": "...fbx", "target": "...glb"}. Only the
# shapes are exported: positions, normals and UVs. The website loads the
# textures itself, so no material or image is written into the GLB.
import json
import sys

import bpy

jobs = json.load(open(sys.argv[sys.argv.index("--") + 1], encoding="utf-8"))

for job in jobs:
    bpy.ops.wm.read_factory_settings(use_empty=True)

    if hasattr(bpy.ops.wm, "fbx_import"):
        bpy.ops.wm.fbx_import(filepath=job["source"])
    else:
        bpy.ops.import_scene.fbx(filepath=job["source"])

    meshes = [item for item in bpy.context.scene.objects if item.type == "MESH"]
    # Lower levels of detail and collision shapes ride along in some files. Keep the full model only.
    full = [item for item in meshes if "LOD" not in item.name.upper() or "LOD0" in item.name.upper()]
    full = [item for item in full if "COLLI" not in item.name.upper() and not item.name.upper().startswith("UCX")]
    keep = full or meshes
    for item in meshes:
        if item not in keep:
            bpy.data.objects.remove(item, do_unlink=True)

    triangles = 0
    for item in keep:
        item.data.calc_loop_triangles()
        triangles += len(item.data.loop_triangles)

    bpy.ops.export_scene.gltf(
        filepath=job["target"],
        export_format="GLB",
        export_materials="PLACEHOLDER",
        export_apply=True,
        export_animations=False,
        export_skins=False,
        export_morph=False,
        export_cameras=False,
        export_lights=False,
        export_tangents=False,
    )
    print(f"EXPORTED {job['target']} objects={len(keep)} triangles={triangles} names={[item.name for item in keep][:12]}")

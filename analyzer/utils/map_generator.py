import numpy as np

def snap_to_grid(time_ms, bpm, offset_ms):
    ms_per_beat = 60_000 / bpm
    ms_per_snap = ms_per_beat / 2
    new_snaps = round((time_ms - offset_ms) / ms_per_snap)
    return offset_ms + new_snaps * ms_per_snap

def create_osu_file(filename, bpm, onsets, artist="Unknown", title="Unknown"):
    beat_length = 60000 / bpm
    offset = (onsets[0] * 1000) if len(onsets) > 0 else 0

    content = [
        "osu file version v14",
        "",
        "[General]",
        f"AudioFilename: {filename}",
        "Mode: 0",
        "",
        "[Metadata]",
        f"Title:{title}",
        f"Artist:{artist}",
        "Creator:AI_Mapper",
        "Version:Easy AI",
        "",
        "[Difficulty]",
        "HPDrainRate:5",
        "CircleSize:4",
        "OverallDifficulty:5",
        "ApproachRate:7",
        "SliderMultiplier:1.4",
        "SliderTickRate:1",
        "",
        "[TimingPoints]",
        f"{offset},{beat_length},4,2,1,60,1,0",
        "",
        "[HitObjects]"
    ]

    hit_objects = []

    angle = 0
    radius = 120
    center_x, center_y = 256, 192
    last_time_ms = -1000

    for hit_time in onsets:
        time_ms = int(hit_time * 1000)
        snapped_time_ms = int(snap_to_grid(time_ms, bpm, offset))

        if snapped_time_ms <= last_time_ms + (beat_length / 4):
            continue

        x = int(center_x + radius * np.cos(angle))
        y = int(center_y + radius * np.sin(angle))

        last_time_ms = snapped_time_ms

        content.append(f"{x},{y},{snapped_time_ms},1,0,0:0:0:0:")
        hit_objects.append({
            "x": x,
            "y": y,
            "t": snapped_time_ms
        })

        angle += 0.5

    return "\n".join(content), hit_objects

import os
import zipfile
import uuid

OUTPUT_DIR = "output"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)


def generate_osu_text(data: dict, audio_filename: str) -> str:
    bpm = data['bpm']
    beat_length = 60000 / bpm if bpm > 0 else 500
    offset = data['offset']

    lines = [
        "osu file version v14",
        "",
        "[General]",
        f"AudioFilename: {audio_filename}",
        "AudioLeadIn: 0",
        "Mode: 0",
        "",
        "[Metadata]",
        f"Title:{data['title']}",
        f"Artist:{data['artist']}",
        f"Creator:{data['creator']}",
        "Version:AI Generated",
        "Source:",
        "Tags:ai generated automapper",
        "",
        "[Difficulty]",
        f"HPDrainRate:{data['hp']}",
        f"CircleSize:{data['cs']}",
        f"OverallDifficulty:{data['od']}",
        f"ApproachRate:{data['ar']}",
        "SliderMultiplier:1.4",
        "SliderTickRate:1",
        "",
        "[TimingPoints]",
        f"{offset},{beat_length},4,2,1,60,1,0",
        "",
        "[HitObjects]"
    ]

    for obj in data['hit_objects']:
        obj_type = 5 if obj.get('new_combo') else 1
        x, y, t = obj['x'], obj['y'], obj['time']

        lines.append(f"{x},{y},{t},{obj_type},0,0:0:0:0:")

    return "\n".join(lines)


def create_osz_package(audio_path: str, data: dict):
    package_id = str(uuid.uuid4())[:8]
    safe_artist = "".join(c for c in data['artist'] if c.isalnum() or c in " _-").strip()
    safe_title = "".join(c for c in data['title'] if c.isalnum() or c in " _-").strip()

    osz_filename = f"{safe_artist} - {safe_title} ({package_id}).osz"
    osz_path = os.path.join(OUTPUT_DIR, osz_filename)

    osu_filename = f"{safe_artist} - {safe_title} ({data['creator']}) [AI Generated].osu"

    osu_content = generate_osu_text(data, audio_filename=data['original_filename'])

    with zipfile.ZipFile(osz_path, 'w', compression=zipfile.ZIP_DEFLATED) as osz:
        osz.write(audio_path, arcname=data['original_filename'])
        osz.writestr(osu_filename, osu_content)

    return osz_filename
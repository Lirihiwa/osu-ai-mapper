from analyzer.services.intensity import get_intensity_at_time


def generate_hit_objects(onsets, bpm, offset, grid_size, start_time, end_time, intensity_profile):
    hit_objects = []
    ms_per_beat = 60000 / bpm
    last_time = -1

    for t_sec in onsets:
        t_ms = t_sec * 1000

        if t_ms < start_time: continue
        if end_time and t_ms > end_time: break

        intensity = get_intensity_at_time(t_ms, intensity_profile)

        ms_per_snap = ms_per_beat / grid_size
        num_snaps = round((t_ms - offset) / ms_per_snap)
        snapped_t = int(offset + (num_snaps * ms_per_snap))

        if last_time != -1:
            gap_in_beats = (snapped_t - last_time) / ms_per_beat
            
            if intensity < 0.4 and gap_in_beats < 0.45:
                continue
            if intensity < 0.2 and gap_in_beats < 0.9:
                continue

        if snapped_t <= last_time:
            continue

        hit_objects.append({
            "x": 256,
            "y": 192,
            "time": snapped_t,
            "new_combo": False
        })

        last_time = snapped_t

    return hit_objects
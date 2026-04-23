def generate_hit_objects(onsets, bpm, offset, grid_size, start_time, end_time):
    hit_objects = []
    ms_per_beat = 60000 / bpm
    last_time = -1

    for t_sec in onsets:
        t_ms = t_sec * 1000

        if t_ms < start_time: continue
        if end_time and t_ms > end_time: break

        ms_per_snap = ms_per_beat / grid_size
        num_snaps = round((t_ms - offset) / ms_per_snap)
        snapped_t = int(offset + (num_snaps * ms_per_snap))

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
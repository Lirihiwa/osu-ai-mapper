def snap_time(time_ms, bpm, offset, grid_size):
    ms_per_beat = 60000 / bpm
    ms_per_snap = ms_per_beat / grid_size
    num_snaps = round((time_ms - offset) / ms_per_snap)
    return int(offset + (num_snaps * ms_per_snap))


def generate_hit_objects(onsets, bpm, offset, grid_size, start_time, end_time):
    hit_objects = []
    last_time = -1

    for t_sec in onsets:
        t_ms = t_sec * 1000

        if t_ms < start_time: continue
        if end_time and t_ms > end_time: break

        snapped_t = snap_time(t_ms, bpm, offset, grid_size)

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

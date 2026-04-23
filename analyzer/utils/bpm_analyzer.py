import numpy as np

import madmom

def default(file_path):
    rnn_beat_proc = madmom.features.beats.RNNBeatProcessor()
    tempo_proc = madmom.features.tempo.TempoEstimationProcessor(fps=100)

    beat_activations = rnn_beat_proc(file_path)
    tempos = tempo_proc(beat_activations)
    estimated_bpm = tempos[0][0]

    return estimated_bpm


def analyze(file_path):
    rnn_beat_proc = madmom.features.beats.RNNBeatProcessor()
    beat_activations = rnn_beat_proc(file_path)

    beat_tracker = madmom.features.beats.DBNBeatTrackingProcessor(fps=100)
    beat_times = beat_tracker(beat_activations)
    intervals = np.diff(beat_times)

    bpm = 60.0 / intervals

    mean_bpm = np.mean(bpm)
    median_bpm = np.median(bpm)

    return mean_bpm, median_bpm

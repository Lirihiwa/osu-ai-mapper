import madmom
import numpy as np

_rnn_beat_processor = madmom.features.beats.RNNBeatProcessor()
_tempo_estimator = madmom.features.tempo.TempoEstimationProcessor(fps=100)
_beat_tracker = madmom.features.beats.DBNBeatTrackingProcessor(fps=100)

def estimate_bpm(file_path: str):
    activations = _rnn_beat_processor.process(file_path)
    beat_times = _beat_tracker(activations)

    if len(beat_times) < 2:
        return {
            "estimated_bpm": {
                "mean": 0,
                "median": 0,
            },
            "std_error": 0,
        }

    bpm = 60.0 / np.diff(beat_times)

    return {
        "estimated_bpm": {
            "mean": round(np.mean(bpm), 2),
            "median": round(np.median(bpm), 2),
        },
        "std_error": round(np.std(bpm), 2),
    }

import madmom

_rnn_onset_processor = madmom.features.onsets.RNNOnsetProcessor()

def get_raw_onsets(file_path: str, threshold: float):
    activations = _rnn_onset_processor(file_path)

    picker = madmom.features.onsets.OnsetPeakPickingProcessor(
        fps=100,
        threshold=threshold,
        pre_max=0.01,
        post_max=0.01
    )
    onsets = picker(activations)
    return onsets.tolist()
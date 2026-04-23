import madmom
import numpy as np

from utils.bpm_analyzer import analyze
from utils.map_generator import create_osu_file


def generate_osu_content(audio_name, bpm, onsets):
    osu_text, hit_objects = create_osu_file(audio_name, bpm, onsets)
    return osu_text, hit_objects


def run_analysis(file_path, filename):
    mean_bpm, median_bpm = analyze(file_path)
    bpm = round(mean_bpm)

    rnn_onset = madmom.features.onsets.RNNOnsetProcessor()
    onsets = madmom.features.onsets.OnsetPeakPickingProcessor(fps=100, threshold=0.4)(rnn_onset(file_path))

    osu_text, hit_objects = create_osu_file(filename, bpm, onsets)

    return bpm, hit_objects, osu_text
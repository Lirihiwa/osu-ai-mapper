import librosa
import numpy as np

def get_intensity_profile(file_path: str):
    y, sr = librosa.load(file_path, sr=22050)
    
    # 1. Вычисляем RMS (громкость/энергия)
    hop_length = 512
    rms = librosa.feature.rms(y=y, hop_length=hop_length)[0]
    
    # 2. Вычисляем Spectral Centroid (яркость звука - помогает отличить дроп от спокойного баса)
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr, hop_length=hop_length)[0]
    
    # Нормализуем значения от 0 до 1
    def normalize(arr):
        return (arr - np.min(arr)) / (np.max(arr) - np.min(arr) + 1e-6)

    intensity = normalize(rms) * 0.7 + normalize(centroid) * 0.3
    
    # Сглаживание, чтобы избежать резких скачков плотности на каждой ноте
    intensity = np.convolve(intensity, np.ones(20)/20, mode='same')
    
    times = librosa.frames_to_time(np.arange(len(intensity)), sr=sr, hop_length=hop_length)
    
    return list(zip(times, intensity))

def get_intensity_at_time(time_ms, profile):
    # Находит значение интенсивности для конкретного момента времени
    time_sec = time_ms / 1000
    # Простой поиск ближайшего значения (можно оптимизировать через бинарный поиск)
    for t, val in profile:
        if t >= time_sec:
            return val
    return profile[-1][1] if profile else 0.5
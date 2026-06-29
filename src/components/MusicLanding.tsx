"use client";

import Image from "next/image";
import {
  ListMusic,
  LoaderCircle,
  Menu,
  Pause,
  Play,
  X,
} from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { songs, type Song } from "@/data/songs";

const initialSong = songs[0];

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function MusicLanding() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song>(initialSong);
  const [duration, setDuration] = useState(initialSong.duration);
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Listo para sonar");

  function loadSong(song: Song) {
    const audio = audioRef.current;

    setCurrentSong(song);
    setDuration(song.duration);
    setProgress(0);
    setIsPlaying(false);
    setIsLoading(false);
    setStatusMessage("Listo para sonar");

    if (audio) {
      audio.pause();
      audio.src = song.src;
      audio.currentTime = 0;
      audio.load();
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!audio.currentSrc) {
      audio.src = currentSong.src;
      audio.currentTime = 0;
      audio.load();
    }

    if (audio.paused) {
      setIsLoading(true);

      try {
        await audio.play();
        setIsPlaying(true);
        setStatusMessage("");
      } catch {
        setStatusMessage("No pudimos iniciar el audio. Probá tocar play otra vez.");
      } finally {
        setIsLoading(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      setStatusMessage("Pausa");
    }
  }

  function handleSongSelect(song: Song) {
    setIsMenuOpen(false);
    loadSong(song);
  }

  function handleSeek(event: ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);

    setProgress(nextTime);

    if (audio && Number.isFinite(nextTime)) {
      audio.currentTime = nextTime;
    }
  }

  function handleMetadata() {
    const audio = audioRef.current;

    if (audio?.duration && Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;

    if (audio) {
      setProgress(audio.currentTime);
    }
  }

  function handleAudioError() {
    setIsLoading(false);
    setIsPlaying(false);
    setStatusMessage("No pudimos cargar ese audio. Probá otra canción.");
  }

  function handleEnded() {
    setIsPlaying(false);
    setProgress(duration);
    setStatusMessage("Fin del tema");
  }

  const boundedProgress = Math.min(progress, duration || 0);
  const progressPercent = duration ? (boundedProgress / duration) * 100 : 0;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#04020a] text-white">
      <Image
        src="/images/cover.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(90,207,255,0.34),transparent_30%),linear-gradient(115deg,rgba(3,4,16,0.9)_0%,rgba(3,4,16,0.48)_42%,rgba(3,4,16,0.84)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#04020a] via-[#04020a]/72 to-transparent" />

      <section className="relative z-10 flex min-h-dvh flex-col px-5 py-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <a
            href="#player"
            className="text-sm font-black uppercase tracking-[0.28em] text-[#ffdf79] outline-none transition hover:text-white focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#ffdf79]"
          >
            BandaDeCuarta
          </a>

          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white shadow-[0_10px_32px_rgba(0,0,0,0.28)] backdrop-blur-md transition hover:border-[#ffdf79] hover:text-[#ffdf79] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdf79]"
            aria-label="Abrir canciones"
            aria-expanded={isMenuOpen}
            aria-controls="song-menu"
            title="Canciones"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu aria-hidden="true" size={24} strokeWidth={2.4} />
          </button>
        </header>

        <div className="flex flex-1 items-end pb-6 pt-20 sm:pb-8 lg:pb-10">
          <div className="w-full max-w-5xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.34em] text-[#8fe7ff] sm:text-base">
              Cuarteto · Amigos · Mundial
            </p>
            <h1 className="max-w-full break-words text-4xl font-black leading-[0.95] text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.55)] sm:max-w-4xl sm:text-7xl lg:text-8xl">
              BandaDeCuarta
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-7 text-white/86 sm:text-2xl sm:leading-9">
              Ritmo, pasión y celeste y blanco.
            </p>
          </div>
        </div>

        <section
          id="player"
          aria-label="Reproductor de BandaDeCuarta"
          className="mb-1 grid gap-4 rounded-[8px] border border-white/18 bg-black/48 p-4 shadow-[0_16px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-5 lg:grid-cols-[auto_1fr_auto] lg:items-center"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ffcf5a] text-[#130813] shadow-[0_12px_30px_rgba(255,207,90,0.28)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={isPlaying ? "Pausar canción" : "Reproducir canción"}
              title={isPlaying ? "Pausar" : "Reproducir"}
              onClick={() => void togglePlayback()}
            >
              {isLoading ? (
                <LoaderCircle
                  className="animate-spin"
                  aria-hidden="true"
                  size={24}
                />
              ) : isPlaying ? (
                <Pause aria-hidden="true" size={25} fill="currentColor" />
              ) : (
                <Play aria-hidden="true" size={25} fill="currentColor" />
              )}
            </button>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffdf79]">
                Sonando ahora
              </p>
              <h2 className="truncate text-xl font-black leading-tight text-white sm:text-2xl">
                {currentSong.title}
              </h2>
              <p className="min-h-5 text-sm font-semibold text-white/70">
                {statusMessage || (isPlaying ? "En vivo" : "Preparado")}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-xs font-bold tabular-nums text-white/72">
              <span>{formatTime(boundedProgress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              className="player-range h-2 w-full cursor-pointer rounded-full"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={boundedProgress}
              aria-label="Avance de la canción"
              onChange={handleSeek}
              style={{
                background: `linear-gradient(90deg, #ffcf5a ${progressPercent}%, rgba(255,255,255,0.28) ${progressPercent}%)`,
              }}
            />
          </div>

          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:border-[#8fe7ff] hover:bg-[#8fe7ff]/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe7ff]"
            onClick={() => setIsMenuOpen(true)}
          >
            <ListMusic aria-hidden="true" size={19} />
            Temas
          </button>
        </section>
      </section>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-20">
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-black/58 backdrop-blur-sm"
            aria-label="Cerrar canciones"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside
            id="song-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="song-menu-title"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/16 bg-[#080411]/96 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.42)] sm:w-[28rem]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/12 px-5 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8fe7ff]">
                  Playlist
                </p>
                <h2 id="song-menu-title" className="text-2xl font-black">
                  Canciones
                </h2>
              </div>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition hover:border-[#ffdf79] hover:text-[#ffdf79] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdf79]"
                aria-label="Cerrar canciones"
                title="Cerrar"
                onClick={() => setIsMenuOpen(false)}
              >
                <X aria-hidden="true" size={22} />
              </button>
            </div>

            <div className="overflow-y-auto px-3 py-3">
              <ol className="grid gap-2">
                {songs.map((song, index) => {
                  const isCurrent = song.id === currentSong.id;

                  return (
                    <li key={song.id}>
                      <button
                        type="button"
                        className={`grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-[8px] border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdf79] ${
                          isCurrent
                            ? "border-[#ffdf79]/80 bg-[#ffdf79]/16"
                            : "border-white/10 bg-white/6 hover:border-[#8fe7ff]/70 hover:bg-[#8fe7ff]/12"
                        }`}
                        aria-current={isCurrent ? "true" : undefined}
                        onClick={() => handleSongSelect(song)}
                      >
                        <span className="text-sm font-black tabular-nums text-white/54">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-base font-black text-white">
                            {song.title}
                          </span>
                          <span className="text-sm font-semibold text-white/56">
                            {isCurrent && isPlaying ? "Reproduciendo" : "Tema"}
                          </span>
                        </span>
                        <span className="text-sm font-bold tabular-nums text-white/62">
                          {formatTime(song.duration)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>
      ) : null}

      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={handleMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={handleAudioError}
        onEnded={handleEnded}
      />
    </main>
  );
}

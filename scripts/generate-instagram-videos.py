"""Generate short MP4 animations for Instagram STACK highlight Stories."""

from __future__ import annotations

import argparse
import importlib.util
import sys
from pathlib import Path
from typing import Callable

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "brand" / "instagram"
VIDEOS_STACK = OUT / "videos-stack"
FPS = 30


def _load_highlights():
    script = Path(__file__).with_name("generate-instagram-highlights.py")
    spec = importlib.util.spec_from_file_location("instagram_highlights", script)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load {script}")
    mod = importlib.util.module_from_spec(spec)
    sys.modules["instagram_highlights"] = mod
    spec.loader.exec_module(mod)
    return mod


def _write_mp4(frames: list[np.ndarray], path: Path, fps: int = FPS) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        import imageio.v3 as iio

        iio.imwrite(path, frames, fps=fps, codec="libx264", pixelformat="yuv420p")
        print(f"  video  {path.relative_to(ROOT)}")
        return
    except Exception as exc:
        print(f"  imageio  {exc} — trying moviepy")

    try:
        from moviepy.editor import ImageSequenceClip

        clip = ImageSequenceClip(frames, fps=fps)
        clip.write_videofile(
            str(path),
            fps=fps,
            codec="libx264",
            audio=False,
            logger=None,
            verbose=False,
        )
        clip.close()
        print(f"  video  {path.relative_to(ROOT)}")
    except ImportError:
        _write_gif_pil(frames, path.with_suffix(".gif"), fps=fps)
        print(f"  video  mp4 unavailable — wrote {path.with_suffix('.gif').relative_to(ROOT)}")
        print("  install: pip install imageio[ffmpeg]  for MP4 output")


def _write_gif_pil(frames: list[np.ndarray], path: Path, *, fps: int = FPS) -> None:
    from PIL import Image

    path.parent.mkdir(parents=True, exist_ok=True)
    pil_frames = [Image.fromarray(frame) for frame in frames]
    duration_ms = max(1, int(1000 / fps))
    pil_frames[0].save(
        path,
        save_all=True,
        append_images=pil_frames[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
    )


def _progress_frames(duration: float, fps: int = FPS) -> list[float]:
    n = max(2, int(duration * fps))
    return [i / (n - 1) for i in range(n)]


def generate_stack_videos(h: object, *, duration: float) -> None:
    h.ensure_logos()
    specs: list[tuple[str, Callable[[float], object]]] = [
        ("01-what-i-build.mp4", h.render_stack_what_i_build_frame),
        (
            "02-languages.mp4",
            lambda p: h.render_stack_skill_rows_frame(h.STACK_LANGUAGES, "Languages I write", p),
        ),
        (
            "03-frameworks.mp4",
            lambda p: h.render_stack_skill_rows_frame(h.STACK_FRAMEWORKS, "Frameworks I ship with", p),
        ),
        (
            "04-tools.mp4",
            lambda p: h.render_stack_skill_rows_frame(h.STACK_TOOLS, "Tools & deploy", p),
        ),
        ("05-architecture.mp4", h.render_stack_architecture_frame),
    ]
    for filename, render_fn in specs:
        frames = [np.asarray(render_fn(p).convert("RGB")) for p in _progress_frames(duration)]
        _write_mp4(frames, VIDEOS_STACK / filename)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Instagram STACK story MP4s")
    parser.add_argument("--duration", type=float, default=4.0, help="Clip length in seconds")
    args = parser.parse_args()

    print(f"Output: {VIDEOS_STACK}")
    h = _load_highlights()
    generate_stack_videos(h, duration=args.duration)
    count = len(list(VIDEOS_STACK.glob("*.mp4"))) + len(list(VIDEOS_STACK.glob("*.gif")))
    print(f"Done. {count} STACK video(s) in videos-stack/.")


if __name__ == "__main__":
    main()

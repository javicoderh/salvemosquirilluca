---
name: prepare-transparent-scroll-animation
description: Convert centered monochrome MP4 animations on a flat white background into lightweight transparent WebM and WebP assets for scroll-controlled website animation. Use when Codex needs to extract video frames, remove only border-connected white background while preserving enclosed white subject areas and source shadows, replace the project's feline scroll assets, or validate VP9 alpha output.
---

# Prepare Transparent Scroll Animation

Produce transparent, source-faithful animation assets with the repository's deterministic PowerShell and FFmpeg pipeline. Do not regenerate or reinterpret the subject with an image model.

## Preconditions

- Work from the repository root.
- Require Windows PowerShell, `ffmpeg`, and `ffprobe`.
- Use `scripts/prepare_feline_scroll_asset.ps1`.
- Expect a 1920x1080 MP4 with a centered grayscale subject on a flat white background.
- Expect the subject and shadow to fit inside the central 720 horizontal pixels.

If dimensions, background, color model, or framing differ, inspect the source and adapt the processing script before running it.

## Workflow

1. Locate the requested source with `rg --files`.
2. Inspect duration, dimensions, frame rate, frame count, and size:

   ```powershell
   ffprobe -v error `
     -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,nb_frames `
     -of default=noprint_wrappers=1 `
     "<input.mp4>"
   ```

3. Generate a temporary contact sheet and inspect it with `view_image`. Confirm:

   - the complete subject remains inside the source frame;
   - the background is uniformly white;
   - the source shadow is present when expected;
   - the animation is not unintentionally duplicated;
   - the crop assumptions still hold.

4. Run the repository script:

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass `
     -File ".\scripts\prepare_feline_scroll_asset.ps1" `
     -InputPath "<input.mp4>"
   ```

   Override `-OutputDirectory` or `-FramesPerSecond` only when the user asks or the consuming component requires it.

5. Treat these as the canonical outputs:

   - `public/assets/feline-scroll/feline-scroll.webm`
   - `public/assets/feline-scroll/feline-poster.webp`

## Mask behavior

The script:

- extracts the source at 20 fps;
- crops `720:1080:600:0`;
- scales to `360x540`;
- flood-fills near-white pixels connected to the left, right, and bottom borders;
- excludes the top border as a flood-fill origin so a subject crossing the top edge does not lose enclosed white areas;
- converts connected antialiasing into proportional alpha;
- keeps enclosed white subject regions opaque;
- preserves detached shadows;
- encodes VP9 WebM with alpha and a transparent WebP poster;
- removes its temporary frame directories.

Do not replace this connected-background mask with a plain white color key: a plain key also removes white areas inside the subject.

## Validation

Inspect the output metadata:

```powershell
ffprobe -v error `
  -show_entries format=duration,size:stream=width,height,r_frame_rate:stream_tags=alpha_mode `
  -of default=noprint_wrappers=1 `
  ".\public\assets\feline-scroll\feline-scroll.webm"
```

Require:

- `width=360`
- `height=540`
- expected frame rate
- `TAG:alpha_mode=1`
- plausible duration and file size

Decode a representative peak frame with the libvpx decoder, composite it over the site's dark background, and inspect it:

```powershell
ffmpeg -hide_banner -loglevel error -y `
  -c:v libvpx-vp9 -ss 3 `
  -i ".\public\assets\feline-scroll\feline-scroll.webm" `
  -filter_complex "color=c=0x182016:s=360x540[bg];[bg][0:v]overlay=format=auto" `
  -frames:v 1 "<temporary-preview.png>"
```

Confirm:

- transparent background without white box;
- complete head and limbs;
- enclosed white markings preserved;
- no bright edge halo;
- source shadow retained;
- no accidental second cycle.

Run the project build after replacement. Report unrelated pre-existing diagnostics separately.

## Integration checks

- Keep `src/components/ui/ScrollFeline.astro` pointed at the canonical WebM and poster paths.
- If the source contains repeated cycles, limit the consuming sequence duration or trim the asset; do not map duplicate cycles across one scroll.
- Preserve `overflow: visible` when the animation can paint near the container boundary.
- Do not change scroll mapping, size, position, or accessibility behavior unless requested.
- Respect `prefers-reduced-motion`.

## Safety

- Never overwrite the source MP4.
- Replace canonical output assets only when the user authorizes replacement.
- Keep temporary files inside a verified workspace or system temporary directory and remove only exact validated paths.
- Do not commit, push, or deploy unless explicitly requested.

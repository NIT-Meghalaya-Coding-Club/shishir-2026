"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Image as ImageIcon, Minus, Plus, RotateCcw, X } from "lucide-react";

const DEFAULT_MAX_SIZE_MB = 2;
const configuredMaxSizeMb = Number(process.env.NEXT_PUBLIC_POSTER_MAX_SIZE_MB);
export const MAX_IMAGE_SIZE_MB = Number.isFinite(configuredMaxSizeMb) && configuredMaxSizeMb > 0
  ? configuredMaxSizeMb
  : DEFAULT_MAX_SIZE_MB;
const PREVIEW_SIZE = 360;

type ImageCropperProps = {
  file: File;
  onComplete: (file: File) => void;
  onCancel: () => void;
  maxSizeMb?: number;
  shape?: "square" | "circle";
};

type Point = { x: number; y: number };

function getPreviewDimensions(image: HTMLImageElement, zoom: number) {
  const scale = Math.max(PREVIEW_SIZE / image.naturalWidth, PREVIEW_SIZE / image.naturalHeight) * zoom;
  return {
    scale,
    width: image.naturalWidth * scale,
    height: image.naturalHeight * scale,
  };
}

function getConstrainedPosition(image: HTMLImageElement, position: Point, zoom: number) {
  const { width, height } = getPreviewDimensions(image, zoom);
  const maxX = Math.max(0, (width - PREVIEW_SIZE) / 2);
  const maxY = Math.max(0, (height - PREVIEW_SIZE) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, position.x)),
    y: Math.min(maxY, Math.max(-maxY, position.y)),
  };
}

function createBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

async function createCroppedFile(image: HTMLImageElement, position: Point, zoom: number, name: string, maxSizeMb: number) {
  const { scale } = getPreviewDimensions(image, zoom);
  const sourceSize = PREVIEW_SIZE / scale;
  const sourceX = (image.naturalWidth - sourceSize) / 2 - position.x / scale;
  const sourceY = (image.naturalHeight - sourceSize) / 2 - position.y / scale;
  const outputSize = Math.min(2048, Math.max(1, Math.floor(sourceSize)));
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Could not prepare the image editor");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    Math.max(0, sourceX),
    Math.max(0, sourceY),
    Math.min(sourceSize, image.naturalWidth - Math.max(0, sourceX)),
    Math.min(sourceSize, image.naturalHeight - Math.max(0, sourceY)),
    0,
    0,
    outputSize,
    outputSize
  );

  for (const quality of [0.9, 0.8, 0.7, 0.6, 0.5]) {
    const blob = await createBlob(canvas, quality);
    if (blob && blob.size <= maxSizeMb * 1024 * 1024) {
      return new File([blob], `${name.replace(/\.[^.]+$/, "") || "image"}.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    }
  }

  throw new Error(`This image could not be reduced below ${MAX_IMAGE_SIZE_MB} MB`);
}

export default function ImageCropper({
  file,
  onComplete,
  onCancel,
  maxSizeMb = MAX_IMAGE_SIZE_MB,
  shape = "square",
}: ImageCropperProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ pointerId: number; start: Point; position: Point } | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const updateZoom = (nextZoom: number) => {
    const image = imageRef.current;
    if (!image) return;
    const boundedZoom = Math.min(3, Math.max(1, nextZoom));
    setZoom(boundedZoom);
    setPosition((current) => getConstrainedPosition(image, current, boundedZoom));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, position };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const image = imageRef.current;
    if (!drag || !image || drag.pointerId !== event.pointerId) return;
    setPosition(
      getConstrainedPosition(
        image,
        { x: drag.position.x + event.clientX - drag.start.x, y: drag.position.y + event.clientY - drag.start.y },
        zoom
      )
    );
  };

  const finish = async () => {
    const image = imageRef.current;
    if (!image) return;
    setProcessing(true);
    setError("");
    try {
      const croppedFile = await createCroppedFile(image, position, zoom, file.name, maxSizeMb);
      onComplete(croppedFile);
    } catch (processingError) {
      setError(processingError instanceof Error ? processingError.message : "Could not prepare this image");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-labelledby="image-editor-title">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="image-editor-title" className="flex items-center gap-2 text-lg font-semibold text-white"><ImageIcon className="h-5 w-5 text-amber-300" />Adjust image crop</h2>
            <p className="mt-1 text-sm text-zinc-400">Drag the image to choose what appears in the {shape}.</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close image editor" className="rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className={`relative mx-auto aspect-square w-full max-w-[360px] touch-none overflow-hidden bg-zinc-900 ring-1 ring-white/15 cursor-crosshair active:cursor-grabbing ${shape === "circle" ? "rounded-full" : "rounded-lg"}`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }}>
          {imageUrl && <Image ref={imageRef} src={imageUrl} alt="Image crop preview" unoptimized width={getPreviewDimensions(imageRef.current || ({ naturalWidth: 1, naturalHeight: 1 } as HTMLImageElement), zoom).width} height={getPreviewDimensions(imageRef.current || ({ naturalWidth: 1, naturalHeight: 1 } as HTMLImageElement), zoom).height} onLoad={() => setPosition({ x: 0, y: 0 })} className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none" style={{ transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)` }} />}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/30" />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={() => updateZoom(zoom - 0.1)} aria-label="Zoom out" className="rounded-md border border-white/10 p-2 text-zinc-300 hover:bg-white/10"><Minus className="h-4 w-4" /></button>
          <input aria-label="Image zoom" type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => updateZoom(Number(event.target.value))} className="flex-1 accent-amber-400" />
          <button type="button" onClick={() => updateZoom(zoom + 0.1)} aria-label="Zoom in" className="rounded-md border border-white/10 p-2 text-zinc-300 hover:bg-white/10"><Plus className="h-4 w-4" /></button>
          <button type="button" onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }} aria-label="Reset crop" className="rounded-md border border-white/10 p-2 text-zinc-300 hover:bg-white/10"><RotateCcw className="h-4 w-4" /></button>
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10">Cancel</button>
          <button type="button" onClick={finish} disabled={processing} className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"><Check className="h-4 w-4" />{processing ? "Preparing..." : "Use this crop"}</button>
        </div>
      </div>
    </div>
  );
}
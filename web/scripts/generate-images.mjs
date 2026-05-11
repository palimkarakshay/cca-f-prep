#!/usr/bin/env node
/* Generate demo logos, pack icons, OG card, and hero illustrations via fal.ai.

   Usage:
     FAL_KEY=… node web/scripts/generate-images.mjs --mode=draft
     FAL_KEY=… node web/scripts/generate-images.mjs --mode=final --only=brand.curio-logo,og.curio-og
     node web/scripts/generate-images.mjs --dry  # print plan, no API calls

   Modes:
     draft  → FLUX.1 [schnell], 4 variants per surface, saved under <surface>/drafts/
     final  → FLUX.1 [pro] v1.1,  1 variant per surface,  saved under <surface>/final/

   No deps. Node 18+ (uses global fetch). Reads prompts from image-prompts.json
   next to this file.
*/

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(HERE, "..");
const IMAGES_ROOT = join(WEB_ROOT, "public", "images");
const PROMPTS_PATH = join(HERE, "image-prompts.json");

const FAL_BASE = "https://queue.fal.run";
const MODEL_DRAFT = "fal-ai/flux/schnell";
const MODEL_FINAL = "fal-ai/flux-pro/v1.1";

function parsePositiveInt(raw, flag) {
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    throw new Error(`${flag} must be a positive integer, got ${JSON.stringify(raw)}`);
  }
  return n;
}

function parseArgs(argv) {
  const out = { mode: "draft", only: null, dry: false, variants: null, maxImages: 80 };
  for (const arg of argv.slice(2)) {
    if (arg === "--dry") out.dry = true;
    else if (arg.startsWith("--mode=")) out.mode = arg.slice(7);
    else if (arg.startsWith("--only=")) out.only = arg.slice(7).split(",").map(s => s.trim()).filter(Boolean);
    else if (arg.startsWith("--variants=")) out.variants = parsePositiveInt(arg.slice(11), "--variants");
    else if (arg.startsWith("--max-images=")) out.maxImages = parsePositiveInt(arg.slice(13), "--max-images");
    else throw new Error(`unknown arg: ${arg}`);
  }
  if (!["draft", "final"].includes(out.mode)) {
    throw new Error(`--mode must be draft or final, got ${out.mode}`);
  }
  return out;
}

// Per-image cost estimates ($USD). Refreshed against fal.ai pricing 2026-05.
const COST_USD_PER_IMAGE = {
  "fal-ai/flux/schnell": 0.003,
  "fal-ai/flux-pro/v1.1": 0.04,
};

function flatten(prompts) {
  // Walk the prompts JSON into a flat list of { id, group, name, prompt, size }.
  const out = [];
  for (const [group, surfaces] of Object.entries(prompts)) {
    if (group.startsWith("_")) continue;
    for (const [name, spec] of Object.entries(surfaces)) {
      out.push({ id: `${group}.${name}`, group, name, ...spec });
    }
  }
  return out;
}

async function submit({ apiKey, model, prompt, size, n }) {
  const url = `${FAL_BASE}/${model}`;
  const body = {
    prompt,
    image_size: size ?? "square_hd",
    num_images: n,
    enable_safety_checker: true,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "authorization": `Key ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fal submit failed ${res.status}: ${text.slice(0, 400)}`);
  }
  return res.json(); // { request_id, status_url, response_url, ... }
}

async function poll({ apiKey, statusUrl, responseUrl }) {
  // fal queue: GET status_url until status === "COMPLETED", then GET response_url.
  // The deadline expiring without an observed COMPLETED must throw — otherwise
  // fal's 202 on responseUrl (still in progress) passes Response.ok and we'd
  // silently record a successful surface with zero images.
  const deadline = Date.now() + 5 * 60 * 1000;
  let delay = 1500;
  let lastStatus = "(none)";
  let completed = false;
  while (Date.now() < deadline) {
    const res = await fetch(statusUrl, {
      headers: { "authorization": `Key ${apiKey}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`fal status failed ${res.status}: ${text.slice(0, 400)}`);
    }
    const status = await res.json();
    lastStatus = status.status ?? "(missing)";
    if (lastStatus === "COMPLETED") {
      completed = true;
      break;
    }
    if (lastStatus === "FAILED" || lastStatus === "CANCELED") {
      throw new Error(`fal job ${lastStatus}: ${JSON.stringify(status).slice(0, 400)}`);
    }
    await new Promise(r => setTimeout(r, delay));
    delay = Math.min(delay * 1.3, 4000);
  }
  if (!completed) {
    throw new Error(`fal poll deadline exceeded after 5min; last status=${lastStatus}`);
  }
  const final = await fetch(responseUrl, {
    headers: { "authorization": `Key ${apiKey}` },
  });
  if (!final.ok) {
    const text = await final.text();
    throw new Error(`fal response failed ${final.status}: ${text.slice(0, 400)}`);
  }
  return final.json();
}

async function download(imageUrl, destPath) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`download failed ${res.status} for ${imageUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, buf);
}

async function main() {
  const args = parseArgs(process.argv);
  const promptsRaw = await readFile(PROMPTS_PATH, "utf8");
  const prompts = JSON.parse(promptsRaw);
  const allSurfaces = flatten(prompts);
  const selected = args.only
    ? allSurfaces.filter(s => args.only.includes(s.id))
    : allSurfaces;
  if (selected.length === 0) {
    throw new Error(`no surfaces matched --only=${args.only?.join(",")}`);
  }

  const isDraft = args.mode === "draft";
  const model = isDraft ? MODEL_DRAFT : MODEL_FINAL;
  const variants = args.variants ?? (isDraft ? 3 : 1);
  const subdir = isDraft ? "drafts" : "final";

  const totalImages = selected.length * variants;
  const perImage = COST_USD_PER_IMAGE[model] ?? 0;
  const estCost = totalImages * perImage;
  console.log(`# generate-images: mode=${args.mode} model=${model} variants=${variants} surfaces=${selected.length}`);
  console.log(`# budget: ${totalImages} images × $${perImage} ≈ $${estCost.toFixed(3)} (cap ${args.maxImages} images)`);
  console.log(`# style note: ${prompts._meta?.style?.slice(0, 80) ?? "(none)"}…`);
  if (totalImages > args.maxImages) {
    throw new Error(`budget guard tripped: ${totalImages} images > --max-images=${args.maxImages}. Lower --variants, narrow --only=, or raise --max-images.`);
  }
  if (args.dry) {
    for (const s of selected) {
      console.log(`  ${s.id.padEnd(28)}  size=${s.size}  prompt="${s.prompt.slice(0, 60)}…"`);
    }
    console.log("# dry run, no API calls");
    return;
  }

  const apiKey = process.env.FAL_KEY;
  if (!apiKey) throw new Error("FAL_KEY env var not set");

  const meta = [];
  for (const s of selected) {
    process.stdout.write(`→ ${s.id} (${variants}x ${s.size}) … `);
    try {
      const job = await submit({ apiKey, model, prompt: s.prompt, size: s.size, n: variants });
      const result = await poll({ apiKey, statusUrl: job.status_url, responseUrl: job.response_url });
      const images = result.images ?? [];
      const saved = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const ext = (img.content_type ?? "image/png").includes("jpeg") ? "jpg" : "png";
        const fname = variants > 1 ? `${s.name}-v${i + 1}.${ext}` : `${s.name}.${ext}`;
        const out = join(IMAGES_ROOT, s.group, subdir, fname);
        await download(img.url, out);
        saved.push(out.replace(WEB_ROOT + "/", ""));
      }
      meta.push({ id: s.id, mode: args.mode, model, saved, seed: result.seed ?? null });
      console.log(`✓ ${saved.length} saved`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      meta.push({ id: s.id, mode: args.mode, model, error: String(err.message) });
    }
  }

  const manifestPath = join(IMAGES_ROOT, `manifest-${args.mode}.json`);
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), results: meta }, null, 2));
  console.log(`# manifest → ${manifestPath.replace(WEB_ROOT + "/", "")}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

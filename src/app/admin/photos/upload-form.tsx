"use client";

import { useActionState, useEffect, useRef, useState, startTransition } from "react";
import imageCompression from "browser-image-compression";
import { uploadPhoto, type PhotoFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 超过这个大小就自动压缩
const COMPRESS_THRESHOLD = 5 * 1024 * 1024; // 5MB
const COMPRESS_OPTIONS = {
  maxSizeMB: 5, // 压到 5MB 以内
  maxWidthOrHeight: 4096, // 长边不超过 4096px，保留较高清晰度
  useWebWorker: true,
};

const fmt = (bytes: number) =>
  bytes >= 1024 * 1024
    ? (bytes / 1024 / 1024).toFixed(1) + "MB"
    : Math.round(bytes / 1024) + "KB";

export function UploadForm({ foods }: { foods: { slug: string; title: string }[] }) {
  const [state, formAction, pending] = useActionState<PhotoFormState, FormData>(
    uploadPhoto,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [working, setWorking] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setNote(null);
    }
  }, [state]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File | null;

    if (!file || file.size === 0) {
      setNote("请先选择一张图片。");
      return;
    }

    setWorking(true);
    try {
      let toUpload = file;
      if (file.size > COMPRESS_THRESHOLD) {
        setNote(`图片 ${fmt(file.size)}，正在压缩…`);
        const compressed = await imageCompression(file, COMPRESS_OPTIONS);
        // 保留原文件名（扩展名）
        toUpload = new File([compressed], file.name, { type: compressed.type });
        setNote(`已压缩：${fmt(file.size)} → ${fmt(toUpload.size)}，上传中…`);
        fd.set("file", toUpload);
      } else {
        setNote(`图片 ${fmt(file.size)}，上传中…`);
      }
      // 异步（压缩）之后必须在 transition 内调用 action，否则 pending 状态会失效
      startTransition(() => formAction(fd));
    } catch {
      setNote("压缩失败，请换一张图或重试。");
    } finally {
      setWorking(false);
    }
  }

  const busy = working || pending;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">选择图片 *</label>
        <Input
          name="file"
          type="file"
          accept="image/*"
          required
          className="cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm"
        />
        <p className="text-xs text-muted-foreground">
          jpg/png/webp 均可，超过 5MB 的大图会自动压缩，无需手动处理。
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">说明文字</label>
        <Input name="caption" placeholder="例如：六小时熬出的豚骨汤" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">关联食记（选填）</label>
        <select
          name="food_slug"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          defaultValue=""
        >
          <option value="">不关联</option>
          {foods.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.title}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">关联后，照片墙点这张图会跳到对应食记。</p>
      </div>

      {note && !state?.error && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{note}</p>
      )}
      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
          ✅ 上传成功！可以继续传下一张。
        </p>
      )}

      <Button type="submit" disabled={busy}>
        {working ? "处理中…" : pending ? "上传中…" : "上传照片"}
      </Button>
    </form>
  );
}

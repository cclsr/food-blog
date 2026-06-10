"use client";

import { useActionState, useEffect, useRef } from "react";
import { addComment, type CommentState } from "./comment-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CommentForm({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState<CommentState, FormData>(
    addComment,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="slug" value={slug} />
      <Input name="author" placeholder="你的昵称（选填，默认匿名）" className="sm:max-w-xs" />
      <Textarea name="body" required rows={3} placeholder="说点什么吧…" />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p className="text-sm text-primary">✅ 评论已发表，感谢分享！</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "发表中…" : "发表评论"}
      </Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createFood, type FormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

export default function NewFoodPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    createFood,
    null
  );

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回后台
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">✍️ 发布新食记</h1>

      <form action={formAction} className="space-y-5">
        <Field label="标题 *">
          <Input name="title" required placeholder="例如：番茄炒蛋的三个小秘密" />
        </Field>

        <Field label="网址别名 slug *" hint="出现在网址里，用小写英文或拼音，如 tomato-egg">
          <Input name="slug" required placeholder="tomato-egg" />
        </Field>

        <Field label="一句话简介" hint="显示在卡片上，留空则用标题">
          <Input name="excerpt" placeholder="国民下饭菜，做好了能多吃两碗饭。" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="封面图地址" hint="先用图片网址；4c 会做成直接上传">
            <Input name="cover" placeholder="留空自动配一张占位图" />
          </Field>
          <Field label="日期" hint="留空则用今天">
            <Input name="date" type="date" />
          </Field>
        </div>

        <Field label="标签" hint="用逗号或空格分隔，如：家常菜, 快手">
          <Input name="tags" placeholder="家常菜, 快手, 新手友好" />
        </Field>

        <Field label="正文" hint="每段一行，空行会被忽略">
          <Textarea
            name="body"
            rows={5}
            placeholder={"番茄炒蛋人人都会，但关键在细节……\n蛋先炒到七分熟盛出，最后回锅。"}
          />
        </Field>

        <Field label="食材（选填）" hint="每行一项">
          <Textarea name="ingredients" rows={4} placeholder={"番茄 2 个\n鸡蛋 3 个\n糖 1 小勺"} />
        </Field>

        <Field label="做法步骤（选填）" hint="每行一步，会自动加序号">
          <Textarea
            name="steps"
            rows={4}
            placeholder={"鸡蛋打散，热油滑炒至七分熟盛出。\n番茄炒出沙，调味后倒回鸡蛋翻炒。"}
          />
        </Field>

        {state?.error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "发布中…" : "发布食记"}
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/admin">取消</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

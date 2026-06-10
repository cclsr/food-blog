"use client";

import type { ReactNode } from "react";

// 提交前弹窗确认：用户点「取消」就拦下表单提交（用于删除等不可撤销的操作）。
export function ConfirmSubmit({
  message,
  className,
  title,
  children,
}: {
  message: string;
  className?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      title={title}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

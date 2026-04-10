import Link from "next/link";
import type { FormEventHandler, ReactNode } from "react";

interface FormProps {
  title: string;
  cancelHref: string;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  loadingLabel?: string;
  cancelLabel?: string;
}

export default function Form({
  title,
  cancelHref,
  submitLabel,
  isSubmitting,
  onSubmit,
  children,
  loadingLabel = "Saving...",
  cancelLabel = "Cancel",
}: FormProps) {
  return (
    <div className="p-8 max-w-2xl">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
        <form onSubmit={onSubmit} className="space-y-5">
          {children}

          <div className="flex gap-4 pt-2">
            <Link
              href={cancelHref}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition font-medium"
            >
              {cancelLabel}
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {isSubmitting ? loadingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

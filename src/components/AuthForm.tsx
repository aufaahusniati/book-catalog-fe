import Link from "next/link";
import type { FormEventHandler, ReactNode } from "react";

interface AuthFormProps {
  title: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  submitLabel: string;
  loadingLabel: string;
  globalError?: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  children: ReactNode;
  containerClassName?: string;
}

export default function AuthForm({
  title,
  onSubmit,
  isSubmitting,
  submitLabel,
  loadingLabel,
  globalError,
  footerText,
  footerLinkLabel,
  footerLinkHref,
  children,
  containerClassName = "flex min-h-screen items-center justify-center bg-gray-100",
}: AuthFormProps) {
  return (
    <div className={containerClassName}>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h2>

        {globalError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded border border-red-200">
            {globalError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {children}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
          >
            {isSubmitting ? loadingLabel : submitLabel}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="text-blue-600 hover:underline font-semibold"
          >
            {footerLinkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

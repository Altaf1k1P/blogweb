import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function EmptyState({
  title = "No items found",
  description = "Get started by creating something new.",
  actionText,
  actionLink,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 glass-effect rounded-2xl border border-white/5 max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-xs">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}
    </div>
  );
}

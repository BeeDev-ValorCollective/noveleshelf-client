import { useNavigate } from "react-router-dom";

// Shared hook for modal-aware auth actions.
// Provides a closeAndNavigate helper that always safely calls onClose
// before navigating, whether used as a modal or standalone page.

export default function useModalAuth(onClose) {
  const navigate = useNavigate();

  const closeAndNavigate = (path) => {
    if (onClose) onClose();
    navigate(path);
  };

  const safeClose = () => {
    if (onClose) onClose();
  };

  return { closeAndNavigate, safeClose };
}
import React from "react";
import { createPortal } from "react-dom";
import { LanguageCode } from "../../types";
import { LanguageSelectionScreen } from "./LanguageSelectionScreen";

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      id="language-selection-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <LanguageSelectionScreen
        currentLanguage={currentLanguage}
        onSelectLanguage={onSelectLanguage}
        onClose={onClose}
        isModal={true}
      />
    </div>,
    document.body
  );
};

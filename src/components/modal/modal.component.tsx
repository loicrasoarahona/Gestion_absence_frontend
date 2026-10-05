import React, { useEffect, useState } from "react";
import ServiceSelector from "../../core/ServiceSelector";

type ModalProps = {
  id: string;
  children: (closeModal: () => void) => React.ReactNode;
  onClose?: () => void;
  title?: string;
  full?: boolean;
};

const ModalComponent: React.FC<ModalProps> = ({
  id,
  children,
  onClose,
  title,
  full,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getOpen = () => isOpen;
    ServiceSelector.modalService.register(id, setIsOpen, getOpen);

    return () => {
      ServiceSelector.modalService.unregister(id);
    };
  }, [id, isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeModal}
        aria-hidden="true"
        style={{
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 100 }}
      >
        <div
          className={`bg-white rounded-xl shadow-xl p-6 w-full mx-auto ${!full ? "max-w-md" : "max-w-[90%]"}`}
        >
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-bold">{title}</h2>
            <button
              onClick={closeModal}
              className="text-gray-500 cursor-pointer"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
          <div>{children(closeModal)}</div>
        </div>
      </div>
    </>
  );
};

export default ModalComponent;

// ...existing code...
import { AnimatePresence, motion } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children, width = "max-w-md" }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose} // close when clicking backdrop
                >
                    {/* Modal Content */}
                    <motion.div
                        className={`rounded-2xl shadow-xl p-6 w-full ${width} relative`}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.stopPropagation()} // prevent backdrop click from closing when interacting inside
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 id="modal-title" className="text-xl font-semibold">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[70vh]">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
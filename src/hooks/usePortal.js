import { useMemo } from 'react';
import { createPortal } from 'react-dom';

export const usePortal = () => {
    const modalRoot = useMemo(() => {
        return document.getElementById('addTask_modal-root');
    }, []);

    const Portal = ({ children }) => {
        if (!modalRoot) return null;

        return createPortal(children, modalRoot);
    };

    return { Portal };
};

import { useEffect, useState } from 'react';
import Modal from 'react-modal'
import PizzaForm from '../pages/PizzaFormPage'
import '../styles/formModal.css'

function PizzaFormModal({ isOpen, onClose, pizza }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 500);
  }

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen || isClosing} // Mantén el modal en el DOM durante la animación de cierre
      onRequestClose={handleClose}
      className={isClosing ? 'fade-out modal-content' : 'fade-in modal-content'}
      overlayClassName='modal-overlay'
    >
      <PizzaForm onClose={handleClose} pizza={pizza}/>
    </Modal>
  )
}

export default PizzaFormModal

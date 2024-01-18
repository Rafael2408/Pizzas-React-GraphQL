import { useEffect, useState } from 'react';
import Modal from 'react-modal'
import IngredientForm from '../pages/IngredientFormPage'
import '../styles/formModal.css'

function IngredientFormModal({ isOpen, onClose, ingredient }) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
           setIsClosing(false) 
           onClose()
        }, 500);
    }

    useEffect(() =>{
        if (isOpen) {
            setIsClosing(false)
        }
    }, [isOpen])

    return (
        <Modal
                isOpen={isOpen || isClosing}
                onRequestClose={handleClose}
                className={isClosing ? 'fade-out modal-content' : 'fade-in modal-content'}
                overlayClassName='modal-overlay'
        >
            <IngredientForm onClose={handleClose} ingredient={ingredient}/>
        </Modal>
    )
}

export default IngredientFormModal
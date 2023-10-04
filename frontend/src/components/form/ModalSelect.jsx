import * as React from 'react'
import CustomSelect from './CustomSelect'

const DialogSelect = ({id, label, items, getItems, itemsStatus, formData, setFormData, compareItems, multiple}) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
                <CustomSelect {...{id, label, items, getItems, itemsStatus, formData, setFormData, compareItems, multiple}} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Subscribe</Button>
            </DialogActions>
        </Dialog>
    )
}
"use client";
import Cropper from 'react-easy-crop'
import {useCallback, useState} from "react";
import {Slider} from "@mui/material";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import '../app/settings/settings.module.scss'


const CropModal = (props) => {
    const [crop, setCrop] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)

    const saveChange = () => {
        props.handleClose();
        props.onSubmit();
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        props.onCropComplete(croppedAreaPixels)
    }, [])


    return (
        <Modal show={props.openModal} onHide={props.handleClose} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>Crop Image</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Cropper
                    image={props.image}
                    crop={crop}
                    zoom={zoom}
                    aspect={props.ratio}
                    onCropChange={setCrop}
                    cropShape={props.shape}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    zoomWithScroll={false}
                />
            </Modal.Body>
            <Modal.Footer className="d-flex flex-column modal-footer-align">
                <Slider
                    value={zoom}
                    size="small"
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e, zoom) => setZoom(Number(zoom))}
                    classes={{root: "slider"}}
                />
                <div className="d-inline-flex">
                    <Button variant="primary" onClick={saveChange}>
                        Save Changes
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}
export default CropModal;
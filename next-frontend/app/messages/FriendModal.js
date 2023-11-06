import {Modal, Button} from 'react-bootstrap';
import styles from './messages.module.scss';
import {useEffect, useState} from "react";
import {getChats, getContacts, createChatroom} from "../../middleware/operator";
import {Avatar} from "@mui/material";
import {useRouter, usePathname} from "next/navigation";
import checkmarkStyles from '/components/checkmark.module.scss'

function App(props) {

    const [contact, setContact] = useState([]);
    const [selected, setSelected] = useState([]);
    const router = useRouter();

    const triggerAdd = (e) => {
        const id = e.target.id;
        document.getElementById(id+'checkbox')?.click();
        const user = contact.filter((item) => {return item.user_id === id});
        setSelected(selected => [...selected, ...user]);
    }

    const handleChatroomResponse = async () => {
        const response = await createChatroom(selected);
        console.log(selected)
        console.log(response)
        router.push(`/messages/${response.redirect}`)
        props.handleClose();
    }

    useEffect(() => {
        getContacts().then((result) => setContact(result))
    }, [])

    return (
        <Modal show={props.show} onHide={props.handleClose} contentClassName={styles["friend-modal"]}>
            <Modal.Header closeButton bsPrefix={styles["friend-modal-header"]}>
                <Modal.Title>Friends</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {contact.map((item, i) => {
                    return (
                        <div
                            className={`d-flex text-center text-capitalize align-items-center p-1 ${styles["friend-modal-container"]}`}
                            id={item.user_id}
                            key={item.user_id}
                            onClick={(e) => {triggerAdd(e)}}
                        >
                            <Avatar
                                src={item.avatar}
                                className={"avatar-icon-small"}
                                imgProps={{"className": "avatar-circular-img "}}
                                variant="round"
                            />
                            <div className="ps-4 ">
                                {item.first_name + ' ' + item.last_name}
                            </div>
                            <input id={item.user_id + 'checkbox'} type="checkbox" value="yes" className={checkmarkStyles["checkbox"]}/>
                        </div>
                    )
                })}


            </Modal.Body>
            <Modal.Footer bsPrefix={styles["friend-modal-footer"]}>
                <Button variant="outline-primary"  onClick={handleChatroomResponse}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default App;
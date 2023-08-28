import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import styles from './navigation.module.scss'

function NavDropdownItem(props) {

    return (
        <a href={props.to} className={styles["menu-item"]} id ={props.id} key={props.id}>
            <span className={styles["icon-button"]}>
            {props.icon}
            </span>
                {props.children}
                <KeyboardArrowRightIcon/>
        </a>
    );
}

export default NavDropdownItem;
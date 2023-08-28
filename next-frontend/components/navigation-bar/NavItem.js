import {useState, useRef} from "react";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import NightlightIcon from "@mui/icons-material/Nightlight";
import styles from "./navigation.module.scss";
import {useTheme} from "next-themes";

function NavItem(props) {
    const [openDropdown, setOpenDropdown] = useState(false)

    const ref = useRef(null);
    const {theme, setTheme} = useTheme();


    // useEffect(() => {
    //
    //     function handleClickOutside(event) {
    //         if (!ref.current.contains(event.target)) {
    //             setOpenDropdown(false)
    //         }
    //     }
    //
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [ref]);

    const toggleDropdown = (e) => {
        setOpenDropdown(!openDropdown)
    }

    const toggleTheme = () => {
        const currentTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    }

    if (props.id === 'theme') {
        return (
            <a className={styles["icon-button"]}
               onClick={() => {
                toggleTheme()
            }}
               key={props.id}
            >
                {theme === 'light' ? <LightbulbIcon fontSize="large"/> : <NightlightIcon fontSize="large"/>}
                Theme
            </a>
        )
    } else {
        return (
            <li className={styles["nav-item"]} key={props.id}>
                <a href={props.to} className={styles["icon-button"]} onClick={(e) => {
                    toggleDropdown(e)
                }}
                   key={props.id}
                >
                    {props.icon}
                    {props.id}
                </a>
                <div ref={ref} key="dropdown">
                    {openDropdown && props.children}
                </div>
            </li>
        );
    }

}

export default NavItem;
import DropdownItem from './NavDropdownItem'
import {dropdownIconData} from "./NavItemData";
import styles from './navigation.module.scss'

function NavDropdown(props) {
    return (
      <div className={styles["nav-dropdown"]}>
          {
              dropdownIconData.map(function(item, i) {
                  if (item.id === 'profile') {
                      return (<DropdownItem key={item.id} to={props.profile_url} icon={item.icon} id={item.id}> {item.name} </DropdownItem>)
                  }
                  else {
                      return (<DropdownItem key={item.id} to={item.to} icon={item.icon} id={item.id}> {item.name} </DropdownItem>)
                  }
                  })
              }
      </div>
    );
}

export default NavDropdown;
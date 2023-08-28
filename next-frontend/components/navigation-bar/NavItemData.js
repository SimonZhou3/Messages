import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ForumIcon from "@mui/icons-material/Forum";
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';



export const itemIconData = [
    {
        id: "home",
        to: "/",
        icon: <HomeOutlinedIcon fontSize="large"/>,
        requiresAuthentication: false
    },
    {
        id: "search" ,
        to: "/search",
        icon: <SearchIcon  fontSize="large"/>,
        requiresAuthentication: true
},
    {
        id: "message",
        to: "/messages",
        icon: <ForumIcon  fontSize="large"/>,
        requiresAuthentication: true
    },
    {
        id: "theme",
        to: "",
    },
]

export const dropdownIconData = [
    {
        name: "Profile",
        id: "profile",
        to: "/profile",
        icon: <AccountCircleOutlinedIcon/>
    },
    {
        name: "Settings",
        id: "settings",
        to: "/settings",
        icon: <SettingsIcon/>
    },
    {
        name: "Sign Out",
        id: "signout",
        to: "/logout",
        icon: <ExitToAppIcon/>
    }
]
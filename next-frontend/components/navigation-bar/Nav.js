"use client";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Avatar} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import NavItem from './NavItem';
import NavDropdown from "./NavDropdown";
import {itemIconData} from "./NavItemData";
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import {getUser} from "../../middleware/Authenticator";
import Loading from "../../app/loading";
import {redirect} from "next/navigation";


function NavigationBar(props) {

    const [userAvatar, setUserAvatar] = useState(<></>)
    const [userProfile, setUserProfile] = useState('')

    useEffect(() => {
        const fetchUserAvatar = async () => {
            try {
                const userData = props.user.user_metadata;
                const avatar = (
                    <div>
                        <Avatar
                            src={userData.avatar ? userData.avatar : ''}
                            className={"avatar-icon-small"}
                            imgProps={{"className": "avatar-circular-img"}}
                            variant="circular"
                        />
                    </div>
                )
                setUserAvatar(avatar)
                setUserProfile(userData.username);
            } catch (err) {
            }
        }
        fetchUserAvatar();
    }, [props.loading])


    const {user, isLoading, error} = getUser();
    if (!user) {
        return (<></>)
    } else {
        return (
            <Navbar collapseOnSelect expand="lg" variant="dark" className="flex-row">
                <Container>
                    <Nav className="me-auto flex-row">
                        {
                            itemIconData.map(function (item) {
                                return (
                                    <NavItem key={item.id} to={item.to} icon={item.icon} id={item.id}
                                             theme={props.theme} toggleTheme={props.toggleTheme}/>
                                );
                            })
                        }
                    </Nav>
                    <Nav>
                        {(props.user && !props.loading) ?
                            <NavItem icon={userAvatar} key="avatar">
                                <NavDropdown key="dropdown" profile_url={"/" + userProfile}/>
                            </NavItem>
                            :
                            <Skeleton/>
                        }
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

export default React.memo(NavigationBar);
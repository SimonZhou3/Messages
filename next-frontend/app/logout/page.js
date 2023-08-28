"use client"

import {logOut} from "../../middleware/Authenticator";
import { useRouter } from 'next/navigation';

function App() {

    const navigate = useRouter();

    logOut().then(() => {
        navigate.push("/login")
    })

    return (
        <></>
    );
}

export default App;
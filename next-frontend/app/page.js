"use client";

import {motion} from "framer-motion";
import PostContainer from "../components/post/PostContainer";
import {getUser} from "../middleware/Authenticator";
import {redirect} from "next/navigation";
import Loading from "./loading";

function App() {

        const {user, isLoading, error} = getUser();
        if (isLoading) {
            return (<Loading/>)
        }

        if (!isLoading &&(!user || error)) {
            redirect('/login')
        } else {        return (
            <motion.div
                className="container"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <PostContainer/>
            </motion.div>
        );

    }
}

export default App


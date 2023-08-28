import {ThemeProvider} from "next-themes";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({Component, pageProps}) {
    return (
            <Component {...pageProps} />
    )
}

export default MyApp
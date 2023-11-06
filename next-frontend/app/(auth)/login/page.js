"use client";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFacebook, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {useRouter} from "next/navigation";
import styles from './login.module.scss';
import '../../global.scss';
import {logIn} from "../../../middleware/Authenticator";
import {useState} from "react";

function Login() {
    const initialValues = {email: "", password: ""};
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)

    const router = useRouter();

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormValues({...formValues, [name]: value})
        setFormErrors({})
    }

    const handleLogIn = async (e) => {
        e.preventDefault();
        const errors = {}
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!formValues.email) {
            errors.email = "Email Cannot be Empty"
        } else if (!String(formValues.email).match(regex)) {
            errors.email = "This email is Invalid"
        }
        if (!formValues.password) {
            errors.password = "Password Cannot be Empty"
        }
        setFormErrors(errors)
        if (Object.keys(errors).length === 0) {
            const email = document.getElementById("form1").value;
            const password = document.getElementById("form2").value;
            let query = {
                email: email,
                password: password,
            };
            try {
                const status = await logIn(query);
                console.log(status)
                if (status === 200) {
                    window.open('https://localhost:3000/', '_self');
                }
            } catch (e) {
                const error = {}
                error.password = Object.values(e)
                setFormErrors(error);
            }
        }
    }

    return (
        <div className={styles["login"]}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-2"/>
                    <div className={`col-lg-6 col-md-8 ${styles["login-box"]}`}>
                        <div className={`col-lg-12 ${styles["login-key"]}`}>
                            <i className="fa fa-key" aria-hidden="true"/>
                        </div>
                        <div className={`col-lg-12 ${styles["login-title"]}`}>
                            LOG IN
                        </div>
                        <div className={`col-lg-12 ${styles["login-form"]}`}>
                            <div className={`col-lg-12 ${styles["login-form"]}`}>
                                <form id="authentication-form">
                                    <div className={styles["form-group"]}>
                                        <label className={styles["form-control-label"]}>EMAIL</label>
                                        <input type="text" className={`${styles["form-control"]}  ${styles["authentication-email-input"]}`} id="form1" onChange={handleChange} name="email"/>
                                        <p className={styles["error-message"]}> {formErrors.email} </p>
                                    </div>
                                    <div className={styles["form-group"]}>
                                        <label className={`${styles["form-control-label"]}  ${styles["authentication-password-input"]}`}>PASSWORD</label>
                                        <input type="password" className={styles["form-control"]} id="form2" onChange={handleChange} name="password"/>
                                        <p className={styles["error-message"]}> {formErrors.password} </p>
                                    </div>
                                    <div className={`col-lg-12 ${styles["loginbttm"]} d-flex justify-content-center align-items-center`}>
                                        <div className={`col-lg-6 ${styles["login-btm"]} login-text`}/>
                                        <div className={`col-lg-6 login-btm ${styles["login-button"]}`}>
                                            <button type="submit"
                                                    className="btn btn-outline-primary align-items-end justify-content-center"
                                                    onClick={async (e) => handleLogIn(e)}>LOGIN
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <div className="text-center">
                                    <p className={styles["text-bottom-header"]}>
                                        or <a> log in here </a>
                                    </p>
                                    <p className={styles["text-subheader"]} onClick={() => {router.push('/register')}}>
                                        Don't have an account? Sign up
                                    </p>
                                </div>
                                <div
                                    className="container d-inline-flex justify-content-center align-content-center align-items-center">
                                    <div
                                        className="d-inline-flex justify-content-center align-content-center align-items-center">
                                        <div className={`${styles["loginButton"]} ${styles["facebook"]}`}>
                                            <button type="button" className="btn shadow-none" onClick={() => {
                                                window.open("https://localhost:8000/auth/facebook", "_self")
                                            }}>
                                                <FontAwesomeIcon icon={faFacebook} style={{color: "#0b3d93",}}
                                                                 size={"2xl"}
                                                />
                                            </button>
                                        </div>
                                        <div className={`${styles["loginButton"]} ${styles["google"]}`}>
                                            <button type="button" className="btn shadow-none"
                                                    onClick={() => window.open("https://localhost:8000/auth/google", "_self")}>
                                                <FontAwesomeIcon icon={faGoogle} style={{color: "#4285F4",}}
                                                                 size={"2xl"}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-2"/>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default Login;
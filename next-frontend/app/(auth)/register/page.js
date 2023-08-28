"use client";

import {signUp} from "../../../middleware/Authenticator"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {useState} from "react";
import styles from "../login/login.module.scss";

function App() {
    const initialValues = {email: "", password: "", firstName: "", lastName: ""};
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})


    const handleChange = (e) => {
        const {name, value} = e.target
        setFormValues({...formValues, [name]: value})
    }

    /* Client-side Validation pass. If Client-side validation passes, call login API to check if the email has been used for a different account.  */
    const handleSignUp = async (e) => {
        e.preventDefault();
        const errors = {}
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!formValues.email) {
            errors.email = "Email Cannot be Empty"
        } else if (!String(formValues.email).match(regex)) {
            errors.email = "This email is Invalid"
        }
        if (!formValues.firstName) {
            errors.firstName = "First Name Cannot be Empty"
        }
        if (!formValues.lastName) {
            errors.lastName = "Last Name Cannot be Empty"
        }
        if (!formValues.password) {
            errors.password = "Password Cannot be Empty"
        } else if (formValues.password.length < 8) {
            errors.password = "Password must be atleast 8 characters long"
        }
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            const email = document.getElementById("form1").value;
            const firstName = document.getElementById("form2").value;
            const lastName = document.getElementById("form3").value;
            const password = document.getElementById("form4").value;
            let query = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
            };
            try {
                const status = await signUp(query);
                if (status === 200) {
                    window.open('https://localhost:3000/', '_self');
                }
            } catch (e) {
                const error = {}
                error.email = Object.values(e)
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
                            SIGN UP
                        </div>
                        <div className={`col-lg-12 ${styles["login-form"]}`}>
                            <div className={`col-lg-12 ${styles["login-form"]}`}>
                                <form id="authentication-form">
                                    <div className={styles["form-group"]}>
                                        <label className={styles["form-control-label"]}>EMAIL</label>
                                        <input type="text" className={`${styles["form-control"]}`} id="form1" value={formValues.email}
                                               name="email"
                                               onChange={handleChange}/>
                                        <p className={styles["error-message"]}> {formErrors.email} </p>
                                    </div>
                                    <div className={styles["form-group"]}>
                                        <label className={`${styles["form-control-label"]}`}>FIRST NAME</label>

                                        <input type="text" className={`${styles["form-control"]}`} id="form2" name="firstName"
                                               value={formValues.firstName} onChange={handleChange}/>
                                        <p className={styles["error-message"]}>  {formErrors.firstName} </p>
                                    </div>
                                    <div className={styles["form-group"]}>
                                        <label className={`${styles["form-control-label"]}`}>LAST NAME</label>
                                        <input type="text" className={`${styles["form-control"]}`} id="form3" name="lastName"
                                               value={formValues.lastName} onChange={handleChange}/>
                                        <p className={styles["error-message"]}> {formErrors.lastName} </p>
                                    </div>
                                    <div className={styles["form-group"]}>
                                        <label className={`${styles["form-control-label"]}`}>PASSWORD</label>
                                        <input type="password" className={`${styles["form-control"]}`} id="form4" name="password"
                                               value={formValues.password} onChange={handleChange}/>
                                        <p className={styles["error-message"]}>  {formErrors.password} </p>
                                    </div>

                                    <div
                                        className={`col-lg-12 ${styles["loginbttm"]} d-flex justify-content-center align-items-center`}>
                                        <div className={`col-lg-6 ${styles["login-btm"]} ${styles["login-text"]}`}/>
                                        <div className={`col-lg-6 ${styles["login-btm"]} ${styles["login-button"]}`}>
                                            <button type="submit" onClick={async (e) => handleSignUp(e)}
                                                    className="btn btn-outline-primary align-items-end justify-content-center">
                                                SIGN UP
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <div className="text-center">
                                    <p className="text-white">
                                        or <a> sign up here </a>
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
                                                                 size={"2xl"}/>
                                            </button>
                                        </div>
                                        <div className={`${styles["loginButton"]} ${styles["google"]}`}>
                                            <button type="button" className="btn shadow-none"
                                                    onClick={() => window.open("https://localhost:8000/auth/google", "_self")}>
                                                <FontAwesomeIcon icon={faGoogle} style={{color: "#4285F4",}}
                                                                 size={"2xl"}
                                                                 hover/>
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
    );
}

export default App;
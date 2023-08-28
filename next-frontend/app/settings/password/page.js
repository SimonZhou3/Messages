'use client';

import styles from '../settings.module.scss'
import loginStyles from '../../(auth)/login/login.module.scss';

function App() {


    return (
        <div className={styles["fade-animation"]} id="password" role="tabpanel">
            <div className={`card ${styles["card-bg"]}`}>
                <div className="card-body">
                    <h5 className="card-title">Password</h5>
                    <form>
                        <div className={loginStyles["form-group"]}>
                            <label htmlFor="inputPasswordCurrent">Current password</label>
                            <input type="password" className={styles["form-control"]} id="form2" name="password"/>
                            <small><a href="#">Forgot your password?</a></small>
                        </div>
                        <div className={loginStyles["form-group"]}>
                            <label htmlFor="inputPasswordNew">New password</label>
                            <input type="password" className={styles["form-control"]} id="form2"  name="password"/>
                        </div>
                        <div className={loginStyles["form-group"]}>
                            <label htmlFor="inputPasswordNew2">Verify password</label>
                            <input type="password" className={styles["form-control"]} id="form2"  name="password"/>
                        </div>
                        <button type="submit" className="btn btn-primary">Save changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
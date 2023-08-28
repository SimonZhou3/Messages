import useSWR from "swr";
import {redirect} from "react-router";
import {Spinner} from "react-bootstrap";
import {useRouter} from "next/navigation";

export async function signUp(credentials) {
    let response = await fetch('https://localhost:8000/auth/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    console.log(response.status);
    if (response.status === 403) {
        throw {email: (await response.json()).message}
    } else {
        return response.status
    }
}

export async function logIn(credentials) {
    let response = await fetch('https://localhost:8000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(credentials)
    });
    if (response.status === 406) {
        throw {password: (await response.json()).message}
    } else {
        try {
            return response.status;
        } catch (e) {
            console.log(e)
        }
    }
}

export async function logOut() {
    const response = await fetch("https://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    console.log(response);
}

export async function retrieveUserData() {
    const response = await fetch("https://localhost:8000/users", {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
    const json = await response.json()
    if (response.status === 200) {
        return json.user;
    } else {
        throw new Error(json.message)
    }
}

export async function updateUserInformation(avatar_url, biography_text, location_text) {
    const body = {
        url: avatar_url,
        biography: biography_text,
        location: location_text
    }
    const response = await fetch("https://localhost:8000/users/metadata", {
        method: "PUT",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
    console.log('dfvkhjfvhjkxdfdl')
    if (response.status === 406) {
        throw new Error((await response.json()).message)
    }
return await response.json();
}


export async function updateUserCover(avatar_url) {
    const body = {
        url: avatar_url
    }
    const response = await fetch("https://localhost:8000/user/cover", {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
    if (response.status === 406) {
        throw new Error((await response.json()).message)
    }
}

export async function verifySelfProfile(user_id) {
    const response = await fetch(`https://localhost:8000/profile/self/${user_id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    return await response.json();
}

export function getUser() {
    const fetcher = (...args) => fetch(...args, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
        },
    }).then(res => res.json())
    const {data, error, isLoading} = useSWR(`https://localhost:8000/users`, fetcher, {})
    if (data?.statusCode) {
        return {
            user: null,
            isLoading,
            isError: error,
        }
    } else {
        return {
            user: data,
            isLoading,
            isError: error,
        }
    }
}

export function checkAuthenticatedRoute() {
    const {user, loading, error} = getUser();
    const router = useRouter();
    if (loading) {
        return (<Spinner/>)
    }
    if (!loading && (user || error)) {
        router.push('/login')
    } else {
        return user;
    }
}

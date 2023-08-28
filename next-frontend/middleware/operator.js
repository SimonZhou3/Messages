export async function sendMessage(messageData) {
    const response = await fetch(`https://localhost:8000/message`, {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData)
    })
   await response.json();
}

export async function getChats() {
    const response = await fetch(`https://localhost:8000/chat`, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    return await response.json();
}

export async function getContacts() {
    const response = await fetch(`https://localhost:8000/contact`, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    return (await response.json())
}

export async function getMessages(chatId, limit) {
    const response = await fetch(`https://localhost:8000/messages/${chatId}?limit=${limit}`, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    return (await response.json());
}
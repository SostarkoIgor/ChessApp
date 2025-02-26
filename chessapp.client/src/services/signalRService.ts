import * as signalR from "@microsoft/signalr";

const url=import.meta.env.VITE_SIGNALR_URL || "http://localhost:5000/chesshub"

const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build()

    let isStarting = false

    export const startConnection = async (): Promise<void> => {
        if (hubConnection.state !== signalR.HubConnectionState.Disconnected || isStarting) {
            console.warn("HubConnection is already started or in progress.");
            return;
        }
    
        isStarting = true;
        try {
            await hubConnection.start();
            console.log("SignalR Connected to", url);
        } catch (err) {
            console.error("Error connecting to SignalR", err);
            setTimeout(startConnection, 5000); // Retry after 5 seconds
        } finally {
            isStarting = false;
        }
    };

export const sendMessage = async (user: string, message: string): Promise<void> => {
    try {
        await hubConnection.invoke("SendMessage", user, message)
    } catch (err) {
        console.error("SendMessage Error:", err)
    }
}

export const onMessageReceived = (callback: (user: string, message: string) => void): void => {
    hubConnection.on("ReceiveMessage", callback)
}

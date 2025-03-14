import * as signalR from "@microsoft/signalr";

//const containing the URL of the SignalR Hub
const url=import.meta.env.VITE_SIGNALR_URL || "http://localhost:5000/chesshub"

//Creating the HubConnection
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build()

    
    //flag for checking if the connection is in progress, used to stop multiple start attempts
    let isStarting = false

    //Function for starting the connection
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

//Function for setting up the connection, we define callbacks for different events
export const setUpConnection = async (setGameCode: (code: string) => void, setPlayerJoined: (joined: boolean) => void, setWhiteTime: (time: number) => void, setBlackTime: (time: number) => void, setIncrement: (time:number)=>void, setColor: (color: string) => void, setStartGame: () => void): Promise<void> => {
    //gameCreated, we get the game code from the hub and set the state variable gameCode, player creating game gets this info
    hubConnection.on("GameCreated", (code) => {
        setGameCode(code)
    })

    //gameJoined, we get game info from the hub and set the state variables, player joining game with gamecode gets this info
    hubConnection.on("GameJoined", (white, black, increment, color) => {
        setWhiteTime(white)
        setBlackTime(black)
        setPlayerJoined(true)
        setIncrement(increment)
        setColor(color)
    })

    hubConnection.on("PlayerJoined", () => {
        setPlayerJoined(true)
        setStartGame()
    })
}

//function for creating game, we invoke the hub method
export const createGame = (timeWhite:number, timeBlack:number, increment:number, isGameCreatorWhite:boolean) => {
    if (hubConnection) {
        hubConnection.invoke("CreateGame", timeWhite, timeBlack, increment, isGameCreatorWhite)
    }
}

//function for joining game, we invoke the hub method
export const joinGame = (code : string) => {
    if (hubConnection) {
        hubConnection.invoke("JoinGame", code)
    }
}

export const sendMessage = async (gameCode: string, squareFrom: string, squareTo: string, promotion:boolean, promotionTo:string): Promise<void> => {
    try {
        await hubConnection.invoke("SendMessage", gameCode, squareFrom, squareTo, promotion, promotionTo)
    } catch (err) {
        console.error("SendMessage Error:", err)
    }
}

export const onMessageReceived = (callback: (squareFrom: string, squareTo: string, promotion: boolean, promotionTo: string) => void): void => {
    hubConnection.on("ReceiveMessage", callback)
}

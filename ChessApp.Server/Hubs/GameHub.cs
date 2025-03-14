using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChessApp.Server.Hubs
{
    public class GameHub : Hub
    {
        //dictionary that stores all the games, key is the code of the game, value is list of players, white and black start time, increment and color of player that created game
        private static ConcurrentDictionary<string, (List<string> players, int whiteTime, int blackTime, int increment, bool isGameCreatorWhite, bool isWhiteMove)> activeGames = new();

        /// <summary>
        /// function which comunicates moves players make. checks if expected player is making a move and sends the move to other player
        /// </summary>
        /// <param name="gameCode"></param>
        /// <param name="squareFrom"></param>
        /// <param name="squareTo"></param>
        /// <param name="promotion"></param>
        /// <param name="promotionTo"></param>
        /// <returns></returns>
        public async Task SendMessage(string gameCode, string squareFrom, string squareTo, bool promotion, string promotionTo)
        {
            if (activeGames.TryGetValue(gameCode, out var game) && game.players.Count == 2)
            {
                bool isCurrentPlayerWhite = (game.players[0] == Context.ConnectionId) == game.isGameCreatorWhite;


                if (isCurrentPlayerWhite == game.isWhiteMove)
                {
 
                    string opponentId = game.players[0] == Context.ConnectionId ? game.players[1] : game.players[0];
                    await Clients.Client(opponentId).SendAsync("ReceiveMessage", squareFrom, squareTo, promotion, promotionTo);


                    game.isWhiteMove = !game.isWhiteMove;
                    activeGames[gameCode] = game;
                }
            }
        }


        /// <summary>
        /// function for creating game, called by user on frontend, sends caller game code
        /// </summary>
        /// <param name="timeWhite">starting time of white player (ms)</param>
        /// <param name="timeBlack">starting time of black player (ms)</param>
        /// <param name="increment">increment (ms)</param>
        /// <param name="isGameCreatorWhite">true if player that created game is white</param>
        /// <returns></returns>
        public async Task CreateGame(int timeWhite, int timeBlack, int increment, bool isGameCreatorWhite)
        {
            string gameCode = GenerateGameCode();
            //after generating gamecode we create game by adding it to the dict
            activeGames[gameCode] = (new List<string> { Context.ConnectionId }, timeWhite, timeBlack, increment, isGameCreatorWhite, true);
            await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);//we add player to the group
            //game creator gets game code
            await Clients.Caller.SendAsync("GameCreated",gameCode);
        }
        /// <summary>
        /// function for generating game code
        /// </summary>
        /// <returns>string representing game code</returns>
        public static string GenerateGameCode()
        {
            return Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
        }
        /// <summary>
        /// function for joining created game
        /// </summary>
        /// <param name="gameCode">gamecode of game user wants to join</param>
        /// <returns></returns>
        public async Task JoinGame(string gameCode)
        {
            if (activeGames.TryGetValue(gameCode, out var game) && game.players.Count < 2)
            {
                game.players.Add(Context.ConnectionId);//we add player to the game
                await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);//we add player to the group
                await Clients.Caller.SendAsync("GameJoined", game.whiteTime, game.blackTime, game.increment, game.isGameCreatorWhite?"black":"white");//we give joined player game parameters
                await Clients.Group(gameCode).SendAsync("PlayerJoined", game.players);//we send all players of game notification that other player has joined
            }
            else //if game does not exist or already has 2 players
            {
                await Clients.Caller.SendAsync("JoinFailed", "Game not found or full");
            }
        }
    }
}

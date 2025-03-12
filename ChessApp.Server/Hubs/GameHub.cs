using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChessApp.Server.Hubs
{
    public class GameHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        private static ConcurrentDictionary<string, (List<string> players, int whiteTime, int blackTime, int increment)> activeGames = new();


        public async Task CreateGame(int timeWhite, int timeBlack, int increment)
        {
            string gameCode = GenerateGameCode();
            activeGames[gameCode] = (new List<string> { Context.ConnectionId }, timeWhite, timeBlack, increment);
            await Clients.Caller.SendAsync("GameCreated",gameCode);
        }
        public static string GenerateGameCode()
        {
            return Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
        }
        public async Task JoinGame(string gameCode)
        {
            if (activeGames.TryGetValue(gameCode, out var game) && game.players.Count < 2)
            {
                game.players.Add(Context.ConnectionId);
                await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
                await Clients.Caller.SendAsync("GameJoined", game.whiteTime, game.blackTime, game.increment);
                await Clients.Group(gameCode).SendAsync("PlayerJoined", Context.ConnectionId);
            }
            else
            {
                await Clients.Caller.SendAsync("JoinFailed", "Game not found or full");
            }
        }
    }
}

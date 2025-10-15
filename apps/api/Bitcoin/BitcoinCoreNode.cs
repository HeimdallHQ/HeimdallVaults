using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using NBitcoin;
using NBitcoin.RPC;

namespace api.Bitcoin;

public class BitcoinCoreNode : IBitcoinNode
{
    private readonly RPCClient _client;

    public BitcoinCoreNode(IOptions<BitcoinNodeOptions> options)
    {
        if (options is null)
        {
            throw new ArgumentNullException(nameof(options));
        }

        var config = options.Value ?? throw new ArgumentNullException(nameof(options));

        if (string.IsNullOrWhiteSpace(config.RpcUrl))
        {
            throw new ArgumentException("Bitcoin RPC URL is required.", nameof(options));
        }

        if (string.IsNullOrWhiteSpace(config.RpcUser) || string.IsNullOrWhiteSpace(config.RpcPassword))
        {
            throw new ArgumentException("Bitcoin RPC credentials are required.", nameof(options));
        }

        if (string.IsNullOrWhiteSpace(config.Network))
        {
            throw new ArgumentException("Bitcoin network is required.", nameof(options));
        }

        var credentials = new NetworkCredential(config.RpcUser, config.RpcPassword);
        var rpcUri = new Uri(config.RpcUrl);
        var networkName = config.Network.Trim();
        var network = Network.GetNetwork(networkName) ?? Network.GetNetwork(networkName.ToLowerInvariant());

        if (network is null)
        {
            throw new ArgumentException($"Unknown Bitcoin network '{config.Network}'.", nameof(options));
        }

        _client = new RPCClient(credentials, rpcUri, network);
    }

    public async Task<BitcoinBlockchainInfoResponse> GetInfoAsync(CancellationToken cancellationToken = default)
    {
        var request = new RPCRequest(RPCOperations.getblockchaininfo, Array.Empty<object>());
        var response = await _client.SendCommandAsync(request, cancellationToken).ConfigureAwait(false);
        response.ThrowIfError();

        var result = response.Result?.ToObject<BitcoinBlockchainInfoResponse>();

        if (result is null)
        {
            throw new InvalidOperationException("Bitcoin RPC getblockchaininfo returned no data.");
        }

        return result;
    }
}

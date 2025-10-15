using System.Threading;
using System.Threading.Tasks;

namespace api.Bitcoin;

public interface IBitcoinNode
{
    Task<BitcoinBlockchainInfoResponse> GetInfoAsync(CancellationToken cancellationToken = default);
}

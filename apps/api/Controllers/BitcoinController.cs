using System.Threading;
using System.Threading.Tasks;
using api.Bitcoin;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("bitcoin")]
public class BitcoinController : ControllerBase
{
    private readonly IBitcoinNode _bitcoinNode;

    public BitcoinController(IBitcoinNode bitcoinNode)
    {
        _bitcoinNode = bitcoinNode;
    }

    [HttpGet("info")]
    public async Task<ActionResult<BitcoinBlockchainInfoResponse>> GetInfo(CancellationToken cancellationToken)
    {
        var info = await _bitcoinNode.GetInfoAsync(cancellationToken).ConfigureAwait(false);
        return Ok(info);
    }
}

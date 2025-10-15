namespace api.Bitcoin;

public class BitcoinNodeOptions
{
    public string RpcUrl { get; init; } = string.Empty;
    public string RpcUser { get; init; } = string.Empty;
    public string RpcPassword { get; init; } = string.Empty;
    public string Network { get; init; } = string.Empty;
}

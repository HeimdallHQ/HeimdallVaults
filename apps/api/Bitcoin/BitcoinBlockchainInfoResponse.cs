using Newtonsoft.Json;

namespace api.Bitcoin;

public record BitcoinBlockchainInfoResponse(
    [property: JsonProperty("chain")] string Chain,
    [property: JsonProperty("blocks")] int Blocks,
    [property: JsonProperty("headers")] int Headers,
    [property: JsonProperty("bestblockhash")] string BestBlockHash,
    [property: JsonProperty("difficulty")] decimal Difficulty,
    [property: JsonProperty("time")] long Time,
    [property: JsonProperty("mediantime")] long MedianTime,
    [property: JsonProperty("verificationprogress")] decimal VerificationProgress,
    [property: JsonProperty("initialblockdownload")] bool InitialBlockDownload,
    [property: JsonProperty("chainwork")] string ChainWork,
    [property: JsonProperty("size_on_disk")] long SizeOnDisk,
    [property: JsonProperty("pruned")] bool Pruned,
    [property: JsonProperty("warnings")] string Warnings);

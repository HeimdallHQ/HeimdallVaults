using api.Bitcoin;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<BitcoinNodeOptions>(builder.Configuration.GetSection("Bitcoin"));
builder.Services.AddSingleton<IBitcoinNode, BitcoinCoreNode>();
builder.Services.AddControllers();

// Allow Next.js dev server
builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(p => p
        .WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();
app.UseCors();

app.MapControllers();
app.MapGet("/hello", () => Results.Json(new { message = "Hello World" }));
app.MapGet("/", () => "API up");

app.Run();

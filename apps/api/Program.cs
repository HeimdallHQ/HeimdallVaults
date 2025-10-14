var builder = WebApplication.CreateBuilder(args);

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

app.MapGet("/hello", () => Results.Json(new { message = "Hello World" }));
app.MapGet("/", () => "API up");

app.Urls.Clear();
app.Urls.Add("http://localhost:5050");
app.Run();
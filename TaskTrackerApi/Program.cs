// Program.cs
using TaskTrackerApi.Data;
using Microsoft.EntityFrameworkCore;
using TaskTrackerApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React app URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use the CORS policy
app.UseCors("AllowReactApp");


app.MapGet("/tasks", async (AppDbContext db) =>
    await db.Tasks
        .OrderBy(t => t.IsCompleted)
        .ThenBy(t => t.DueDate)
        .ToListAsync());

app.MapGet("/tasks/{id}", async (int id, AppDbContext db) =>
    await db.Tasks.FindAsync(id) is TaskItem task
        ? Results.Ok(task)
        : Results.NotFound());

app.MapPost("/tasks", async (CreateTaskDto dto, AppDbContext db) =>
{
    var task = new TaskItem
    {
        Title = dto.Title,
        Description = dto.Description,
        DueDate = dto.DueDate,
    };

    db.Tasks.Add(task);
    await db.SaveChangesAsync();

    return Results.Created($"/tasks/{task.Id}", task);
});

app.MapPut("/tasks/{id}", async (int id, UpdateTaskDto dto, AppDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();

    if (dto.Title is not null)
        task.Title = dto.Title;

    if (dto.Description is not null)
        task.Description = dto.Description;

    if (dto.IsCompleted is not null)
        task.IsCompleted = dto.IsCompleted.Value;

    if (dto.DueDate.HasValue)
        task.DueDate = dto.DueDate;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/tasks/{id}", async (int id, AppDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();

    db.Tasks.Remove(task);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();

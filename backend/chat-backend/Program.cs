using NLog;
using NLog.Web;
using Persistence;
using Shared.Misc;

namespace chat_backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var logger = LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();

            try
            {
                var builder = WebApplication.CreateBuilder(args);

                builder.Logging.ClearProviders();
                builder.Host.UseNLog();

                builder.Services.AddControllers();
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();

                builder.Services.AddSingleton<AppSettings>();

                builder.Services.AddPersistence(builder.Configuration);


                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("AllowReactApp",
                    builder => builder
                       .WithOrigins("http://localhost:3000")
                       .AllowAnyHeader()
                       .AllowAnyMethod());
                });

                var app = builder.Build();

                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

                app.UseHttpsRedirection();
                app.UseCors("AllowReactApp");
                app.MapControllers();

                app.Run();
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
            finally
            {
                LogManager.Shutdown();
            }
        }
    }
}

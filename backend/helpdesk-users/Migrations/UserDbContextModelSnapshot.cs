using System;
using helpdesk_users.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace helpdesk_users.Migrations;

[DbContext(typeof(UserDbContext))]
partial class UserDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "9.0.16")
            .HasAnnotation("Relational:MaxIdentifierLength", 63);

        NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

        modelBuilder.Entity("helpdesk_users.Entities.User", b =>
        {
            b.Property<Guid>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("uuid")
                .HasColumnName("id");

            b.Property<DateTime>("CreatedAt")
                .HasColumnType("timestamp with time zone")
                .HasColumnName("created_at");

            b.Property<string>("Email")
                .IsRequired()
                .HasColumnType("text")
                .HasColumnName("email");

            b.Property<string>("Password")
                .IsRequired()
                .HasColumnType("text")
                .HasColumnName("password");

            b.Property<string>("Role")
                .IsRequired()
                .HasColumnType("text")
                .HasColumnName("role");

            b.HasKey("Id");

            b.HasIndex("Email")
                .IsUnique();

            b.ToTable("users", (string)null);
        });
#pragma warning restore 612, 618
    }
}

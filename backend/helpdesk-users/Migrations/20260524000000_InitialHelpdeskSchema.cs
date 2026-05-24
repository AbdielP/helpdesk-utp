using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace helpdesk_users.Migrations;

public partial class InitialHelpdeskSchema : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            CREATE EXTENSION IF NOT EXISTS pgcrypto;

            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT users_role_check CHECK (role IN ('admin', 'user', 'support'))
            );

            CREATE TABLE IF NOT EXISTS tickets (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title TEXT NOT NULL,
                description TEXT,
                category TEXT,
                priority TEXT,
                status TEXT NOT NULL DEFAULT 'Abierto',
                created_by UUID NOT NULL,
                assigned_to UUID,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT tickets_priority_check CHECK (priority IS NULL OR priority IN ('low', 'medium', 'high')),
                CONSTRAINT fk_tickets_created_by
                    FOREIGN KEY (created_by)
                    REFERENCES users(id)
                    ON DELETE RESTRICT,
                CONSTRAINT fk_tickets_assigned_to
                    FOREIGN KEY (assigned_to)
                    REFERENCES users(id)
                    ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS ticket_history (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                ticket_id UUID NOT NULL,
                user_id UUID NOT NULL,
                action TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_ticket_history_ticket
                    FOREIGN KEY (ticket_id)
                    REFERENCES tickets(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_ticket_history_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                ticket_id UUID,
                type TEXT NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_notifications_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_notifications_ticket
                    FOREIGN KEY (ticket_id)
                    REFERENCES tickets(id)
                    ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON tickets(created_by);
            CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);
            CREATE INDEX IF NOT EXISTS idx_ticket_history_ticket_id ON ticket_history(ticket_id);
            CREATE INDEX IF NOT EXISTS idx_ticket_history_user_id ON ticket_history(user_id);
            CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
            CREATE INDEX IF NOT EXISTS idx_notifications_ticket_id ON notifications(ticket_id);
            CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "notifications");
        migrationBuilder.DropTable(name: "ticket_history");
        migrationBuilder.DropTable(name: "tickets");
        migrationBuilder.DropTable(name: "users");
    }
}

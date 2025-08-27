CREATE TABLE "todo_app_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "todo_app_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "verificationToken" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "verificationToken" CASCADE;--> statement-breakpoint
ALTER TABLE "todo_app_todos" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "todo_app_todos" ADD CONSTRAINT "todo_app_todos_user_id_todo_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."todo_app_users"("id") ON DELETE cascade ON UPDATE no action;
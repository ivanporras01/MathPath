CREATE TABLE `teacher_login_attempts` (
	`bucket_key` text PRIMARY KEY NOT NULL,
	`window_start` integer NOT NULL,
	`attempts` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `teacher_login_attempts_window` ON `teacher_login_attempts` (`window_start`);--> statement-breakpoint
CREATE TABLE `teacher_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`code_hash` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `teacher_sessions_expiry` ON `teacher_sessions` (`expires_at`);
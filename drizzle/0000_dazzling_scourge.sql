CREATE TABLE `progress` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`topic_id` text NOT NULL,
	`learned` integer DEFAULT 0 NOT NULL,
	`guided` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `progress_student_topic` ON `progress` (`student_id`,`topic_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`topic_id` text NOT NULL,
	`seed` integer NOT NULL,
	`level` integer NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`hint_used` integer DEFAULT 0 NOT NULL,
	`revealed` integer DEFAULT 0 NOT NULL,
	`correct` integer DEFAULT 0 NOT NULL,
	`independent` integer DEFAULT 0 NOT NULL,
	`last_answer` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `questions_student_topic` ON `questions` (`student_id`,`topic_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sessions_student` ON `sessions` (`student_id`);--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`name_key` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`grade` integer DEFAULT 6 NOT NULL,
	`current_topic` text,
	`current_stage` text DEFAULT 'explore' NOT NULL,
	`help_requested` integer DEFAULT 0 NOT NULL,
	`joined_at` integer NOT NULL,
	`last_seen` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_name_key_unique` ON `students` (`name_key`);
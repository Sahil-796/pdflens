CREATE UNIQUE INDEX "account_provider_account_unique" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
ALTER TABLE "context" ADD CONSTRAINT "context_pdf_id_unique" UNIQUE("pdf_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_polar_customer_id_unique" UNIQUE("polar_customer_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_polar_subscription_id_unique" UNIQUE("polar_subscription_id");
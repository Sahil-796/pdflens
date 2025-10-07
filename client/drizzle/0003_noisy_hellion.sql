ALTER TABLE "context" DROP CONSTRAINT "context_pdf_id_pdf_id_fk";
--> statement-breakpoint
ALTER TABLE "context" ADD CONSTRAINT "context_pdf_id_pdf_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdf"("id") ON DELETE cascade ON UPDATE no action;
-- Adjust FKs to cascade deletes for pdf.user_id and context.pdf_id
ALTER TABLE "context" DROP CONSTRAINT IF EXISTS "context_pdf_id_pdf_id_fk";
ALTER TABLE "pdf" DROP CONSTRAINT IF EXISTS "pdf_user_id_user_id_fk";

ALTER TABLE "pdf"
  ADD CONSTRAINT "pdf_user_id_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "context"
  ADD CONSTRAINT "context_pdf_id_pdf_id_fk"
  FOREIGN KEY ("pdf_id") REFERENCES "public"."pdf"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;


# Specification

## Summary
**Goal:** Add delete note functionality, a book upload form, and an "Open Note" option to the StudyHub application.

**Planned changes:**
- Add a "Delete Note" button on the Note Detail page with a confirmation dialog; on confirmation, call a backend `deleteNote` function to remove the note and redirect the user to the Browse Notes page
- Add a `deleteNote` function in `backend/main.mo` that accepts a note identifier and removes the matching record
- Add an "Upload Book" button on the Books page that reveals a form with fields: title, author, subject, description, access link (URL), and optional cover image URL; on submission, save the book via the backend `addBook` function and show a success message
- Add an "Open Note" button to each NoteCard and the Note Detail page; for notes with a PDF attachment, open the PDF in a new browser tab using a Base64 data URI; for text-only notes, navigate to the Note Detail page

**User-visible outcome:** Users can delete notes from the Note Detail page, upload new books via a form on the Books page, and open notes directly — PDFs open in a new browser tab while text notes display their full content on the detail page.

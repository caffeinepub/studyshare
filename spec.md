# Specification

## Summary
**Goal:** Replace the book upload form's URL-based fields with a PDF file upload, storing the PDF as Base64 in the backend and opening it inline from BookCard.

**Planned changes:**
- Remove the "Access Link (URL)" and "Cover Image URL" fields from the book upload form in BooksPage.tsx
- Add a PDF file upload input that reads the selected file as Base64 and displays the chosen filename
- Update the `useAddBook` mutation to send `pdfBase64` and `pdfFileName` instead of the removed URL fields
- Update the backend `Book` type in `main.mo` to include optional `pdfBase64: ?Text` and `pdfFileName: ?Text` fields and update the `addBook` function signature accordingly
- Replace the "Access Book" button in `BookCard.tsx` with an "Open Book" button that opens the stored PDF in a new browser tab using a Base64 data URI when `pdfBase64` is present
- Update backend migration if the Book state shape changes

**User-visible outcome:** Users can upload a PDF file when adding a book, and view it inline in a new browser tab by clicking "Open Book" on the BookCard.

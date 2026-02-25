import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Note structure
  type Note = {
    title : Text;
    subject : Text;
    description : Text;
    fileContent : Text;
    uploaderName : Text;
    uploadTimestamp : Time.Time;
    viewCount : Nat;
    pdfContent : ?Text;
    pdfFileName : ?Text;
  };

  // Important Note structure
  type ImportantNote = {
    title : Text;
    subject : Text;
    content : Text;
    featured : Bool;
    creationTimestamp : Time.Time;
  };

  // Updated Book structure
  type Book = {
    title : Text;
    author : Text;
    subject : Text;
    description : Text;
    pdfBase64 : ?Text;
    pdfFileName : ?Text;
  };

  module Note {
    public func compare(note1 : Note, note2 : Note) : Order.Order {
      Text.compare(note1.title, note2.title);
    };
  };

  module ImportantNote {
    public func compare(importantNote1 : ImportantNote, importantNote2 : ImportantNote) : Order.Order {
      Text.compare(importantNote1.title, importantNote2.title);
    };
  };

  module Book {
    public func compare(book1 : Book, book2 : Book) : Order.Order {
      Text.compare(book1.title, book2.title);
    };
  };

  let notes = Map.empty<Text, Note>();
  let importantNotes = Map.empty<Text, ImportantNote>();
  let books = Map.empty<Text, Book>();

  // Note functions
  public shared ({ caller }) func addNote(
    title : Text,
    subject : Text,
    description : Text,
    fileContent : Text,
    uploaderName : Text,
    pdfContent : ?Text,
    pdfFileName : ?Text,
  ) : async () {
    let note : Note = {
      title;
      subject;
      description;
      fileContent;
      uploaderName;
      uploadTimestamp = Time.now();
      viewCount = 0;
      pdfContent;
      pdfFileName;
    };
    notes.add(title, note);
  };

  public query ({ caller }) func getNote(title : Text) : async Note {
    switch (notes.get(title)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) { note };
    };
  };

  public shared ({ caller }) func deleteNote(title : Text) : async () {
    switch (notes.get(title)) {
      case (null) { Runtime.trap("Note not found, cannot delete") };
      case (_) {
        notes.remove(title);
      };
    };
  };

  public shared ({ caller }) func addViewCount(title : Text) : async () {
    switch (notes.get(title)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) {
        let updatedNote : Note = {
          note with
          viewCount = note.viewCount + 1;
        };
        notes.add(title, updatedNote);
      };
    };
  };

  public query ({ caller }) func getNotesBySubject(subject : Text) : async [Note] {
    notes.values().toArray().filter(func(note) { Text.equal(note.subject, subject) });
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    notes.values().toArray().sort();
  };

  // Important Notes functions
  public shared ({ caller }) func addImportantNote(title : Text, subject : Text, content : Text, featured : Bool) : async () {
    let importantNote : ImportantNote = {
      title;
      subject;
      content;
      featured;
      creationTimestamp = Time.now();
    };
    importantNotes.add(title, importantNote);
  };

  public query ({ caller }) func getImportantNote(title : Text) : async ImportantNote {
    switch (importantNotes.get(title)) {
      case (null) { Runtime.trap("Important note not found") };
      case (?importantNote) { importantNote };
    };
  };

  public query ({ caller }) func getFeaturedImportantNotes() : async [ImportantNote] {
    importantNotes.values().toArray().filter(func(importantNote) { importantNote.featured });
  };

  public query ({ caller }) func getAllImportantNotes() : async [ImportantNote] {
    importantNotes.values().toArray().sort();
  };

  // Updated Book functions
  public shared ({ caller }) func addBook(title : Text, author : Text, subject : Text, description : Text, pdfBase64 : ?Text, pdfFileName : ?Text) : async () {
    let book : Book = {
      title;
      author;
      subject;
      description;
      pdfBase64;
      pdfFileName;
    };
    books.add(title, book);
  };

  public query ({ caller }) func getBook(title : Text) : async Book {
    switch (books.get(title)) {
      case (null) { Runtime.trap("Book not found") };
      case (?book) { book };
    };
  };

  public query ({ caller }) func getAllBooks() : async [Book] {
    books.values().toArray().sort();
  };
};

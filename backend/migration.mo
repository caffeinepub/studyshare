import Map "mo:core/Map";

module {
  type Note = {
    title : Text;
    subject : Text;
    description : Text;
    fileContent : Text;
    uploaderName : Text;
    uploadTimestamp : Int;
    viewCount : Nat;
    pdfContent : ?Text;
    pdfFileName : ?Text;
  };

  type ImportantNote = {
    title : Text;
    subject : Text;
    content : Text;
    featured : Bool;
    creationTimestamp : Int;
  };

  type Book = {
    title : Text;
    author : Text;
    subject : Text;
    description : Text;
    coverImageUrl : ?Text;
    downloadLink : Text;
    important : Bool;
  };

  type Actor = {
    notes : Map.Map<Text, Note>;
    importantNotes : Map.Map<Text, ImportantNote>;
    books : Map.Map<Text, Book>;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};

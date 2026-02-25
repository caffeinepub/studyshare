import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  // Old actor types
  type OldBook = {
    title : Text;
    author : Text;
    subject : Text;
    description : Text;
    coverImageUrl : ?Text;
    downloadLink : Text;
    important : Bool;
  };

  type OldActor = {
    notes : Map.Map<Text, {
      title : Text;
      subject : Text;
      description : Text;
      fileContent : Text;
      uploaderName : Text;
      uploadTimestamp : Int;
      viewCount : Nat;
      pdfContent : ?Text;
      pdfFileName : ?Text;
    }>;
    importantNotes : Map.Map<Text, {
      title : Text;
      subject : Text;
      content : Text;
      featured : Bool;
      creationTimestamp : Int;
    }>;
    books : Map.Map<Text, OldBook>;
  };

  // New actor types
  type NewBook = {
    title : Text;
    author : Text;
    subject : Text;
    description : Text;
    pdfBase64 : ?Text;
    pdfFileName : ?Text;
  };

  type NewActor = {
    notes : Map.Map<Text, {
      title : Text;
      subject : Text;
      description : Text;
      fileContent : Text;
      uploaderName : Text;
      uploadTimestamp : Int;
      viewCount : Nat;
      pdfContent : ?Text;
      pdfFileName : ?Text;
    }>;
    importantNotes : Map.Map<Text, {
      title : Text;
      subject : Text;
      content : Text;
      featured : Bool;
      creationTimestamp : Int;
    }>;
    books : Map.Map<Text, NewBook>;
  };

  public func run(old : OldActor) : NewActor {
    let newBooks = old.books.map<Text, OldBook, NewBook>(
      func(_title, oldBook) {
        {
          oldBook with
          pdfBase64 = null;
          pdfFileName = null;
        };
      }
    );
    { old with books = newBooks };
  };
};

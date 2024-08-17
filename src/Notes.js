import { useContext, useRef } from "react";
import { NotesContext } from "./NotesContext";
import { EditorContext } from "./EditorContext";

export default function Notes({ toggle }) {
  const notes = useContext(NotesContext).notes;
  const setNotes = useContext(NotesContext).setNotes;
  const setCurrentNote = useContext(NotesContext).setCurrentNote;
  const generateNoteId = useContext(NotesContext).generateNoteId;
  const notesRef = useRef(null);
  const notesWidth = notesRef.current?.offsetWidth || 230;

  const tabs = useContext(EditorContext).tabs;
  const currentTabId = useContext(EditorContext).currentTabId;
  const setTabs = useContext(EditorContext).setTabs;
  const setCurrentTabId = useContext(EditorContext).setCurrentTabId;
  const doesTabExist = useContext(EditorContext).doesTabExist;
  const getTabIndexById = useContext(EditorContext).getTabIndexById;

  function selectNote(note) {
    setCurrentNote(note);
    setCurrentTabId(note.id);
    doesTabExist(note)
      ? setCurrentTabId(note.id)
      : setTabs((prev) => [
          ...prev,
          { title: note.title, note: note, id: note.id },
        ]);
  }

  function deleteNote(id) {
    const nextTab = tabs[getTabIndexById(currentTabId) + 1]
      ? tabs[getTabIndexById(currentTabId) + 1]
      : tabs[getTabIndexById(currentTabId) - 1]
      ? tabs[getTabIndexById(currentTabId) - 1]
      : null;

    setNotes((prev) => prev.filter((note) => note.id !== id));
    setTabs((prev) => prev.filter((tab) => tab.id !== id));

    localStorage.removeItem(`note${id}`);

    if (currentTabId === id && nextTab) {
      setCurrentTabId(nextTab.id);
      setCurrentNote(nextTab.note);
    }
  }

  function newNote() {
    const id = generateNoteId();
    const newNote = {
      title: "Untitled",
      text: "",
      id: id,
    };

    setNotes((prev) => [...prev, newNote]);
    setCurrentNote(newNote);

    setTabs((prev) => [...prev, { title: "Untitled", note: newNote, id: id }]);
    setCurrentTabId(id);
  }

  return (
    <div className={`notes${!toggle ? " collapsed" : ""}`} ref={notesRef}>
      {notes.map((note, key) => (
        <div
          key={key}
          className="note"
          date={note.date}
          onClick={() => selectNote(note)}
        >
          {note.title}
          <span
            className="xmark"
            onClick={(e) => {
              deleteNote(note.id);
              e.stopPropagation();
            }}
          ></span>
        </div>
      ))}
      {notes.length === 0 && (
        <p className="notes-empty-msg">You currently have no notes.</p>
      )}
      <div
        className="add-note"
        onClick={newNote}
        style={{
          left: `${notesWidth / 2}px`,
        }}
      >
        <span className="plus"></span>
      </div>
    </div>
  );
}

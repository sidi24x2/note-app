import { useState } from 'react';
import SingleNote from './SingleNote';

function Notes(props) {
  let { notes, handleDelete, toRefresh } = props;
  let [currentNote, setCurrentNote] = useState(null);

  return (
    <>
      {currentNote ? (
        <SingleNote
          note={currentNote}
          handleDelete={handleDelete}
          setCurrentNote={setCurrentNote}
          toRefresh={toRefresh}
        />
      ) : (
        ''
      )}
      <div className="notesContainer flex start">
        {notes.map((note) => (
          <div className="notes" key={note._id}>
            <div className="flex">
              <span>{note.createdAt.slice(0, 10)}</span>
              <span
                onClick={() => {
                  setCurrentNote(note);
                }}
              >
                {note.favorited ? (
                  <i className="fa-solid fa-star"></i>
                ) : (
                  <i className="fa-regular fa-star"></i>
                )}
              </span>
            </div>
            <h5 className="flex">{note.title.slice(0, 15)}...</h5>
            <p>{note.content.slice(0, 20)}...</p>
            <button
              onClick={() => {
                setCurrentNote(note);
              }}
            >
              Read More
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Notes;

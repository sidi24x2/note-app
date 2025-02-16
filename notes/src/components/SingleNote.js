import { useContext, useState } from 'react';
import Edit from './Edit';
import { notesURL } from '../constants/urls';
import UserContext from '../context/UserContext';

function SingleNote(props) {
  let userDetails = useContext(UserContext);
  let { note, setCurrentNote, toRefresh } = props;
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState(note.content);

  let handleCopy = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => alert('Copied!'))
      .catch((err) => console.error(err));
  };

  let editNote = () => {
    setEdit((prevValue) => !prevValue);
  };

  let handleFavorite = async (_id) => {
    try {
      let res = await fetch(`${notesURL}/${_id}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userDetails.user.token,
        },
      });
      let data = await res.json();

      if (!res.ok) throw data;

      toRefresh();

      setCurrentNote('');
    } catch (error) {
      console.error(error);
    }
  };

  let handleDelete = async (note, currentNote) => {
    try {
      console.log(note);

      let res = await fetch(`${notesURL}/${note._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: userDetails.user.token,
        },
      });

      let data = await res.json();

      currentNote(null);

      if (!res.ok) throw data;
    } catch (error) {
    } finally {
      toRefresh();
    }
  };
  return (
    <>
      <div class="singleNoteContainer flex center">
        <div className="note">
          <div className="flex">
            <span>{note.createdAt.slice(0, 10)}</span>
            <span>
              {note.favorited ? (
                <i
                  className="fa-solid fa-star"
                  onClick={() => handleFavorite(note._id)}
                ></i>
              ) : (
                <i
                  className="fa-regular fa-star"
                  onClick={() => handleFavorite(note._id)}
                ></i>
              )}
              <i
                class="fa-solid fa-xmark"
                onClick={() => setCurrentNote(null)}
              ></i>
            </span>
          </div>
          <h5>{note.title}</h5>
          <p>{note.content}</p>
          <div className="flex center">
            <span>
              <i className="fa-solid fa-copy" onClick={handleCopy}></i>
            </span>
            <span>
              <i
                className="fa-solid fa-trash"
                onClick={() => handleDelete(note, setCurrentNote)}
              ></i>{' '}
            </span>
            <span>
              <i
                className="fa-solid fa-edit"
                onClick={() => {
                  editNote(note);
                }}
              ></i>
            </span>
          </div>
        </div>
      </div>
      {edit && (
        <Edit
          editNote={editNote}
          note={note}
          toRefresh={toRefresh}
          setCurrentNote={setCurrentNote}
        />
      )}
    </>
  );
}

export default SingleNote;

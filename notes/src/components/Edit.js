import { useContext, useState } from 'react';
import { notesURL } from '../constants/urls';
import UserContext from '../context/UserContext';

function Edit(props) {
  let { editNote, note, toRefresh, setCurrentNote } = props;

  let userDetails = useContext(UserContext);

  let [errors, setErrors] = useState({});

  let [newNote, setNote] = useState({
    title: note.title,
    content: note.content,
  });

  let onChange = (e) => {
    let { name, value } = e.target;

    setNote((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    console.log(note);
    try {
      let res = await fetch(`${notesURL}/${note._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: userDetails.user.token,
        },
        body: JSON.stringify(newNote),
      });

      let data = await res.json();

      if (!res.ok) throw data;
      editNote();
      toRefresh();
      setCurrentNote(null);
    } catch (error) {
      setErrors({ edit: error.msg || error });
    }
  };
  return (
    <>
      <form action="" className="modalContainer flex center ">
        <fieldset className="modal editForm">
          <i class="fa-solid fa-xmark" onClick={() => editNote()}></i>
          <input
            type="text"
            name="title"
            placeholder="Enter Heading"
            onChange={onChange}
            value={newNote.title}
          />
          <textarea
            name="content"
            placeholder="Enter the content"
            rows={7}
            onChange={onChange}
            value={newNote.content}
          ></textarea>
          <button onClick={handleSubmit}>Save</button>
          {errors.edit && <p>{errors.edit}</p>}
        </fieldset>
      </form>
    </>
  );
}

export default Edit;

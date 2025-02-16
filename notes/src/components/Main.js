import { useContext, useEffect, useRef, useState } from 'react';
import Note from './Note';
import UserContext from '../context/UserContext';

import Notes from './Notes';
import Loader from './Loader';

function Main(props) {
  let [note, setNote] = useState(false);
  let [notes, setNotes] = useState([]);
  let [, setErrors] = useState({});
  let [loading, setLoading] = useState(true);
  let [refresh, setRefresh] = useState(false);
  let { url } = props;

  const originalNotesRef = useRef([]);

  let userDetails = useContext(UserContext);

  let writeNote = () => {
    setNote((prevValue) => !prevValue);
  };

  let toRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  useEffect(() => {
    let fetchedData = async () => {
      try {
        setLoading(true);
        let res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: userDetails.user.token || '',
          },
        });

        let data = await res.json();

        if (!res.ok) {
          setNotes([]);
          throw data;
        }
        originalNotesRef.current = [...data];
        setNotes(data);
      } catch (error) {
        setErrors({ fetch: error.msg || error });
      } finally {
        setLoading(false);
      }
    };
    fetchedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note, refresh, url]);

  let handleSort = (e) => {
    let updatedNotes = [...notes];
    let { value } = e.target;

    if (value === 'old') {
      updatedNotes = updatedNotes.sort(
        (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
      );
      setNotes(updatedNotes);
    }

    if (value === 'new') {
      updatedNotes = updatedNotes.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setNotes(updatedNotes);
    }
  };

  let handleSearch = (e) => {
    let { value } = e.target;
    let allNotes = originalNotesRef.current;

    if (!value) return setNotes(allNotes);
    let updatedNotes = allNotes.filter((note) =>
      note.title.toLowerCase().includes(value)
    );

    setNotes(updatedNotes);
  };
  if (userDetails.user === null) return <h2>Log In First</h2>;

  if (loading) return <Loader />;
  return (
    <>
      {note && <Note writeNote={writeNote} notes />}

      {loading && <h2>Loading...</h2>}

      <section className="main container">
        <div className="searchBar flex ">
          <input
            type="text"
            name="search"
            placeholder="Search"
            onChange={handleSearch}
          />
          <select name="sort" onChange={handleSort}>
            <option hidden>Sort</option>
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>
        </div>

        {/* {errors.fetch && (
          <h2>{errors.fetch.message || errors.fetch.msg || ''}</h2>
        )} */}

        <Notes notes={notes} toRefresh={toRefresh} />

        <div className="notesInput">
          <center>
            <div className="flex">
              <div className="flex start">
                <span>
                  <i className="fa-solid fa-pen" onClick={writeNote}></i>
                </span>
                {/* <span>
                  <i className="fa-solid fa-image"></i>
                </span> */}
              </div>
              <button onClick={writeNote}> Create Note 🗒️</button>
            </div>
          </center>
        </div>
      </section>
    </>
  );
}

export default Main;

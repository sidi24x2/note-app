import { useContext, useState } from 'react';
import { notesURL } from '../constants/urls';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function Note(props) {
  let { writeNote } = props;

  let userDetails = useContext(UserContext);
  let navigate = useNavigate();

  const [note, setNote] = useState({
    title: '',
    content: '',
  });

  const [errors, setErrors] = useState({});
  const [isRecording, setIsRecording] = useState(false); // Track recording state
  const [recognition, setRecognition] = useState(null); // Store recognition instance

  // Initialize SpeechRecognition if available
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition && !recognition) {
    const recog = new SpeechRecognition();
    recog.continuous = true; // Keep recording until stopped
    recog.lang = 'en-US'; // Set language to English
    recog.interimResults = false; // Only final results are returned
    recog.maxAlternatives = 1; // Only the best result

    // Set up recognition events
    recog.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setNote((prevNote) => ({
        ...prevNote,
        content: transcript, // Update content with transcribed text
      }));
    };

    recog.onerror = (event) => {
      console.error('Speech Recognition Error: ', event.error);
    };

    recog.onend = () => {
      setIsRecording(false); // Stop recording when recognition ends
    };

    setRecognition(recog); // Save the recognition instance
  }

  // Start or stop recording based on current state
  const onRecord = (e) => {
    e.preventDefault();

    if (isRecording) {
      recognition.stop(); // Stop the speech recognition
    } else {
      recognition.start(); // Start the speech recognition
    }

    setIsRecording((prevState) => !prevState); // Toggle recording state
  };

  // Handle input change for title and content
  const onChange = (e) => {
    const { name, value } = e.target;

    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  // Submit the note to the server
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let res = await fetch(`${notesURL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userDetails.user.token,
        },
        body: JSON.stringify(note),
      });
      let data = await res.json();

      if (!res.ok) throw data;

      navigate('/');
      writeNote();
    } catch (error) {
      setErrors({ note: error.msg || error });
    }
  };

  return (
    <>
      <form className="modalContainer flex center">
        <fieldset className="modal">
          <i className="fa-solid fa-xmark" onClick={() => writeNote()}></i>
          <span></span>

          <input
            type="text"
            name="title"
            placeholder="Enter the Title"
            onChange={onChange}
            value={note.title}
          />
          <textarea
            name="content"
            placeholder="Enter your Note"
            rows={7}
            onChange={onChange}
            value={note.content}
          ></textarea>

          <div className="flex">
            <button onClick={onRecord}>
              {isRecording ? '🛑 Stop Recording' : '🔴 Start Recording'}
            </button>

            <button onClick={onSubmit}>Add Note</button>
          </div>

          {errors.note && <p>{errors.note}</p>}
        </fieldset>
      </form>
    </>
  );
}

export default Note;

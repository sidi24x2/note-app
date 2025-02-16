import { useState } from 'react';
import { registerURL } from '../constants/urls';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function onChange(e) {
    let { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      let res = await fetch(registerURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data = await res.json();
      if (!res.ok) throw data;
      alert('registered');
      navigate('/login');
    } catch (error) {
      setErrors({ register: error.msg || error });
    }
  }
  return (
    <>
      <form action="" className="loggingIn flex center">
        <fieldset>
          <legend>SignUp Form</legend>
          <input
            type="text"
            name="username"
            placeholder="Enter Your Username"
            onChange={onChange}
            value={formData.username}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your mail"
            onChange={onChange}
            value={formData.email}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            onChange={onChange}
            value={formData.password}
          />
          <button onClick={onSubmit}>Sign Up</button>
          {errors.register && <p>{errors.register}</p>}
        </fieldset>
      </form>
    </>
  );
}

export default SignUp;

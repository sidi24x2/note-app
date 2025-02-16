import { useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { loginURL } from '../constants/urls';

function Login() {
  let userDetails = useContext(UserContext);
  let navigate = useNavigate();
  let [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  function onChange(e) {
    let { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }
  let onSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(loginURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data = await res.json();

      if (!res.ok) throw data;

      userDetails.logUser(data);
      navigate('/');
    } catch (error) {
      setErrors({ login: error.msg || error });
    }
  };
  return (
    <>
      <form action="" className="loggingIn flex center">
        <fieldset>
          <legend>Login Form</legend>

          <input
            type="text"
            name="email"
            placeholder="Enter Your Email"
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
          <button onClick={onSubmit}>Login</button>
          {errors.login && <p>{errors.login}</p>}
        </fieldset>
      </form>
    </>
  );
}

export default Login;

import './Input.scss';

function Input({ label, type, customClass, name, handleChange, defaultValue, disabled }) {
  const inputId = `input-${name}`;

  return (
    <section className='input'>
      <label className='input__label' htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type={type}
        className={`input__field ${customClass ? customClass : ''}`}
        name={name}
        onChange={handleChange}
        defaultValue={defaultValue ? defaultValue : ''}
        disabled={disabled}
      />
    </section>
  );
}

export default Input;
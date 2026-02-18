import './FieldInputEditor.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function FieldInputEditor({ statusField, setStatusField, object, setObject }) {
  const[state, setState]=useState({input: object[statusField.field_edit]});
  const[typeField, setTypeField]=useState(statusField.field_edit !== 'email' && statusField.field_edit !== 'password' ? 'text' : statusField.field_edit);
  const[passViewIcon, setPassViewIcon]=useState(<FontAwesomeIcon icon="eye" />);

  const handleState = (e) => {
    let {name, value} = e.target;
    switch (name) {
      default:
        setState((prevState) => ({...prevState, [name]: value}));       
    }
  }

  const handlePassView = (e) => {
    e.stopPropagation()
      if(typeField === 'password') {
        setTypeField('text')
        setPassViewIcon(<FontAwesomeIcon icon="fa-eye-slash" />)
      } else {
        setTypeField('password')
        setPassViewIcon(<FontAwesomeIcon icon="fa-eye"  />)
      }
  }

  const handleSave = (e) => {
    e.stopPropagation()
    const name = statusField.field_edit
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      switch(name) {
      case 'first_name':
        pattern = /^(?=.{2,20}$)[A-Za-zА-Яа-я]+$/          
        if(pattern.test(state.input)) {
          setObject(() => ({...object, [name]: state.input}))
        }        
        break
      case 'last_name':
        pattern = /^(?=.{2,20}$)[A-Za-zА-Яа-я]+$/         
        if(pattern.test(state.input) || state.input.length === 0) {
          setObject(() => ({...object, [name]: state.input}))
        }        
        break
      case 'email':
        if(pattern.test(state.input)) {
          setObject(() => ({...object, [name]: state.input}))
        }
        break
      case 'password':
        if(state.input.length > 5) {
          setObject(() => ({...object, [name]: state.input}))
        }
        break
      case 'file_name':
        pattern = /^[0-9a-zA-Zа-яА-Я_\-. ]+$/          
        if(pattern.test(state.input) && state.input.length > 0 && state.input.length < 256) {
          setObject(() => ({...object, [name]: state.input}))
        }
        break
      default:
        if(name.includes('comment')) {
          if(state.input.length < 256) {
            setObject(() => ({...object, [name]: state.input}))
          }
        } else {
          setObject(() => ({...object, [name]: state.input}))
        }
    }
    setStatusField({...statusField, 'status_edit': false, 'field_edit': ''})
  }

  const handleClose = (e) => {
    e.stopPropagation()
    setStatusField({...statusField, 'status_edit': false, 'field_edit': ''})
  }
  
  return (
    <div className="field-input__box">
      <input className='field-input-text' type={typeField} value={state.input} id="input" name="input" style={statusField.field_edit === 'password' ? {paddingRight: "3rem"} : {}} onInput={handleState} onClick={(e) => e.stopPropagation()} required autoFocus />
      {statusField.field_edit === 'password' ? <span className='field-input-pass-view' onClick={handlePassView}>{passViewIcon}</span> : ''}
      <span className='field-input-save' onClick={handleSave}>&#128190;</span>
      <span className='field-input-close' onClick={handleClose}>&#10060;</span>
    </div>
  )
}

export default FieldInputEditor;
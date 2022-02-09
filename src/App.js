import React, { useState, useEffect } from 'react'
import axiosService from './axiosService'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [phoneNumber, setNewphoneNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const hook = () => {
    axiosService.getAll().then(response => {
      setPersons(response.data)
    })
  }
  useEffect(hook, [])
  const changeFilter = (event) => {
    setFilter(event.target.value)
  }
  const handleNameChange = (event) => {

    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewphoneNumber(event.target.value)
  }
  const handleMessageChange = (msg) => {
    setMessage(msg)
    setTimeout(() => { setMessage('') }, 3000)
  }
  const deletePerson = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      handleMessageChange(`${name} deleted.`)
      axiosService.destroy(id).then(() => {

        axiosService.getAll().then(response => {
          setPersons(response.data) 

        })
      })
    } else {
      return
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={message} />
      <Filter filter={[{ filter, changeFilter }]} />

      <h3>Add a new</h3>
      <PersonForm form={[{ newName, handleNameChange }, { phoneNumber, handleNumberChange }, { persons, setPersons }, { message, handleMessageChange }]} />

      <h3>Numbers</h3>
      <Persons persons={[persons, filter, deletePerson]} />
    </div>
  )

}



const Filter = (props) => {
  return (
    <div>
      <h2>Filter numbers</h2>
      <input value={props.filter[0].filter} onChange={props.filter[0].changeFilter} />
    </div>
  )


}
const PersonForm = (props) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      let name = props.form[0].newName
      let number = props.form[1].phoneNumber
      let updated = false
      if (number === '') {
        number = 'No number given'
      }
      let id = props.form[2].persons.length
      if (id === undefined) {
        id = 1
      } else {
        for (let i = 0; i < props.form[2].persons.length; i++) {
          if (props.form[2].persons[i].name.toUpperCase().includes(name.toUpperCase())) {
            if (window.confirm(`${name} is already on the list, do you want to update old number with a new one?`)) {
              updated = true
              axiosService.update(i , { name: name, number: number , id: props.form[2].persons[i].id}).then(() => {
                props.form[3].handleMessageChange(`${name} updated`)
                axiosService.getAll().then(response => {
                  props.form[2].setPersons(response.data)
                })
              }
              )
              break
            }
          }
        }
      }
      if (!updated) {
        props.form[2].setPersons(props.form[2].persons.concat({ name: name, number: number , id: NaN}))
        axiosService.create({ name: name, number: number , id: NaN})
          .then(() => {
            props.form[3].handleMessageChange(`${name} added`)
            axiosService.getAll().then(response => {
              props.form[2].setPersons(response.data)
            })
          })
      }

    }}>
      <div>
        name: <input value={props.form[0].newName} onChange={props.form[0].handleNameChange} />
        <br></br>
        <br></br>
        phone number: <input value={props.form[1].phoneNumber} onChange={props.form[1].handleNumberChange} />
        <br></br>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}
const Persons = (props) => {
  let filttered = []
  let filter = props.persons[1].toUpperCase()
  if (filter !== '') {
    for (let i = 0; i < props.persons[0].length; i++) {
      let person = props.persons[0][i].name.toUpperCase()
      if (person.includes(filter)) {
        filttered.push(props.persons[0][i])
      }
    }
    return (
      <div>
        {filttered.map(person => <p key={person.name}>Name: {person.name} <br></br>Number: {person.number} <button onClick={() => { props.persons[2](person.id, person.name) }}>delete</button></p>)}
      </div>
    )
  } else {
    return (
      <div>
        {props.persons[0].map(person => <p key={person.name}>Name: {person.name} <br></br>Number: {person.number} <button onClick={() => { props.persons[2](person.id, person.name) }}>delete</button></p>)}

      </div>
    )
  }
}
const Notification = (message) => {
  const notificationStyle = {
    color: 'green',
    fontSize: 20,
    border: '4px solid green',
    borderRadius: '10px',
    background: '#d3ffce'

  }
  const messageStyle = {
    padding: '5px'
  }
  if (message.notification === '') {
    return (
      <div className='notification'>
        <br></br>
      </div>
    )
  }
  return (
    <div className='notification' style={notificationStyle}>
      <p style={messageStyle}>{message.notification}</p>
    </div>
  )

}




export default App
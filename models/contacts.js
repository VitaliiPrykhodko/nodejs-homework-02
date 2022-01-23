const fs = require('fs').promises
const path = require('path')
const shortid = require('shortid');

const contactsPath = path.join(__dirname, "contacts.json")

async function listContacts() {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)
    return contacts
}

async function getContactById(id) {
    const contacts = await listContacts()
    const result = contacts.find((contact) => contact.id === id)
    if (!result) {
        return null
    }
    return result
}

async function addContact(name, email, phone) {
    const data = {id: shortid.generate(), name, email, phone }
    const contacts = await listContacts();
    contacts.push(data)
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return data
}

async function removeContact(id) {
    const contacts = await listContacts();
    const idx = contacts.findIndex((item) => item.id === id)
    if (idx === -1) {
        return null
    }
    const deleteContact = contacts[idx]
    contacts.splice(idx, 1)
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return deleteContact
}

async function updateContact(id, name, email, phone) {
    const contacts = await listContacts();
   const idx = contacts.findIndex((item) => item.id === id)
    if (idx === -1) {
        return null
  }
  contacts[idx] = {id, name, email, phone}
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return contacts[idx]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

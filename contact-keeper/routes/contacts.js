const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');

//CRUD Routing - Create Read Update Delete

//@route  GET api/contacts
//@desc   Get all User contacts
//@access Private - have to be logged in to add a contact or deal with
router.get('/', auth, async(req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        res.json(contacts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route  POST api/contacts
//@desc   Add new contact
//@access Private - have to be logged in to add a contact or deal with
router.post('/', [auth, [
        check('name', 'Name is required')
        .not()
        .isEmpty()
    ]],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, password, type } = req.body;

        try {
            const newContact = new Contact({
                name,
                email,
                phone,
                password,
                type,
                user: req.user.id
            });
            const contact = await newContact.save();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');

        }
    }
);


//@route  PUT api/contacts/:id
//@desc   update contact
//@access Private 
router.put('/:id', auth, async(req, res) => {
    const { name, email, phone, type } = req.body;

    //Build contact object
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'contact not found' });

        //Ensure user owns contact i.e. compare user from the token
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, { $set: contactFields }, { new: true });

        res.json(contact)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

//@route  DELETE api/contacts/:id
//@desc   Delete contact
//@access Private 
router.delete('/:id', auth, async(req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'contact not found' });

        //Ensure user owns contact i.e. compare user from the token
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Contact.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Contact Removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});


module.exports = router;
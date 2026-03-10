const Apartment = require('../models/Apartment');

exports.createApartment = async (req, res) => {
  try {
    const apartment = new Apartment(req.body);
    await apartment.save();
    res.status(201).json(apartment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ error: 'Apartment not found' });
    res.json(apartment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!apartment) return res.status(404).json({ error: 'Apartment not found' });
    res.json(apartment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    if (!apartment) return res.status(404).json({ error: 'Apartment not found' });
    res.json({ message: 'Apartment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

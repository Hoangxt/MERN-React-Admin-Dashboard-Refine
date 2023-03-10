import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperties = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    propertyType = "",
  } = req.query;

  const query = {};

  if (propertyType !== "") {
    // if propertyType is not empty
    query.propertyType = propertyType; // add propertyType to query
  }

  if (title_like) {
    // if title_like is not empty
    query.title = { $regex: title_like, $options: "i" }; // add title to query
  }

  try {
    // count all properties
    const count = await Property.countDocuments({ query });
    // find properties with query
    const properties = await Property.find(query)
      .limit(_end) // limit the number of properties
      .skip(_start) // skip the number of properties
      .sort({ [_sort]: _order }); // sort the properties

    res.header("x-total-count", count); // set the total number of properties
    // expose the total number of properties
    res.header("Access-Control-Expose-Headers", "x-total-count");
    // return the properties
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyDetail = async (req, res) => {
  const { id } = req.params; // get the id from the url
  const propertyExists = await Property.findOne({ _id: id }).populate(
    // find the property with the id
    "creator" // populate the creator field
  );
  if (propertyExists) {
    // if the property exists
    res.status(200).json(propertyExists);
  } else {
    res.status(404).json({ message: "Property not found" });
  }
};

const createProperty = async (req, res) => {
  try {
    const { title, description, propertyType, location, price, photo, email } =
      req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newProperty = await Property.create({
      title,
      description,
      propertyType,
      location,
      price,
      photo: photoUrl.url,
      creator: user._id,
    });

    user.allProperties.push(newProperty._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Property created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params; // id name of the property to update
    const { title, description, propertyType, location, price, photo } =
      req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);

    await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        location,
        price,
        photo: photoUrl.url || photo,
      }
    );

    res.status(200).json({ message: "Property updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyToDelete = await Property.findById({ _id: id }).populate(
      "creator"
    );

    if (!propertyToDelete) throw new Error("Property not found");

    const session = await mongoose.startSession(); // start a session
    session.startTransaction(); // start a transaction

    propertyToDelete.remove({ session }); // remove the property

    propertyToDelete.creator.allProperties.pull(propertyToDelete); // remove the property from the creator's allProperties array

    await propertyToDelete.creator.save({ session }); // save the creator
    await session.commitTransaction(); // commit the transaction

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
};

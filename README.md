# MongoDB CRUD Operations

This document provides a comprehensive guide to the CRUD (Create, Read, Update, Delete) operations in MongoDB, along with their associated methods.

---

## Table of Contents
- [Create (Insert Data)](#create-insert-data)
- [Read (Retrieve Data)](#read-retrieve-data)
- [Update (Modify Data)](#update-modify-data)
- [Delete (Remove Data)](#delete-remove-data)
- [Bulk Operations](#bulk-operations)

---

## Create (Insert Data)

Methods for adding new documents to a collection:

- **`insertOne()`**: Inserts a single document.
- **`insertMany()`**: Inserts multiple documents.
- **`save()`**: Saves a document (creates if it doesn’t exist, updates if it does). *(Mongoose-specific)*

---

## Read (Retrieve Data)

Methods for querying or fetching documents from a collection:

- **`find()`**: Retrieves multiple documents matching the query.
- **`findOne()`**: Retrieves the first document that matches the query.
- **`findById()`**: Retrieves a document by its unique `_id`. *(Mongoose-specific)*

---

## Update (Modify Data)

Methods for modifying existing documents in a collection:

- **`updateOne()`**: Updates the first document that matches the query.
- **`updateMany()`**: Updates all documents that match the query.
- **`findOneAndUpdate()`**: Finds a document, updates it, and optionally returns the updated document.
- **`findByIdAndUpdate()`**: Updates a document by its `_id` and returns the updated document. *(Mongoose-specific)*
- **`replaceOne()`**: Replaces the entire document with a new one.
- **`save()`**: Updates an existing document or creates it if it doesn’t exist. *(Mongoose-specific)*

---

## Delete (Remove Data)

Methods for removing documents from a collection:

- **`deleteOne()`**: Deletes the first document that matches the query.
- **`deleteMany()`**: Deletes all documents that match the query.
- **`findOneAndDelete()`**: Finds a document, deletes it, and returns the deleted document.
- **`findByIdAndDelete()`**: Deletes a document by its `_id` and returns the deleted document. *(Mongoose-specific)*

---

## Bulk Operations

Methods for batch processing of multiple operations in a single request:

- **`bulkWrite()`**: Performs multiple `insert`, `update`, or `delete` operations in bulk.

---

## Summary Table

| **CRUD Operation** | **Core Methods**                         | **Additional Methods**                      |
|---------------------|------------------------------------------|---------------------------------------------|
| **Create**          | `insertOne`, `insertMany`               | `save`, `bulkWrite` (for insert operations) |
| **Read**            | `find`, `findOne`, `findById`           | -                                           |
| **Update**          | `updateOne`, `updateMany`, `replaceOne` | `findOneAndUpdate`, `findByIdAndUpdate`, `save`, `bulkWrite` |
| **Delete**          | `deleteOne`, `deleteMany`               | `findOneAndDelete`, `findByIdAndDelete`, `bulkWrite` |

---

## License

This guide is open-source and can be used for educational purposes. Contributions and suggestions are welcome!


# API Specification: FileUploading Concept

**Purpose:** To manage the lifecycle and metadata of user-owned files stored in an external cloud service.

---

## API Endpoints

### POST /api/FileUploading/requestUploadURL

**Description:** Creates a new file record and generates a presigned URL for uploading the file to cloud storage.

**Requirements:**
- true

**Effects:**
- Creates a new File `f` with status `pending`, owner `owner`, and filename `filename`; generates a unique `storagePath` for `f`; generates a presigned GCS upload URL corresponding to that path; returns the new file's ID and the URL.

**Request Body:**
```json
{
  "owner": "ID",
  "filename": "string"
}
```

**Success Response Body (Action):**
```json
{
  "file": "ID",
  "uploadURL": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/FileUploading/confirmUpload

**Description:** Confirms that a file has been successfully uploaded, changing its status from "pending" to "uploaded".

**Requirements:**
- A File `f` exists and its status is "pending".
- OR no File `f` exists or its status is not "pending" (error case).

**Effects:**
- Sets the status of `f` to "uploaded".
- OR returns an error message if conditions are not met.

**Request Body:**
```json
{
  "file": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "file": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/FileUploading/delete

**Description:** Deletes a file record from the database and removes the corresponding file from cloud storage.

**Requirements:**
- The given `file` exists.

**Effects:**
- Removes the file record `f` from the state. Additionally, it triggers the deletion of the corresponding object from the external GCS bucket.

**Request Body:**
```json
{
  "file": "ID"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/FileUploading/_getOwner

**Description:** Query that retrieves the owner of a file.

**Requirements:**
- The given `file` exists.

**Effects:**
- Returns the owner of the file.

**Request Body:**
```json
{
  "file": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "owner": "ID"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/FileUploading/_getFilename

**Description:** Query that retrieves the filename of a file.

**Requirements:**
- The given `file` exists.

**Effects:**
- Returns the filename of the file.

**Request Body:**
```json
{
  "file": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "filename": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/FileUploading/_getDownloadURL

**Description:** Query that generates a presigned download URL for an uploaded file.

**Requirements:**
- The given `file` exists and its status is "uploaded".

**Effects:**
- Generates a short-lived, presigned GCS download URL for the file `f` and returns it.

**Request Body:**
```json
{
  "file": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "downloadURL": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/FileUploading/_getFilesByOwner

**Description:** Query that retrieves all uploaded files owned by a user along with their filenames.

**Requirements:**
- The given `owner` exists.

**Effects:**
- Returns all files owned by the user with status "uploaded", along with their filenames.

**Request Body:**
```json
{
  "owner": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "file": "ID",
    "filename": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

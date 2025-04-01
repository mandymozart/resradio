# ResRadio API Documentation

This document provides information about the ResRadio API endpoints hosted as Netlify functions.

## Base URL

When running locally with Netlify Dev:
```
http://localhost:8888/.netlify/functions/[endpoint-name]
```

In production:
```
https://[your-site-name].netlify.app/.netlify/functions/[endpoint-name]
```

## Endpoints

### User

**Endpoint:** `/user`  
**Method:** GET  
**Purpose:** Retrieves user information by email address.

**Query Parameters:**
- `email` (required): The email address of the user to retrieve.

**Response:**
```json
{
  "email": "user@example.com",
  "fullName": "User Name"
}
```

**Error Responses:**
- 401: Missing email parameter
- 500: Server error

---

### Broadcasts

**Endpoint:** `/broadcasts`  
**Method:** GET  
**Purpose:** Retrieves broadcasts scheduled within a specific time range.

**Query Parameters:**
- `beginBefore` (required): ISO-8601 date string - get broadcasts that begin before this time
- `endAfter` (required): ISO-8601 date string - get broadcasts that end after this time
- `from` (optional): Pagination start index (default: 0)
- `to` (optional): Pagination end index (default: 0)

**Response:**
```json
[
  {
    "title": "Broadcast Title",
    "hostedBy": "Host Name",
    "prismicId": "broadcast-id",
    "begin": "2023-01-01T12:00:00Z",
    "end": "2023-01-01T13:00:00Z"
  }
]
```

**Error Responses:**
- 400: Missing beginBefore or endAfter parameter
- 500: Server error

---

### Create Playlist Entry

**Endpoint:** `/create-playlist-entry`  
**Method:** GET  
**Purpose:** Creates a new broadcast record in the database.

**Query Parameters:**
- `uid` (required): Unique identifier for the broadcast
- `title` (required): Title of the broadcast
- `hostedby` (required): Name of the host
- `begin` (required): ISO-8601 date string for the start time
- `end` (required): ISO-8601 date string for the end time

**Response:**
```json
{
  "id": 123,
  "message": "Broadcast created successfully"
}
```

**Error Responses:**
- 401: Missing uid parameter
- 500: Server error

---

### Get Playbacks

**Endpoint:** `/get-playbacks`  
**Method:** GET  
**Purpose:** Returns the count of playbacks for a specific broadcast.

**Query Parameters:**
- `uid` (required): The prismic ID of the broadcast

**Response:**
```json
42
```
(A single number representing the count)

**Error Responses:**
- 401: Missing uid parameter
- 500: Server error

---

### Log Playback

**Endpoint:** `/log-playback`  
**Method:** GET  
**Purpose:** Records a new playback instance for a broadcast.

**Query Parameters:**
- `uid` (required): The prismic ID of the broadcast
- `referenceText` (required): Reference text for the playback
- `hostedbyUid` (required): The prismic ID of the host/show
- `date` (required): ISO-8601 date string for when the playback occurred
- `timezone` (optional): Timezone for the playback (defaults to UTC)

**Response:**
```json
{
  "id": 123,
  "message": "Playback logged successfully"
}
```

**Error Responses:**
- 401: Missing uid parameter
- 500: Server error

---

### Identity Signup

**Endpoint:** `/identity-signup___`  
**Method:** POST  
**Purpose:** Handles user registration with Netlify Identity service and stores user data in MySQL.

This endpoint is triggered by Netlify Identity when a new user signs up. It creates a new user record in the MySQL database if the user doesn't already exist. It's not meant to be called directly from client applications.

**Request Body Format:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "User Name"
    }
  }
}
```

**Response:**
```json
{
  "app_metadata": {
    "roles": ["basic"],
    "app_other_thing": "some app value"
  },
  "user_metadata": {
    "user_other_thing": "some user value"
  }
}
```

**Error Response:**
- 500: Server error

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message"
}
```

## Authentication

Most endpoints do not require authentication as they're accessible publicly. However, some operations may be restricted in the future and require proper authentication.

## Data Types

- All date/time values should be provided in ISO-8601 format (YYYY-MM-DDTHH:MM:SSZ)
- All IDs are strings unless otherwise specified

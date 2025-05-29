# Build HTTP Server 
A lightweight, fully-functional HTTP server built from scratch using Node.js. This implementation handles HTTP/1.1 protocol parsing, file operations, compression, and proper connection management without relying on any HTTP frameworks.

## Features
- 🌐 **HTTP/1.1 Protocol Support** - Complete request parsing and response handling
- 📁 **File Operations** - Upload and download files with proper MIME types
- 🗜️ **Gzip Compression** - Automatic content compression when supported by client
- 🔧 **Custom Headers** - Full header parsing and User-Agent detection
- ⚡ **Raw Socket Handling** - Direct TCP connection management
- 📂 **Configurable Directory** - Set custom file serving directory

## Getting Started

### Prerequisites

- Node.js (v14 or higher)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd http-server
```

2. No additional dependencies required! Uses only Node.js built-in modules.

### Running the Server

Start the server with default settings:
```bash
node app/main.js
```

Start the server with custom file directory:
```bash
node app/main.js --directory ./your-custom-directory
```

The server will start on `http://localhost:4221`

## API Endpoints

### Basic Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Returns 200 OK (root endpoint) |
| GET | `/index.html` | Returns 200 OK (index page) |

### Echo Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/echo/{message}` | Returns the message in the URL path |

**Example:**
```bash
curl http://localhost:4221/echo/hello-world
# Returns: hello-world
```

### User Agent

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user-agent` | Returns the client's User-Agent header |

**Example:**
```bash
curl -H "User-Agent: MyApp/1.0" http://localhost:4221/user-agent
# Returns: MyApp/1.0
```

### File Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files/{filename}` | Download a file from the server directory |
| POST | `/files/{filename}` | Upload/create a file in the server directory |

**Examples:**
```bash
# Download a file
curl http://localhost:4221/files/sample.txt

# Upload a file
curl -X POST -d "File content here" http://localhost:4221/files/newfile.txt
```

## Testing the Server

### Basic Functionality
```bash
# Test root endpoint
curl -v http://localhost:4221/

# Test echo functionality
curl -v http://localhost:4221/echo/hello-world

# Test 404 handling
curl -v http://localhost:4221/nonexistent
```

### Compression Support
```bash
# Test gzip compression
curl -v -H "Accept-Encoding: gzip" http://localhost:4221/echo/compress-this-text
```

### File Operations
```bash
# Create test directory and file
mkdir test-files
echo "Hello from file!" > test-files/sample.txt

# Start server with custom directory
node app/main.js --directory ./test-files

# Test file download
curl -v http://localhost:4221/files/sample.txt

# Test file upload
curl -v -X POST -d "New content" http://localhost:4221/files/uploaded.txt
```

### User Agent Testing
```bash
curl -v -H "User-Agent: TestClient/2.0" http://localhost:4221/user-agent
```

## Project Structure

```
├── app/
│   ├── main.js              # Main server file
│   ├── handleConnection.js  # Request routing and parsing
│   └── sendResponse.js      # Response handlers
└── README.md
```

## Technical Implementation

### Core Technologies
- **Node.js Net Module** - Raw TCP socket handling
- **Node.js FS Module** - File system operations
- **Node.js Zlib Module** - Gzip compression
- **HTTP/1.1 Protocol** - Manual implementation of HTTP parsing

### Key Features Explained

**HTTP Request Parsing**
- Manual parsing of HTTP request headers
- Support for request body handling
- Proper URL and method extraction

**Compression**
- Automatic gzip compression based on `Accept-Encoding` header
- Proper Content-Encoding and Content-Length headers

**File Handling**
- Streaming file operations for memory efficiency
- Support for binary files with `application/octet-stream` MIME type
- Configurable base directory for file operations

**Connection Management**
- Proper socket lifecycle management
- Support for Connection: close header
- Error handling for malformed requests

## Error Handling

The server handles various error conditions:
- **404 Not Found** - For undefined routes
- **File Not Found** - When requesting non-existent files
- **Invalid Requests** - Graceful handling of malformed HTTP requests

## Performance Considerations

- Uses streaming for file operations to handle large files efficiently
- Implements proper socket cleanup to prevent memory leaks
- Gzip compression reduces bandwidth usage significantly

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

MIT License - feel free to use this code for learning and personal projects.

---

**Built with ❤️ using vanilla Node.js - no frameworks, just pure networking fundamentals!**
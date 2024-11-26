# custom_server.py
import http.server
import socketserver
import mimetypes

PORT = 8007

# Ensure '.js' files are served with 'application/javascript' MIME type
mimetypes.init()  # Initialize the mimetypes
mimetypes.add_type('application/javascript', '.js')

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()

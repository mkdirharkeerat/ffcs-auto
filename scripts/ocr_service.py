import http.server
import socketserver
import json
import base64
import subprocess
import os
import re

VISION_BIN = "/tmp/vision_ocr"

# Compile Vision OCR if not already compiled
if not os.path.exists(VISION_BIN):
    swift_src = """import Foundation
import Vision
import AppKit

guard CommandLine.arguments.count > 1 else { exit(1) }
let path = CommandLine.arguments[1]
guard let img = NSImage(contentsOfFile: path),
      let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { exit(1) }

let req = VNRecognizeTextRequest { r, _ in
    guard let obs = r.results as? [VNRecognizedTextObservation] else { return }
    let s = obs.compactMap { $0.topCandidates(1).first?.string }.joined()
    print(s)
}
req.recognitionLevel = .accurate
req.usesLanguageCorrection = false
let h = VNImageRequestHandler(cgImage: cg, options: [:])
try? h.perform([req])
"""
    with open("/tmp/vision.swift", "w") as f:
        f.write(swift_src)
    subprocess.run(["swiftc", "/tmp/vision.swift", "-o", VISION_BIN])

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/ocr':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode('utf-8', 'ignore')
            try:
                data = json.loads(body)
                img_b64 = data.get('image', '')
                if ',' in img_b64:
                    img_b64 = img_b64.split(',', 1)[1]
                raw_bytes = base64.b64decode(img_b64)
                tmp_img = "/tmp/vtop_captcha_temp.jpg"
                with open(tmp_img, "wb") as f:
                    f.write(raw_bytes)
                
                res = subprocess.run([VISION_BIN, tmp_img], capture_output=True, text=True)
                raw_text = res.stdout.strip().replace(" ", "").upper()
                clean_text = re.sub(r'[^A-Z0-9]', '', raw_text)
                print(f"[OCR] Recognized: '{clean_text}' (raw: '{raw_text}')")
                
                resp = json.dumps({"success": True, "text": clean_text}).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"success": False, "error": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(resp)
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    os.chdir('/Users/harkeerat/Downloads/ffcs')
    server = socketserver.TCPServer(("127.0.0.1", 8999), CustomHandler)
    server.allow_reuse_address = True
    print("Serving FFCS & Apple Vision OCR on http://127.0.0.1:8999 ...")
    server.serve_forever()

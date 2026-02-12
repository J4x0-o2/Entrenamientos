#!/usr/bin/env python3
"""
Script simple para servir la PWA localmente
Uso: python3 serve.py
Luego abre: http://localhost:8000
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 8000
SCRIPT_DIR = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar headers para PWA y CORS
        self.send_header('Service-Worker-Allowed', '/')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Log personalizado
        print(f'[SERVER] {format % args}')

def run_server():
    # Cambiar al directorio del script
    os.chdir(SCRIPT_DIR)
    
    Handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"""
╔═══════════════════════════════════════════════════════════╗
║                 4x Full Body PWA - Local Server           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  🚀 Servidor iniciado en:                                ║
║     http://localhost:{PORT}                              ║
║                                                           ║
║  📱 En otros dispositivos:                                ║
║     http://[tu_ip]:{PORT}                                ║
║                                                           ║
║  📂 Sirviendo desde:                                      ║
║     {SCRIPT_DIR}                                         ║
║                                                           ║
║  ⌨️  Presiona CTRL+C para detener                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
""")
            httpd.serve_forever()
    
    except KeyboardInterrupt:
        print("\n\n✅ Servidor detenido correctamente")
    except OSError as e:
        print(f"❌ Error: {e}")
        if e.errno == 48 or e.errno == 98:
            print(f"   El puerto {PORT} ya está en uso")
            print(f"   Intenta: python3 serve.py --port 8001")

if __name__ == "__main__":
    run_server()

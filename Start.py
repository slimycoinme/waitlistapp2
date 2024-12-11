import os
import subprocess
import time
import sys
import requests
from urllib.error import URLError
import socket

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def wait_for_server(url, timeout=30):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            requests.get(url)
            return True
        except requests.RequestException:
            time.sleep(1)
    return False

def kill_process_by_port(port):
    try:
        # Find process ID using port
        netstat = subprocess.run(
            f'netstat -ano | findstr :{port}',
            shell=True,
            capture_output=True,
            text=True
        )
        
        if netstat.stdout:
            for line in netstat.stdout.split('\n'):
                if f':{port}' in line and 'LISTENING' in line:
                    pid = line.strip().split()[-1]
                    subprocess.run(f'taskkill /F /PID {pid}', shell=True, capture_output=True)
                    time.sleep(1)  # Wait for process to be killed
    except:
        pass

def run_npm_install(directory):
    print(f"\nInstalling dependencies in {directory}...")
    result = subprocess.run(
        "npm install",
        shell=True,
        cwd=directory,
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print(f"Error installing dependencies: {result.stderr}")
        return False
    return True

def restart_services():
    # Kill existing processes
    if is_port_in_use(3000):
        print("Stopping backend server...")
        kill_process_by_port(3000)
    
    if is_port_in_use(5173):
        print("Stopping frontend server...")
        kill_process_by_port(5173)
    
    # Get directories
    root_dir = os.path.dirname(os.path.abspath(__file__))
    server_dir = os.path.join(root_dir, 'server')
    
    # Install dependencies
    if not run_npm_install(server_dir):
        print("Failed to install backend dependencies!")
        return
    
    if not run_npm_install(root_dir):
        print("Failed to install frontend dependencies!")
        return
    
    # Start backend
    print("\nStarting backend server...")
    backend_process = subprocess.Popen(
        "npm start",
        shell=True,
        cwd=server_dir
    )
    
    # Wait for backend to be ready
    print("Waiting for backend server...")
    if not wait_for_server('http://localhost:3000/api/health', timeout=30):
        print("ERROR: Backend server failed to start!")
        backend_process.kill()
        return
    
    # Start frontend
    print("Starting frontend server...")
    frontend_process = subprocess.Popen(
        "npm run dev",
        shell=True,
        cwd=root_dir
    )
    
    # Wait for frontend to be ready
    print("Waiting for frontend server...")
    if not wait_for_server('http://localhost:5173', timeout=30):
        print("ERROR: Frontend server failed to start!")
        frontend_process.kill()
        if backend_process.poll() is None:
            backend_process.kill()
        return
    
    print("\nServers started successfully!")
    print("Frontend: http://localhost:5173")
    print("Backend: http://localhost:3000")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "restart":
        restart_services()
    else:
        print("Usage: py Start.py restart")

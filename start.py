import subprocess
import sys
import signal
import os
import platform

ROOT = os.path.dirname(__file__)
BACKEND = os.path.join(ROOT, "backend")
FRONTEND = os.path.join(ROOT, "frontend")


def main():
    procs = []

    try:
        print("🚀 Iniciando FinTrack Premium...")

        system = platform.system()
        if system == "Windows":
            venv_python = os.path.join(BACKEND, "venv", "Scripts", "python.exe")
        else:
            venv_python = os.path.join(BACKEND, "venv", "bin", "python")
        
        python_exe = venv_python if os.path.exists(venv_python) else sys.executable

        backend = subprocess.Popen(
            [python_exe, "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"],
            cwd=BACKEND,
        )
        procs.append(backend)
        print("✅ Backend rodando em http://localhost:8000")
        print("📖 Swagger UI em http://localhost:8000/docs")

        frontend = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=FRONTEND,
        )
        procs.append(frontend)
        print("✅ Frontend rodando em http://localhost:5173")
        print("\nCtrl+C para encerrar ambos.\n")

        for p in procs:
            p.wait()

    except KeyboardInterrupt:
        print("\n🛑 Encerrando...")
        for p in procs:
            p.terminate()
        sys.exit(0)


if __name__ == "__main__":
    main()
